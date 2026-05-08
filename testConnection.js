//test connection to database
require('dotenv').config();
const connectDB = require('./config/db');
const mongoose = require('mongoose');

const test = async () => {
  await connectDB();
  console.log('Connection test passed!');
  await mongoose.connection.close();
};

test();