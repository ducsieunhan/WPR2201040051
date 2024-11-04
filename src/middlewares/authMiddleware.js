const userModel = require('../models/userModel');

const authMiddleware = (req, res, next) => {
    if (!req.cookies.userId) {
        return res.redirect('/auth/error403');
    }
    next();
}

const getAllUsers = async (req, res, next) => {
    try {
        if (req.cookies.userId) {
            const currentUserId = req.cookies.userId;
            const users = await userModel.getAllUserNames(currentUserId);
            res.locals.users = users;
        } else {
            res.locals.users = null;
        }
        next();
    } catch (err) {
        res.locals.userName = null;
        next();
    }
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


module.exports = { authMiddleware, checkUser, getAllUsers }; 