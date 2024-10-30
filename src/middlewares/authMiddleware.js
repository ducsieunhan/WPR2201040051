const userModel = require('../models/userModel');

const authMiddleware = (req, res, next) => {
    if (!req.cookies.userId) {
        return res.redirect('/auth/login');
    }
    next();
}

const checkUser = async (req, res, next) => {
    try {
        if (req.cookies.userId) {
            const user = await userModel.findUserById(req.cookies.userId);
            if (user) {
                res.locals.userName = user.full_name;
            } else {
                res.locals.userName = null;
            }
        } else {
            res.locals.userName = null;
        }
        next();
    } catch (err) {
        res.locals.userName = null;
        next();
    }
}


module.exports = { authMiddleware, checkUser }; 