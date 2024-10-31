const userModel = require('../models/userModel');
const emailModel = require('../models/emailModel');

const compose = async (req, res) => {
    const { currentUserId } = req.cookies.userId;
    const users = await userModel.getAllUserNames(currentUserId);

    res.render('email/compose', { users });
}

const sendEmail = async (req, res) => {
    const { receiverId, subject, body } = req.body;
    const senderId = req.cookies.userId;

    await emailModel.createNewEmail(senderId, receiverId, subject, body, null, new Date());
    res.redirect('/outbox');
}

const inbox = async (req, res) => {
    const currentUserId = req.cookies.userId;
    const page = parseInt(req.query.page) || 1;
    const { emails, totalPages, currentPage } = await emailModel.getEmailsByUserId(currentUserId, page);
    console.log('Emails:', emails);
    res.render('email/homepage', { emails, totalPages, currentPage, userName: res.locals.userName });
}

const viewDetailEmail = async (req, res) => {
    const emailId = req.params.id;
    const emailDetail = await emailModel.getDetailEmail(emailId);

    res.render('email/detail', { emailDetail, userName: res.locals.userName });
}

const outbox = async (req, res) => {
    const currentUserId = req.cookies.userId;
    const page = parseInt(req.query.page) || 1;
    const { emails, totalPages, currentPage } = await emailModel.getEmailSender(currentUserId, page);
    console.log('Emails:', emails);
    res.render('email/homepage', { emails, totalPages, currentPage, userName: res.locals.userName });
}

module.exports = { compose, sendEmail, inbox, viewDetailEmail, outbox }; 