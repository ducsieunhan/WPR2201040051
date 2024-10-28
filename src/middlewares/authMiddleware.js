const authMiddleware = (req, res, next) => {
    if (!req.cookies.userId) {
        return res.redirect('/auth/login');
    }
    next;
}

module.exports = authMiddleware; 