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
        const { eventId, ticketCount } = req.body;
        const count = parseInt(ticketCount);

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Manual availability check (checkAvailability method does not exist on model)
        if (event.ticketsRemaining < count) {
            return res.status(400).json({
                success: false,
                message: `Only ${event.ticketsRemaining} ticket(s) remaining`
            });
        }

        // Create booking using correct schema field names
        const booking = await Booking.create({
            userId: req.user._id,
            eventId,
            ticketCount: count
        });

        // Deduct tickets from event
        event.ticketsRemaining -= count;
        await event.save();

        res.json({
            success: true,
            bookingId: booking._id,
            message: 'Booking confirmed successfully'
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ success: false, message: error.message || 'Error creating booking' });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('eventId')
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
        const booking = await Booking.findById(req.params.id).populate('eventId');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Check ownership
        if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        // Prevent cancelling past events
        if (new Date(booking.eventId.date) < new Date()) {
            return res.status(400).json({ success: false, message: 'Cannot cancel past events' });
        }

        booking.status = 'cancelled';
        await booking.save();

        // Return tickets to event pool
        const event = await Event.findById(booking.eventId._id);
        event.ticketsRemaining += booking.ticketCount;
        await event.save();

        res.json({ success: true, message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({ success: false, message: 'Error cancelling booking' });
    }
};
