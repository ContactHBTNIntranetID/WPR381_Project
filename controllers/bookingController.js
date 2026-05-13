const Booking = require('../models/Booking');
const Event = require('../models/Event');

exports.showBookingPage = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).render('error', {
                message: 'Event not found',
                user: req.user
            });
        }
        
        res.render('bookings/create', {
            title: `Book Tickets - ${event.title}`,
            event,
            user: req.user,
            error: null
        });
    } catch (error) {
        console.error('Booking page error:', error);
        res.status(500).render('error', {
            message: 'Error loading booking page',
            user: req.user
        });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const { eventId, numberOfTickets, attendeeDetails } = req.body;
        
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        
        // Validate ticket availability
        if (!event.checkAvailability(parseInt(numberOfTickets))) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient tickets available'
            });
        }
        
        // Calculate total amount
        const totalAmount = event.price * parseInt(numberOfTickets);
        
        // Create booking
        const booking = await Booking.create({
            user: req.user._id,
            event: eventId,
            numberOfTickets: parseInt(numberOfTickets),
            totalAmount,
            attendeeDetails: attendeeDetails || []
        });
        
        // Update event available tickets
        await event.bookTickets(parseInt(numberOfTickets));
        
        res.json({
            success: true,
            bookingReference: booking.bookingReference,
            message: 'Booking confirmed successfully'
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating booking'
        });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('event')
            .sort('-createdAt');
        
        res.render('bookings/history', {
            title: 'My Bookings',
            bookings,
            user: req.user
        });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).render('error', {
            message: 'Error loading bookings',
            user: req.user
        });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('event');
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        
        // Check if user owns this booking
        if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        
        // Check if event is in the future
        if (new Date(booking.event.date) < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel past events'
            });
        }
        
        // Update booking status
        booking.status = 'cancelled';
        booking.cancelledAt = new Date();
        await booking.save();
        
        // Return tickets to event
        const event = await Event.findById(booking.event._id);
        event.availableTickets += booking.numberOfTickets;
        await event.save();
        
        res.json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking'
        });
    }
};