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


router.get('/error403', (req, res) => {
    res.render('error/403', { message: '', data: {} });
})


router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);

module.exports = router;   