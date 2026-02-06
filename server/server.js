require('dotenv').config();
const cluster = require('cluster');
const os = require('os');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running. Spawning ${numCPUs} workers...`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Spawning replacement...`);
        cluster.fork();
    });
} else {
    const app = express();
    const PORT = process.env.PORT || 5000;

    // Security & Performance Middleware
    app.use(helmet()); // Secure HTTP headers
    app.use(compression()); // Gzip compression

    // Rate Limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.'
    });
    app.use('/api/', limiter);

    // Standard Middleware
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }));
    app.use(express.json());
    app.use(cookieParser());
    app.use(passport.initialize());

    // Database Connection
    mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hazaquran')
        .then(() => console.log(`Worker ${process.pid}: MongoDB Connected`))
        .catch(err => console.error(`Worker ${process.pid}: MongoDB Connection Error:`, err));

    // Routes
    const authRoutes = require('./routes/authRoutes');
    const userRoutes = require('./routes/userRoutes');

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);

    app.get('/', (req, res) => {
        res.send('HazaQuran API Running');
    });

    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started on port ${PORT}`);
    });
}
