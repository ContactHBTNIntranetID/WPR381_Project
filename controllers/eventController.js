const Event = require('../models/Event');

exports.getAllEvents = async (req, res) => {
    try {
        let query = {};
        
        // Search functionality
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        }
        
        // Filter by category
        if (req.query.category && req.query.category !== 'all') {
            query.category = req.query.category;
        }
        
        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        } else {
            query.status = 'upcoming';
        }
        
        // Date filtering
        if (req.query.date) {
            const startDate = new Date(req.query.date);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1);
            query.date = { $gte: startDate, $lt: endDate };
        }
        
        // Sorting
        let sort = {};
        if (req.query.sort) {
            switch(req.query.sort) {
                case 'date_asc':
                    sort.date = 1;
                    break;
                case 'date_desc':
                    sort.date = -1;
                    break;
                case 'price_asc':
                    sort.price = 1;
                    break;
                case 'price_desc':
                    sort.price = -1;
                    break;
                default:
                    sort.date = 1;
            }
        } else {
            sort.date = 1;
        }
        
        const events = await Event.find(query)
            .sort(sort)
            .limit(50);
        
        // Get unique categories for filter
        const categories = await Event.distinct('category');
        
        res.render('events/index', {
            title: 'Events',
            events,
            categories,
            filters: req.query,
            user: req.user
        });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).render('error', {
            message: 'Error loading events',
            user: req.user
        });
    }
};

exports.getEventDetails = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).render('error', {
                message: 'Event not found',
                user: req.user
            });
        }
        
        res.render('events/details', {
            title: event.title,
            event,
            user: req.user
        });
    } catch (error) {
        console.error('Event details error:', error);
        res.status(500).render('error', {
            message: 'Error loading event',
            user: req.user
        });
    }
};

exports.showCreateForm = (req, res) => {
    res.render('events/create', {
        title: 'Create Event',
        user: req.user,
        error: null
    });
};

exports.createEvent = async (req, res) => {
    try {
        const eventData = {
            ...req.body,
            createdBy: req.user._id
        };
        
        const event = await Event.create(eventData);
        res.redirect(`/events/${event._id}`);
    } catch (error) {
        console.error('Create event error:', error);
        res.render('events/create', {
            title: 'Create Event',
            user: req.user,
            error: error.message
        });
    }
};

exports.showEditForm = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).render('error', {
                message: 'Event not found',
                user: req.user
            });
        }
        
        res.render('events/edit', {
            title: 'Edit Event',
            event,
            user: req.user,
            error: null
        });
    } catch (error) {
        console.error('Edit form error:', error);
        res.status(500).render('error', {
            message: 'Error loading edit form',
            user: req.user
        });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).render('error', {
                message: 'Event not found',
                user: req.user
            });
        }
        
        // Recalculate ticketsRemaining when capacity changes
        const ticketDiff = req.body.capacity - event.capacity;
        req.body.ticketsRemaining = (event.ticketsRemaining || 0) + ticketDiff;
        
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        res.redirect(`/events/${updatedEvent._id}`);
    } catch (error) {
        console.error('Update event error:', error);
        res.render('events/edit', {
            title: 'Edit Event',
            event: await Event.findById(req.params.id),
            user: req.user,
            error: error.message
        });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting event'
        });
    }
};