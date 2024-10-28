const db = require('./db');

const getEmailsByUserId = async (receiverID) => {
    var sql = `SELECT * FROM emails WHERE receiver_id = ? ORDER BY timestamp DESC`;
    const [rows] = await db.query(sql, [receiverID]);
    console.log('Successfully find emails of user!!!');
    return rows;
}

const createNewEmail = async (senderId, receiverId, subject, body, attachment, timestamp) => {
    var sql = `INSERT INTO users (sender_id, receiver_id, subject, body, attachment, timestamp) 
                VALUES (?, ?, ?, ?, ?, ?)`;

    const [result] = await db.query(sql, [senderId, receiverId, subject, body, attachment]);
    console.log('Successfully create new email!!!');

    return result.insertId;
}

module.exports = { getEmailsByUserId, createNewEmail }; 