require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET; 

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
};

if (fs.existsSync('./ca.pem')) {
    console.log('Applying SSL configuration for Aiven database.');
    dbConfig.ssl = {
        rejectUnauthorized: true,
        ca: fs.readFileSync('./ca.pem').toString(),
    };
}

let db;

async function initializeDatabase() {
    try {
        db = mysql.createConnection(dbConfig).promise();
        await db.query('SELECT 1');
        console.log('MySQL Database connection successful.');
    } catch (error) {
        console.error('DATABASE CONNECTION FAILED:', error.message);
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/register', async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;
    if (!firstName || !lastName || !username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [rows] = await db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
        if (rows.length > 0) {
            return res.status(409).json({ message: 'User with this email or username already exists.' });
        }
        const sql = 'INSERT INTO users (firstName, lastName, username, email, password) VALUES (?, ?, ?, ?, ?)';
        await db.query(sql, [firstName, lastName, username, email, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const user = rows[0];
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, CONCAT(firstName, " ", lastName) AS name, email FROM users WHERE id = ?', [req.user.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    await initializeDatabase();
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server started on http://0.0.0.0:${PORT}`);
    });
};

startServer();