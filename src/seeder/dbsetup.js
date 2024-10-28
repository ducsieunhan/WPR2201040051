const db = require('../models/db');
// const bcrypt = require('bcrypt');

async function setUpDB() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS user (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            full_name VARCHAR(255) NOT NULL, 
            email VARCHAR(100) NOT NULL UNIQUE, 
            password VARCHAR(100) NOT NULL ); 
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS emails (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            sender_id INT NOT NULL, 
            receiver_id INT NOT NULL, 
            subject VARCHAR(255) NOT NULL, 
            body TEXT, 
            attachment VARCHAR(500),
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
            FOREIGN KEY (sender_id) REFERENCES user(id), 
            FOREIGN KEY (receiver_id) REFERENCES user(id) );
        `)

        console.log("Successfully!!!");

    } catch (err) {
        console.error('error at creating table: ' + err)
    } finally {
        db.end();
    }
}

setUpDB(); 