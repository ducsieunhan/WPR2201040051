const db = require('./db');

const findUserByEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM user WHERE email = ? ', [email]);
    return rows[0];
}

const findUserById = async (id) => {
    const [rows] = await db.query('SELECT * FROM user WHERE id = ? ', [id]);
    return rows[0];
}

const createNewUser = async (fullName, email, password) => {
    var sql = `INSERT INTO user (full_name, email, password) 
                VALUES (?, ?, ?)`;

    const [result] = await db.query(sql, [fullName, email, password]);
    console.log('Successfully create new user!!!!');
    return result.insertId;
}

module.exports = { findUserByEmail, createNewUser, findUserById }; 