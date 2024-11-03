const db = require('./db');

const getEmailsByUserId = async (receiverID, page = 1, limit = 5) => {
    const offset = (page - 1) * limit;

    var sql = `
        SELECT e.*, u.full_name as sender_name, 
        DATE_FORMAT(e.timestamp, '%M %d, %Y %h:%i %p') as formatted_time
        FROM emails e
        JOIN user u ON e.sender_id = u.id
        WHERE e.receiver_id = ? AND receiver_id IS NOT NULL     
        ORDER BY e.timestamp DESC
        LIMIT ? OFFSET ?
    `;
    const countSql = `
    SELECT COUNT(*) as total 
    FROM emails 
    WHERE receiver_id = ? AND receiver_Id IS NOT NULL 
    `;

    const [emails] = await db.query(sql, [receiverID, limit, offset]);
    const [countEmails] = await db.query(countSql, [receiverID]);
    const totalEmail = countEmails[0].total;
    console.log('Successfully find emails of user!!!');

    return { emails, totalPages: Math.ceil(totalEmail / limit), currentPage: page };
}

const createNewEmail = async (senderId, receiverId, subject, body, attachment, timestamp) => {
    var sql = `INSERT INTO emails (sender_id, receiver_id, subject, body, attachment, timestamp) 
                VALUES (?, ?, ?, ?, ?, ?)`;

    const [result] = await db.query(sql, [senderId, receiverId, subject, body, attachment, new Date()]);
    console.log('Successfully create new email!!!');

    return result.insertId;
}

const getDetailEmail = async (emailId) => {
    var sql = `
        SELECT e.*, u.full_name as sender_name, 
        DATE_FORMAT(e.timestamp, '%M %d, %Y %h:%i %p') as formatted_time, 
        attachment
        FROM emails e
        JOIN user u ON e.sender_id = u.id
        WHERE e.id = ? 
         `;

    const [detailEmail] = await db.query(sql, emailId);
    const email = detailEmail[0];
    if (email.attachment) {
        email.attachment = JSON.parse(email.attachment);
    }

    return email;
}

const getEmailSender = async (senderId, page = 1, limit = 5) => {
    const offset = (page - 1) * limit;
    // chưa fix sender_name (receiver_name)
    var sql = `
        SELECT e.*, u.full_name as sender_name,       
        DATE_FORMAT(e.timestamp, '%M %d, %Y %h:%i %p') as formatted_time
        FROM emails e
        JOIN user u ON e.receiver_id = u.id
        WHERE e.sender_id = ? 
        ORDER BY e.timestamp DESC
        LIMIT ? OFFSET ?
    `;
    const countSql = `
    SELECT COUNT(*) as total 
    FROM emails 
    WHERE sender_id = ?
    `;

    const [emails] = await db.query(sql, [senderId, limit, offset]);
    const [countEmails] = await db.query(countSql, [senderId]);
    const totalEmail = countEmails[0].total;
    console.log('Successfully find emails of user!!!');

    return { emails, totalPages: Math.ceil(totalEmail / limit), currentPage: page };
}

const deleteEmails = async (emailsId, userId) => {
    const sql = `UPDATE emails SET receiver_id = 13
    WHERE id IN (?) AND receiver_id = ?` ;

    const [result] = await db.query(sql, [emailsId, userId]);
    return result.affectedRows;
}




module.exports = { getEmailsByUserId, createNewEmail, getDetailEmail, getEmailSender, deleteEmails }; 