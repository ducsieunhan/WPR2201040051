const db = require('../models/db');

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
        `);

        await db.query(`
           CREATE TABLE IF NOT EXISTS delete_emails (
             email_id INT PRIMARY KEY,
             sender_deleted BOOLEAN DEFAULT FALSE,
             receiver_deleted BOOLEAN DEFAULT FALSE,
             FOREIGN KEY (email_id) REFERENCES emails(id) ON DELETE CASCADE
);
        `)

        await db.query(`
            INSERT IGNORE INTO user (full_name, email, password)
            VALUES 
                ('User A', 'a@a.com', '123'),
                ('User B', 'b@b.com', '123456'),
                ('User C', 'c@c.com', '123456');
        `);

        await db.query(`
            INSERT INTO emails (sender_id, receiver_id, subject, body)
            VALUES 
                (1, 2, 'Hello from A to B', 'This is the first email from A to B.'),
                (2, 1, 'Reply from B to A', 'Replying back from B to A.'),
                (3, 1, 'Hello from C to A', 'This is an email from C to A.'),
                (1, 3, 'Greetings from A to C', 'Hello C, this is A!'),
                (2, 3, 'Message from B to C', 'Hello C, how are you from B!'),
                (3, 2, 'Hi B from C', 'Checking in on B from C!'),
                (1, 2, 'Another one from A to B', 'Another email from A to B.'),
                (2, 1, 'And a final reply from B to A', 'Final email from B to A.');
        `);

        console.log("Successfully!!!");

    } catch (err) {
        console.error('error at creating table: ' + err)
    }
}

module.exports = setUpDB;