const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Serve TM Model statically
app.use('/model', express.static(path.join(__dirname, '../../ai_model')));

app.get('/', (req, res) => {
    res.send('SoundSee Backend is running');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const soundRoutes = require('./routes/soundRoutes');
const userRoutes = require('./routes/userRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/sounds', soundRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
