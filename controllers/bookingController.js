// controllers/bookingController.js
const Booking = require('../models/Booking');
const Event = require('../models/Event');

exports.bookTicket = async (req, res) => {
  const { eventId, ticketCount } = req.body;
  const event = await Event.findById(eventId);

  if (event.ticketsRemaining >= ticketCount) {
    await Booking.create({
      userId: req.session.user._id,
      eventId,
      ticketCount,
      status: 'confirmed'
    });
    event.ticketsRemaining -= ticketCount;
    await event.save();
    res.redirect('/dashboard');
  } else {
    res.status(400).send('Not enough tickets available');
  }
};

exports.dashboard = async (req, res) => {
  const bookings = await Booking.find({ userId: req.session.user._id })
    .populate('eventId');
  res.render('dashboard', { bookings });
};

exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('eventId');
  if (booking) {
    booking.status = 'cancelled';
    await booking.save();

    // restore tickets
    booking.eventId.ticketsRemaining += booking.ticketCount;
    await booking.eventId.save();
  }
  res.redirect('/dashboard');
};
