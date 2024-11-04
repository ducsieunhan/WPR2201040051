const userModel = require('../models/userModel');
const emailModel = require('../models/emailModel');
const multer = require('multer');
const path = require('path');
const { error } = require('console');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../public/uploads');
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDir)
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + file.fieldname + '-' + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        const filetypes = /jpeg|jpg|PNG|pdf|txt|docx|xls|xlsx/i;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return callback(null, true);
        }
        callback(new Error('Only images and documents are allowed!!!'));
    }
}).array('attachments', 5);

// const compose = async (req, res) => {
//     const { currentUserId } = req.cookies.userId;
//     const users = await userModel.getAllUserNames(currentUserId);

//     res.render('email/compose', { users });
// };

const sendEmail = async (req, res) => {

    upload(req, res, async (error) => {

        if (error) {
            console.error('Upload error:', error);
            return res.status(400).json({ error: error.message });
        }

        // console.log( req.files);
        // console.log( req.body);

        try {
            const { receiverId, subject, body } = req.body;
            const senderId = req.cookies.userId;

            let attachment = null;
            if (req.files && req.files.length > 0) {
                attachment = JSON.stringify(req.files.map(file => ({
                    filename: file.filename,
                    originalname: file.originalname,
                    path: '/uploads/' + file.filename
                })));
            }

            await emailModel.createNewEmail(senderId, receiverId, subject, body, attachment, new Date());
            res.redirect('/outbox');
        } catch (error) {
            console.log('Error sending email: ' + error);
            res.status(500).json({ error: 'Error sending email' });
        }
    })

};

const inbox = async (req, res) => {
    const currentUserId = req.cookies.userId;
    const page = parseInt(req.query.page) || 1;
    const { emails, totalPages, currentPage } = await emailModel.getEmailsByUserId(currentUserId, page);
    // console.log('Emails:', emails);
    res.render('email/homepage', { emails, totalPages, currentPage, userName: res.locals.userName });
};

const viewDetailEmail = async (req, res) => {
    const emailId = req.params.id;
    const emailDetail = await emailModel.getDetailEmail(emailId);

    res.render('email/detail', { emailDetail, userName: res.locals.userName });
};

const outbox = async (req, res) => {
    const currentUserId = req.cookies.userId;
    const page = parseInt(req.query.page) || 1;
    const { emails, totalPages, currentPage } = await emailModel.getEmailSender(currentUserId, page);
    // console.log('Emails:', emails);
    res.render('email/outbox', { emails, totalPages, currentPage, userName: res.locals.userName });
};





module.exports = { sendEmail, inbox, viewDetailEmail, outbox }; 