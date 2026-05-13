//Event schema defines the structure of event documents in the MongoDB collection.
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['conference', 'workshop', 'festival', 'private', 'other'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    venue: {
        type: String,
        required: [true, 'Venue is required'],
        trim: true
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    ticketsRemaining: {
      type: Number,
      min: [0, 'Tickets remaining cannot be negative'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  }
);

// Automatically set ticketsRemaining = capacity when a new event is created
eventSchema.pre('save', async function () {
  if (this.isNew) {
    this.ticketsRemaining = this.capacity;
  }
});

module.exports = mongoose.model('Event', eventSchema);
