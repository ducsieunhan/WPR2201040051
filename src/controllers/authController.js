const userModel = require('../models/userModel');

const register = async (req, res) => {
    const { fullName, email, password } = req.body;

    const checkUser = await userModel.findUserByEmail(email);
    if (checkUser) { // if exist
        return res.render('/auth/failReg', { message: "Email already exists" });
    }
    await userModel.createNewUser(fullName, email, password);
    res.redirect('/login');
}

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findUserByEmail(email);

    if (!user || user.password != password) {
        return res.render('/auth/failLogin', { message: "Something wrong with input!!" });
    }

    res.cookie('userId', user.id, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.redirect('/inbox');
}

const logout = (req, res) => {
    res.clearCookie('userId');
    res.redirect('/auth/login')
}

module.exports = { register, login, logout }; 