const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { isAuthenticated } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

// Admin only routes — must be before /:id or Express matches "admin" as an event ID
router.get('/admin/create', isAuthenticated, isAdmin, eventController.showCreateForm);
router.post('/admin/create', isAuthenticated, isAdmin, eventController.createEvent);
router.get('/admin/edit/:id', isAuthenticated, isAdmin, eventController.showEditForm);
router.put('/admin/edit/:id', isAuthenticated, isAdmin, eventController.updateEvent);
router.delete('/admin/delete/:id', isAuthenticated, isAdmin, eventController.deleteEvent);

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventDetails);

module.exports = router;