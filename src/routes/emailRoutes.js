const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const emailController = require('../controllers/emailController');
const router = express.Router();

router.get('/homepage', authMiddleware, emailController.inbox);

router.get('/outbox', authMiddleware, emailController.outbox)
router.get('/compose', authMiddleware, (req, res) => {
    res.render('email/compose', { message: '', users: res.locals.users });
})

router.get('/detail/:id', authMiddleware, emailController.viewDetailEmail);

router.post('/compose', emailController.sendEmail);


module.exports = router;  