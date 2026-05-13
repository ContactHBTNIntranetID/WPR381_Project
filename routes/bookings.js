// routes/bookings.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { isAuthenticated } = require('../middleware/auth');

router.post('/book', isAuthenticated, bookingController.bookTicket);
router.get('/dashboard', isAuthenticated, bookingController.dashboard);
router.post('/bookings/cancel/:id', isAuthenticated, bookingController.cancelBooking);

module.exports = router;
