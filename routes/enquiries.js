// routes/enquiries.js
const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const Enquiry = require('../models/Enquiry');

// Public contact form
router.get('/contact', (req, res) => res.render('contact'));
router.post('/contact', enquiryController.submitEnquiry);

// Admin: view all enquiries
router.get('/enquiries', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).send('Forbidden');
  }

  const enquiries = await Enquiry.find()
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

  res.render('admin-enquiries', { enquiries });
});

// Admin: update enquiry status
router.post('/enquiries/update/:id', async (req, res) => {
  const { status } = req.body;
  await Enquiry.findByIdAndUpdate(req.params.id, { status });
  res.redirect('/enquiries');
});

module.exports = router;
