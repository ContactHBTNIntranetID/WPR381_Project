// controllers/eventController.js
const Event = require('../models/Event');

exports.listEvents = async (req, res) => {
  const events = await Event.find();
  res.render('home', { events });
};

exports.createEvent = async (req, res) => {
  await Event.create(req.body);
  res.redirect('/admin-events');
};

exports.updateEvent = async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/admin-events');
};

exports.deleteEvent = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.redirect('/admin-events');
};

exports.adminPage = async (req, res) => {
  const events = await Event.find();
  res.render('admin-events', { events });
};
