const Enquiry = require('../models/Enquiry');

exports.showContactPage = (req, res) => {
    res.render('enquiries/contact', {
        title: 'Contact Us',
        user: req.user,
        error: null,
        success: null
    });
};

exports.submitEnquiry = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const enquiryData = { name, email, subject, message };

        if (req.user) {
            enquiryData.userId = req.user._id;
        }
        
        await Enquiry.create(enquiryData);
        
        res.render('enquiries/contact', {
            title: 'Contact Us',
            user: req.user,
            error: null,
            success: 'Your enquiry has been submitted successfully. We\'ll get back to you soon.'
        });
    } catch (error) {
        console.error('Submit enquiry error:', error);
        res.render('enquiries/contact', {
            title: 'Contact Us',
            user: req.user,
            error: error.message || 'Error submitting enquiry',
            success: null
        });
    }
};

exports.getEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find()
            .populate('userId', 'name email')
            .sort('-createdAt');
        
        res.render('enquiries/manage', {
            title: 'Manage Enquiries',
            user: req.user,
            enquiries
        });
    } catch (error) {
        console.error('Get enquiries error:', error);
        res.status(500).render('error', {
            message: 'Error loading enquiries',
            user: req.user
        });
    }
};

exports.updateEnquiryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const enquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            { 
                status,
                'adminResponse.respondedBy': req.user._id,
                'adminResponse.respondedAt': new Date()
            },
            { new: true }
        );
        
        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: 'Enquiry not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Enquiry status updated'
        });
    } catch (error) {
        console.error('Update enquiry error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating enquiry'
        });
    }
};

exports.replyToEnquiry = async (req, res) => {
    try {
        const { reply } = req.body;
        
        const enquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            {
                'adminResponse.message': reply,
                'adminResponse.respondedBy': req.user._id,
                'adminResponse.respondedAt': new Date(),
                status: 'resolved'
            },
            { new: true }
        );
        
        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: 'Enquiry not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Reply sent successfully'
        });
    } catch (error) {
        console.error('Reply enquiry error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending reply'
        });
    }
};