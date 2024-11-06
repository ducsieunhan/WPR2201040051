const db = require('./db');

const getEmailsByUserId = async (receiverID, page = 1, limit = 5) => {
    const offset = (page - 1) * limit;

    var sql = `
        SELECT e.*, u.full_name as sender_name, 
        DATE_FORMAT(e.timestamp, '%M %d, %Y %h:%i %p') as formatted_time
        FROM emails e
        JOIN user u ON e.sender_id = u.id
        LEFT JOIN delete_emails d ON e.id = d.email_id
        WHERE e.receiver_id = ? AND (d.receiver_deleted IS NULL OR d.receiver_deleted = FALSE)     
        ORDER BY e.timestamp DESC
        LIMIT ? OFFSET ?
    `;
    const countSql = `
    SELECT COUNT(*) as total 
    FROM emails e
    LEFT JOIN delete_emails d ON e.id = d.email_id
    WHERE e.receiver_id = ? AND (d.receiver_deleted IS NULL OR d.receiver_deleted = FALSE) 
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
        SELECT e.*, u.full_name as receiver_name,       
        DATE_FORMAT(e.timestamp, '%M %d, %Y %h:%i %p') as formatted_time
        FROM emails e
        JOIN user u ON e.receiver_id = u.id
        LEFT JOIN delete_emails d ON e.id = d.email_id
        WHERE e.sender_id = ? 
        AND (d.sender_deleted IS NULL OR d.sender_deleted = FALSE)
        ORDER BY e.timestamp DESC
        LIMIT ? OFFSET ?
    `;
    const countSql = `
    SELECT COUNT(*) as total 
    FROM emails e
    LEFT JOIN delete_emails d ON e.id = d.email_id
    WHERE sender_id = ? AND (d.sender_deleted IS NULL OR d.sender_deleted = FALSE)
    `;

    const [emails] = await db.query(sql, [senderId, limit, offset]);
    const [countEmails] = await db.query(countSql, [senderId]);
    const totalEmail = countEmails[0].total;
    console.log('Successfully find emails of user!!!');
    // console.log(emails[0].receiver_name);


    return { emails, totalPages: Math.ceil(totalEmail / limit), currentPage: page };
}

const deleteEmailsFromReceiver = async (emailsId, receiverID) => {
    const sql = `INSERT INTO delete_emails (email_id, receiver_deleted) values (?, TRUE)
    ON DUPLICATE KEY UPDATE receiver_deleted = TRUE` ;

    const promises = emailsId.map(emailId => db.query(sql, [emailId]));
    await Promise.all(promises);
    // const [result] = await db.query(sql, [emailsId, userId]);
    // return result.affectedRows;
}

const deleteEmailsFromSender = async (emailsId, userId) => {
    const sql = `INSERT INTO delete_emails (email_id, sender_deleted) values (?, TRUE)
    ON DUPLICATE KEY UPDATE sender_deleted = TRUE` ;
    // console.log("Here is model: " + emailsId);

    const promises = emailsId.map(emailId => db.query(sql, [emailId]));
    await Promise.all(promises);
    // const [result] = await db.query(sql, [emailsId, userId]);
    // return result.affectedRows;
}



module.exports = { getEmailsByUserId, createNewEmail, getDetailEmail, getEmailSender, deleteEmailsFromReceiver, deleteEmailsFromSender }; 