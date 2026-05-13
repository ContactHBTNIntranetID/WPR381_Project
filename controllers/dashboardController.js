const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Enquiry = require('../models/Enquiry');

exports.getAdminDashboard = async (req, res) => {
    try {
        // Get statistics
        const totalEvents = await Event.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalRevenue = await Booking.aggregate([
            { $match: { status: 'confirmed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        
        // Popular events
        const popularEvents = await Booking.aggregate([
            { $match: { status: 'confirmed' } },
            { $group: { _id: '$event', bookings: { $sum: 1 }, tickets: { $sum: '$numberOfTickets' } } },
            { $sort: { bookings: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'events', localField: '_id', foreignField: '_id', as: 'event' } },
            { $unwind: '$event' }
        ]);
        
        // Recent bookings
        const recentBookings = await Booking.find()
            .populate('user', 'name email')
            .populate('event', 'title')
            .sort('-createdAt')
            .limit(10);
        
        // Capacity usage
        const events = await Event.find();
        const capacityUsage = events.map(event => ({
            title: event.title,
            used: event.bookedTickets,
            total: event.totalCapacity,
            percentage: (event.bookedTickets / event.totalCapacity) * 100
        })).sort((a, b) => b.percentage - a.percentage).slice(0, 5);
        
        // Monthly bookings trend
        const monthlyBookings = await Booking.aggregate([
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { '_id': 1 } }
        ]);
        
        res.render('dashboard/admin', {
            title: 'Admin Dashboard',
            user: req.user,
            stats: {
                totalEvents,
                totalBookings,
                totalUsers,
                totalRevenue: totalRevenue[0]?.total || 0
            },
            popularEvents,
            recentBookings,
            capacityUsage,
            monthlyBookings
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).render('error', {
            message: 'Error loading dashboard',
            user: req.user
        });
    }
};

exports.getUserDashboard = async (req, res) => {
    try {
        // Get user's bookings
        const bookings = await Booking.find({ user: req.user._id })
            .populate('event')
            .sort('-createdAt')
            .limit(10);
        
        // Statistics
        const totalBookings = await Booking.countDocuments({ user: req.user._id });
        const totalSpent = await Booking.aggregate([
            { $match: { user: req.user._id, status: 'confirmed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        
        // Upcoming events
        const upcomingBookings = await Booking.find({ 
            user: req.user._id,
            status: 'confirmed'
        })
            .populate('event')
            .sort('event.date')
            .limit(5);
        
        res.render('dashboard/user', {
            title: 'My Dashboard',
            user: req.user,
            bookings,
            stats: {
                totalBookings,
                totalSpent: totalSpent[0]?.total || 0
            },
            upcomingBookings
        });
    } catch (error) {
        console.error('User dashboard error:', error);
        res.status(500).render('error', {
            message: 'Error loading dashboard',
            user: req.user
        });
    }
};