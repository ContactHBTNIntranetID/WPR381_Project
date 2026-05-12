const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/event/:eventId', isAuthenticated, bookingController.showBookingPage);
router.post('/create', isAuthenticated, bookingController.createBooking);
router.get('/my-bookings', isAuthenticated, bookingController.getUserBookings);
router.delete('/cancel/:id', isAuthenticated, bookingController.cancelBooking);

module.exports = router;