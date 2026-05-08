//Booking schema defines the structure of booking documents in the MongoDB collection.
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // links to the User collection
      required: [true, 'User is required'],
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event', // links to the Event collection
      required: [true, 'Event is required'],
    },
    ticketCount: {
      type: Number,
      required: [true, 'Ticket count is required'],
      min: [1, 'Must book at least 1 ticket'],
      max: [10, 'Cannot book more than 10 tickets at once'],
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
