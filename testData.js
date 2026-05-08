require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Import models
const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');
const Enquiry = require('./models/Enquiry');

const runTest = async () => {
  await connectDB();

  // 1. Show counts
  const userCount = await User.countDocuments();
  const eventCount = await Event.countDocuments();
  const bookingCount = await Booking.countDocuments();
  const enquiryCount = await Enquiry.countDocuments();

  console.log('Current DB Counts:');
  console.log(`Users: ${userCount}`);
  console.log(`Events: ${eventCount}`);
  console.log(`Bookings: ${bookingCount}`);
  console.log(`Enquiries: ${enquiryCount}`);

  // 2. Insert a quick test user
  try {
    const testUser = await User.create({
      name: `Test User${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: 'mypassword123', // raw password, will be hashed by model
      role: 'user',
    });
    console.log("Added Test User:", testUser.email);
    console.log("Stored Password Hash:", testUser.password);

    // Verify password using matchPassword
    const isMatch = await testUser.matchPassword('mypassword123');
    console.log("Password check (mypassword123):", isMatch); // should be true
  } catch (err) {
    if (err.code === 11000) {
      console.log("Test User already exists, skipping insert.");
    } else {
      throw err;
    }
  }

  // 3. Remove one event (if exists)
  const event = await Event.findOne();
  if (event) {
    await Event.findByIdAndDelete(event._id);
    console.log(`Deleted Event: ${event.title}`);
  } else {
    console.log('No events found to delete.');
  }

  // 4. Add a new event
  const newEvent = await Event.create({
    title: 'Test Event',
    description: 'This is a test event.',
    category: 'other',
    date: new Date(),
    location: 'Pretoria',
    capacity: 50,
    price: 100,
  });
  console.log('Added Event:', newEvent.title);


// Replace with an actual userId from your Users collection
const userId = "69fdfb089e95f339b3e96887";

try {
  // Find all enquiries for this user
  const userEnquiries = await Enquiry.find({ userId: userId })
    .populate("userId", "name email"); // show user details

  console.log("Enquiries for User:", userEnquiries);
} catch (err) {
  console.error("Error fetching enquiries:", err);
}


  await mongoose.connection.close();
};

runTest().catch(err => {
  console.error('Test failed:', err);
  mongoose.connection.close();
});
