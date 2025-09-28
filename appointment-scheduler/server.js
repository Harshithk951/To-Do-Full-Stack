const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');

const app = express();

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'http://localhost:3000',
            'http://localhost:3001',
            /\.vercel\.app$/
        ];
        
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (typeof allowedOrigin === 'string') {
                return origin === allowedOrigin;
            } else if (allowedOrigin instanceof RegExp) {
                return allowedOrigin.test(origin);
            }
            return false;
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const requiredEnvVars = ['JWT_SECRET', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    console.log('Please set these in your Render dashboard:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
}

const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '104431383148-4ubgun7hqoicil5bppqrvdam7r0hhv37.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

let db;
const initializeDatabase = async () => {
    try {
        const connectionConfig = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
            ssl: {
                rejectUnauthorized: true
            },
            acquireTimeout: 60000,
            timeout: 60000,
            reconnect: true,
            multipleStatements: false
        };

        if (fs.existsSync('./ca.pem')) {
            connectionConfig.ssl.ca = fs.readFileSync('./ca.pem').toString();
            console.log('Using custom CA certificate');
        }

        db = mysql.createConnection(connectionConfig).promise();

        await db.execute('SELECT 1 as test');
        console.log('Database connected successfully to Aiven MySQL');
        console.log(`Connected to: ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`);
        console.log(`Database: ${process.env.DB_NAME}`);
        
        await createDemoUser();
    } catch (error) {
        console.error('Database connection failed:', error.message);
        console.log('Connection details check:');
        console.log('   - DB_HOST:', process.env.DB_HOST ? 'Set' : 'Missing');
        console.log('   - DB_USER:', process.env.DB_USER ? 'Set' : 'Missing');
        console.log('   - DB_PASSWORD:', process.env.DB_PASSWORD ? 'Set' : 'Missing');
        console.log('   - DB_NAME:', process.env.DB_NAME ? 'Set' : 'Missing');
        
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

const createDemoUser = async () => {
    if (!db) {
        console.log('Database not available. Skipping demo user creation.');
        return;
    }

    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                firstName VARCHAR(255) NOT NULL,
                lastName VARCHAR(255) NOT NULL,
                username VARCHAR(255) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(100) DEFAULT 'User',
                location VARCHAR(255) DEFAULT '',
                avatar VARCHAR(500) DEFAULT '',
                resetPasswordToken VARCHAR(255) DEFAULT NULL,
                resetPasswordExpires DATETIME DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `;
        
        await db.execute(createTableQuery);
        console.log('Users table verified/created');

        const [rows] = await db.execute('SELECT * FROM users WHERE email = ? OR username = ?', ['admin@demo.com', 'admin_user']);
        
        if (rows.length === 0) {
            console.log('Creating demo user...');
            const hashedPassword = await bcrypt.hash('demopassword', 12);
            const sql = `INSERT INTO users (firstName, lastName, username, email, password, role, location, avatar) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            await db.execute(sql, [
                'Admin', 
                'Demo', 
                'admin_user', 
                'admin@demo.com', 
                hashedPassword, 
                'Administrator', 
                'Global', 
                ''
            ]);
            console.log('Demo user created successfully!');
            console.log('Email: admin@demo.com');
            console.log('Password: demopassword');
        } else {
            console.log('Demo user already exists');
        }
    } catch (error) {
        console.error('Error with demo user setup:', error.message);
    }
};

let transporter;
try {
    transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || "smtp.ethereal.email",
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER || 'lennie.bins@ethereal.email',
            pass: process.env.EMAIL_PASS || '4G5yJz1rCgReBFdGuP',
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    console.log('Email transporter configured');
} catch (error) {
    console.error('Email configuration failed:', error.message);
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) {
        return res.status(401).json({ message: 'Access token required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'No Origin'}`);
    next();
});

app.get('/health', async (req, res) => {
    const healthCheck = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: 'Not Connected',
        frontend_url: process.env.FRONTEND_URL || 'Not Set',
        version: process.env.npm_package_version || '1.0.0'
    };
    
    try {
        if (db) {
            await db.execute('SELECT 1');
            healthCheck.database = 'Connected';
        }
    } catch (error) {
        healthCheck.database = 'Error';
        healthCheck.database_error = error.message;
    }
    
    res.json(healthCheck);
});

app.options('*', cors(corsOptions));

app.post('/register', async (req, res) => {
    if (!db) {
        return res.status(503).json({ message: 'Database service unavailable' });
    }

    const { firstName, lastName, username, email, password } = req.body;
    
    if (!firstName?.trim() || !lastName?.trim() || !username?.trim() || !email?.trim() || !password) {
        return res.status(400).json({ message: 'All fields are required and cannot be empty.' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address.' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ? OR username = ?', [email.toLowerCase(), username.toLowerCase()]);
        
        if (rows.length > 0) {
            const existingUser = rows[0];
            if (existingUser.email === email.toLowerCase()) {
                return res.status(400).json({ message: 'An account with this email already exists.' });
            } else {
                return res.status(400).json({ message: 'This username is already taken.' });
            }
        }
        
        const sql = `INSERT INTO users (firstName, lastName, username, email, password, role, location, avatar) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        await db.execute(sql, [
            firstName.trim(), 
            lastName.trim(), 
            username.toLowerCase().trim(), 
            email.toLowerCase().trim(), 
            hashedPassword, 
            'User', 
            '', 
            ''
        ]);
        
        console.log('New user registered:', email);
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

app.post('/login', async (req, res) => {
    console.log('Login attempt from:', req.get('Origin'));
    
    if (!db) {
        return res.status(503).json({ message: 'Database service unavailable' });
    }

    const { email, password } = req.body;
    
    if (!email?.trim() || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    
    try {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE username = ? OR email = ?', 
            [email.toLowerCase().trim(), email.toLowerCase().trim()]
        );
        
        if (rows.length === 0) {
            console.log('User not found:', email);
            return res.status(400).json({ message: 'Invalid email or password.' });
        }
        
        const user = rows[0];
        console.log('User found:', { id: user.id, email: user.email });
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            console.log('Password incorrect for:', email);
            return res.status(400).json({ message: 'Invalid email or password.' });
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );
        
        try {
            await db.execute('UPDATE users SET updated_at = NOW() WHERE id = ?', [user.id]);
        } catch (updateError) {
            console.log('Could not update last login time:', updateError.message);
        }
        
        console.log('Login successful for:', email);
        res.json({ 
            token,
            user: {
                id: user.id,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                role: user.role,
                avatar: user.avatar || ''
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});

app.post('/forgot-password', async (req, res) => {
    if (!db) {
        return res.status(503).json({ message: 'Database service unavailable' });
    }

    const { email } = req.body;
    if (!email?.trim()) {
        return res.status(400).json({ message: 'Email is required.' });
    }
    
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
        
        const successMessage = 'If an account with this email exists, a password reset link has been sent.';
        
        if (rows.length === 0) {
            return res.status(200).json({ message: successMessage });
        }
        
        const user = rows[0];
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000);
        
        await db.execute(
            'UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE id = ?', 
            [token, expires, user.id]
        );
        
        const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;
        
        if (transporter) {
            const info = await transporter.sendMail({
                from: '"Todo Dashboard App" <no-reply@tododashboard.com>',
                to: user.email,
                subject: 'Password Reset Request',
                html: `
                    <h2>Password Reset Request</h2>
                    <p>You requested a password reset for your account.</p>
                    <p>Click the link below to reset your password:</p>
                    <a href="${resetURL}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you did not request this, please ignore this email.</p>
                `,
            });
            console.log("Password reset email sent. Preview URL:", nodemailer.getTestMessageUrl(info));
        }
        
        res.status(200).json({ message: successMessage });
    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

app.get('/api/user/profile', authenticateToken, async (req, res) => {
  if (!db) {
      return res.status(503).json({ message: 'Database service unavailable' });
  }

  try {
    const [rows] = await db.execute('SELECT id, CONCAT(firstName, " ", lastName) AS name, email, role, location, avatar FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
  if (!db) {
      return res.status(503).json({ message: 'Database service unavailable' });
  }

  const { name, email, role, location, avatar } = req.body;
  const [firstName, ...lastNameParts] = name.split(' ');
  const lastName = lastNameParts.join(' ');
  try {
    const sql = 'UPDATE users SET firstName = ?, lastName = ?, email = ?, role = ?, location = ?, avatar = ? WHERE id = ?';
    await db.execute(sql, [firstName || '', lastName || '', email, role || '', location || '', avatar || '', req.user.id]);
    res.json({ message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await initializeDatabase();
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
    console.log(`CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log(`JWT Secret: ${JWT_SECRET ? 'Set' : 'Not Set'}`);
  });
};

startServer().catch(console.error);