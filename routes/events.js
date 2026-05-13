const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { isAdmin } = require('../middleware/auth');

// Public route: list events
router.get('/', eventController.listEvents);

// Admin routes
router.get('/admin-events', isAdmin, eventController.adminPage);
router.post('/admin-events/create', isAdmin, eventController.createEvent);
router.post('/admin-events/update/:id', isAdmin, eventController.updateEvent);
router.post('/admin-events/delete/:id', isAdmin, eventController.deleteEvent);

module.exports = router;
