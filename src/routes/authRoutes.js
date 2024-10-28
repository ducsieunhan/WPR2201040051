const express = require('express');

const authController = require('../controllers/authController');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render("/auth/login");
})

router.get('/register', (req, res) => {
    res.render("/auth/register");
})

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);

module.exports = router;   