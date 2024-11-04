const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const emailController = require('../controllers/emailController');
const emailModel = require('../models/emailModel');
const router = express.Router();

router.get('/homepage', authMiddleware, emailController.inbox);

router.get('/outbox', authMiddleware, emailController.outbox)
router.get('/compose', authMiddleware, (req, res) => {
    res.render('email/compose', { message: '', users: res.locals.users });
})

router.get('/detail/:id', authMiddleware, emailController.viewDetailEmail);

router.post('/compose', authMiddleware, emailController.sendEmail);

router.post('/delete-receiver', authMiddleware, async (req, res) => {
    try {
        const { emailsId } = req.body;
        console.log('here is delete receiver: ' + emailsId);

        const currentUserId = req.cookies.userId;

        const deletedEmails = await emailModel.deleteEmailsFromReceiver(emailsId, currentUserId);
        res.json({ success: true, deletedEmails });
    } catch (error) {
        console.error('Error deleting emails:', error);
        res.status(500).json({ success: false, error: 'Failed to delete emails' });
    }
})

router.post('/delete-sender', authMiddleware, async (req, res) => {
    try {
        const { emailsId } = req.body;
        console.log('here is delete sender: ' + emailsId);

        const currentUserId = req.cookies.userId;

        const deletedEmails = await emailModel.deleteEmailsFromSender(emailsId, currentUserId);
        res.json({ success: true, deletedEmails });
    } catch (error) {
        console.error('Error deleting emails:', error);
        res.status(500).json({ success: false, error: 'Failed to delete emails' });
    }
})


module.exports = router;  