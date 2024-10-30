const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('auth/login', { message: '', data: {} });
})

router.get('/register', (req, res) => {
    res.render('auth/register', { message: '', data: {} });
})

router.get('/homepage', authMiddleware, (req, res) => {
    res.render('auth/homepage', { userName: res.locals.userName });
})

router.get('/outbox', authMiddleware, (req, res) => {
    res.render('auth/outbox', { message: '', data: {} });
})
router.get('/compose', authMiddleware, (req, res) => {
    res.render('auth/compose', { message: '', data: {} });
})

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);

module.exports = router;   