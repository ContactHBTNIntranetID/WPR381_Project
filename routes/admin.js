// routes/admin.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');

// Admin dashboard
router.get('/admin-dashboard', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).send('Forbidden');
  }

  // Total bookings
  const totalBookings = await Booking.countDocuments();

  // Popular events (top 5 by tickets sold)
const popularEvents = await Booking.aggregate([
  { $group: { _id: "$eventId", totalTickets: { $sum: "$ticketCount" } } },
  {
    $lookup: {
      from: "events",            // collection name in MongoDB
      localField: "_id",         // eventId from Booking
      foreignField: "_id",       // _id in Event
      as: "eventDetails"
    }
  },
  { $unwind: "$eventDetails" },
  { $sort: { totalTickets: -1 } },
  { $limit: 5 }
]);

  // Capacity usage
  const events = await Event.find();
  const capacityUsage = events.map(ev => ({
  title: ev.title,
  used: ev.ticketsRemaining != null ? (ev.capacity - ev.ticketsRemaining) : 0,
  capacity: ev.capacity
}));

  res.render('admin-dashboard', {
    totalBookings,
    popularEvents,
    capacityUsage
  });
});

module.exports = router;
