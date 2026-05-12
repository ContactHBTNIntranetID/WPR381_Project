const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const { isAuthenticated } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

router.get('/contact', enquiryController.showContactPage);
router.post('/submit', enquiryController.submitEnquiry);
router.get('/manage', isAuthenticated, isAdmin, enquiryController.getEnquiries);
router.put('/status/:id', isAuthenticated, isAdmin, enquiryController.updateEnquiryStatus);
router.post('/reply/:id', isAuthenticated, isAdmin, enquiryController.replyToEnquiry);

module.exports = router;