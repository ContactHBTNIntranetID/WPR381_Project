const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { isAuthenticated } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventDetails);

// Admin only routes
router.get('/admin/create', isAuthenticated, isAdmin, eventController.showCreateForm);
router.post('/admin/create', isAuthenticated, isAdmin, eventController.createEvent);
router.get('/admin/edit/:id', isAuthenticated, isAdmin, eventController.showEditForm);
router.put('/admin/edit/:id', isAuthenticated, isAdmin, eventController.updateEvent);
router.delete('/admin/delete/:id', isAuthenticated, isAdmin, eventController.deleteEvent);

module.exports = router;