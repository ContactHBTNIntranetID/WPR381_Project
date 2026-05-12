const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { isAuthenticated } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

router.get('/admin', isAuthenticated, isAdmin, dashboardController.getAdminDashboard);
router.get('/user', isAuthenticated, dashboardController.getUserDashboard);

module.exports = router;