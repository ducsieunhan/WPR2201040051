const userModel = require('../models/userModel');

const register = async (req, res) => {
    const { fullName, email, password } = req.body;
    const data = { fullName, email };

    const checkUser = await userModel.findUserByEmail(email);
    if (checkUser) { // if email exists 
        return res.render('auth/register', {
            message: "Email already exists",
            data
        });
    }
    await userModel.createNewUser(fullName, email, password);
    res.redirect('/auth/login?success=true');
}

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findUserByEmail(email);

    if (!user || user.password != password) {
        return res.render('auth/login', { message: "Wrong password or email is not exist!!", data: { email } });
    }

    res.cookie('userId', user.id, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    // res.locals.userName = user.fullName;
    res.redirect('/homepage');
}

const logout = (req, res) => {
    res.clearCookie('userId');
    res.redirect('/auth/login')
}

module.exports = { register, login, logout }; 