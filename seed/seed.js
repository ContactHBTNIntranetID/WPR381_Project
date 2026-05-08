//Use to generate dummy data in the database

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const connectDB = require('../config/db');
const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Enquiry = require('../models/Enquiry');

const seed = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await User.deleteMany();
  await Event.deleteMany();
  await Booking.deleteMany();
  await Enquiry.deleteMany();

  // ── USERS ──────────────────────────────────────────────────────────────────
  console.log('Creating users...');

  const hashedAdmin = await bcrypt.hash('admin123', 10);
  const hashedUser1 = await bcrypt.hash('user123', 10);
  const hashedUser2 = await bcrypt.hash('user123', 10);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@advancedevents.co.za',
    password: hashedAdmin,
    role: 'admin',
  });

  const user1 = await User.create({
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: hashedUser1,
    role: 'user',
  });

  const user2 = await User.create({
    name: 'John Smith',
    email: 'john@example.com',
    password: hashedUser2,
    role: 'user',
  });

  // ── EVENTS ─────────────────────────────────────────────────────────────────
  console.log('Creating events...');

  const events = await Event.insertMany([
    {
      title: 'Tech Summit 2026',
      description:
        'Annual corporate technology conference covering AI, cloud computing, and cybersecurity trends.',
      category: 'conference',
      date: new Date('2026-08-15'),
      location: 'Sandton Convention Centre, Johannesburg',
      capacity: 300,
      price: 750,
      status: 'upcoming',
    },
    {
      title: 'Node.js & Express Workshop',
      description:
        'Hands-on full-day workshop covering Node.js, Express, MongoDB and building REST APIs.',
      category: 'workshop',
      date: new Date('2026-09-05'),
      location: 'Cape Town CBD, Cape Town',
      capacity: 50,
      price: 200,
      status: 'upcoming',
    },
    {
      title: 'Joburg Music Festival',
      description:
        'Outdoor music festival featuring top local and international artists across three stages.',
      category: 'festival',
      date: new Date('2026-10-20'),
      location: 'Constitution Hill, Johannesburg',
      capacity: 2000,
      price: 350,
      status: 'upcoming',
    },
    {
      title: 'Private Corporate Gala',
      description:
        'Exclusive private gala dinner for corporate clients with live entertainment and networking.',
      category: 'private',
      date: new Date('2026-11-10'),
      location: 'The Venue, Melrose Arch, Johannesburg',
      capacity: 100,
      price: 1500,
      status: 'upcoming',
    },
    {
      title: 'Digital Marketing Bootcamp',
      description:
        'Two-day intensive bootcamp covering SEO, social media strategy, and paid advertising.',
      category: 'workshop',
      date: new Date('2026-07-22'),
      location: 'Rosebank, Johannesburg',
      capacity: 80,
      price: 450,
      status: 'upcoming',
    },
  ]);

  // ── BOOKINGS ───────────────────────────────────────────────────────────────
  console.log('Creating bookings...');

  await Booking.create({
    userId: user1._id,
    eventId: events[0]._id, // Tech Summit
    ticketCount: 2,
    status: 'confirmed',
  });

  await Booking.create({
    userId: user1._id,
    eventId: events[2]._id, // Joburg Music Festival
    ticketCount: 4,
    status: 'confirmed',
  });

  await Booking.create({
    userId: user2._id,
    eventId: events[0]._id, // Tech Summit
    ticketCount: 1,
    status: 'confirmed',
  });

  await Booking.create({
    userId: user2._id,
    eventId: events[1]._id, // Node.js Workshop
    ticketCount: 1,
    status: 'cancelled',
  });

  // Update ticketsRemaining to reflect the bookings above
  await Event.findByIdAndUpdate(events[0]._id, { ticketsRemaining: 297 }); // 300 - 2 - 1
  await Event.findByIdAndUpdate(events[1]._id, { ticketsRemaining: 49 });  // 50 - 1
  await Event.findByIdAndUpdate(events[2]._id, { ticketsRemaining: 1996 }); // 2000 - 4

  // ── ENQUIRIES ──────────────────────────────────────────────────────────────
  console.log('Creating enquiries...');

  await Enquiry.create({
    userId: user1._id,
    name: 'Jane Doe',
    email: 'jane@example.com',
    subject: 'Parking at Tech Summit',
    message: 'Is parking available at the Sandton Convention Centre? How much does it cost?',
    status: 'unread',
  });

  await Enquiry.create({
    userId: user2._id,
    name: 'John Smith',
    email: 'john@example.com',
    subject: 'Group booking discount',
    message: 'Do you offer group discounts for the Music Festival if we book more than 10 tickets?',
    status: 'read',
  });

  await Enquiry.create({
    userId: null, // guest user - not logged in
    name: 'Guest User',
    email: 'guest@gmail.com',
    subject: 'Refund policy',
    message: 'What is the refund policy if I need to cancel my booking?',
    status: 'unread',
  });

  // ── DONE ───────────────────────────────────────────────────────────────────
  console.log('\nDatabase seeded successfully!');
  console.log('─────────────────────────────────────────');
  console.log('   LOGIN CREDENTIALS:');
  console.log('   ADMIN → email: admin@advancedevents.co.za | password: admin123');
  console.log('   USER1 → email: jane@example.com           | password: user123');
  console.log('   USER2 → email: john@example.com           | password: user123');
  console.log('─────────────────────────────────────────');
  console.log('   COLLECTIONS CREATED:');
  console.log('   users:     3 documents');
  console.log('   events:    5 documents');
  console.log('   bookings:  4 documents');
  console.log('   enquiries: 3 documents');
  console.log('─────────────────────────────────────────\n');

  await mongoose.connection.close();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  mongoose.connection.close();
});
