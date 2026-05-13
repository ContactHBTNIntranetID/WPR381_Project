// controllers/enquiryController.js
const Enquiry = require('../models/Enquiry');

exports.submitEnquiry = async (req, res) => {
  await Enquiry.create({
    userId: req.session.user ? req.session.user._id : null,
    ...req.body
  });
  res.redirect('/contact');
};

exports.listEnquiries = async (req, res) => {
  const enquiries = await Enquiry.find();
  res.render('admin-enquiries', { enquiries });
};
