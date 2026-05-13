const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Enquiry = require('../models/Enquiry');

exports.getAdminDashboard = async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalUsers = await User.countDocuments();

        // Popular events — use correct schema field name: eventId (not event)
        const popularEvents = await Booking.aggregate([
            { $match: { status: 'confirmed' } },
            { $group: { _id: '$eventId', bookings: { $sum: 1 }, tickets: { $sum: '$ticketCount' } } },
            { $sort: { bookings: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'events', localField: '_id', foreignField: '_id', as: 'event' } },
            { $unwind: '$event' }
        ]);

        // Recent bookings — populate using correct field names
        const recentBookings = await Booking.find()
            .populate('userId', 'name email')
            .populate('eventId', 'title')
            .sort('-createdAt')
            .limit(10);

        // Capacity usage — capacity and ticketsRemaining are the actual schema fields
        const events = await Event.find();
        const capacityUsage = events.map(event => {
            const used = event.capacity - event.ticketsRemaining;
            return {
                title: event.title,
                used,
                total: event.capacity,
                percentage: event.capacity > 0 ? (used / event.capacity) * 100 : 0
            };
        }).sort((a, b) => b.percentage - a.percentage).slice(0, 5);

        // Monthly bookings trend
        const monthlyBookings = await Booking.aggregate([
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        res.render('dashboard/admin', {
            title: 'Admin Dashboard',
            user: req.user,
            stats: { totalEvents, totalBookings, totalUsers },
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
        // Use correct schema field: userId (not user)
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('eventId')
            .sort('-createdAt')
            .limit(10);

        const totalBookings = await Booking.countDocuments({ userId: req.user._id });

        const upcomingBookings = await Booking.find({
            userId: req.user._id,
            status: 'confirmed'
        })
            .populate('eventId')
            .sort('-createdAt')
            .limit(5);

        res.render('dashboard/user', {
            title: 'My Dashboard',
            user: req.user,
            bookings,
            stats: { totalBookings },
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
