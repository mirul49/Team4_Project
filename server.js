const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve HTML, CSS and JavaScript files
app.use(express.static(__dirname));


// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017/typerush_db';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB!');
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });


// User model
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);


// Score model
const scoreSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    score: {
        type: Number,
        required: true,
        default: 0
    },
    timeMode: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Score = mongoose.model('Score', scoreSchema);


// Register endpoint
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required.'
        });
    }

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                message: 'That username is taken.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();

        res.json({
            success: true,
            message: 'Registration successful!'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server registration error.'
        });
    }
});


// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required.'
        });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({
                message: 'Username or password incorrect.'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: 'Username or password incorrect.'
            });
        }

        res.json({
            success: true,
            username: user.username
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server login error.'
        });
    }
});


// Save score endpoint
app.post('/api/leaderboard', async (req, res) => {
    const { username, score, timeMode } = req.body;

    const numericScore = Number(score);
    const numericTimeMode = Number(timeMode);

    if (
        !username ||
        Number.isNaN(numericScore) ||
        ![20, 30].includes(numericTimeMode)
    ) {
        return res.status(400).json({
            message: 'Username, score and a valid time mode are required.'
        });
    }

    try {
        const existingScore = await Score.findOne({
            username,
            timeMode: numericTimeMode
        });

        // Only save the user's best score
        if (existingScore) {
            if (numericScore > existingScore.score) {
                existingScore.score = numericScore;
                existingScore.createdAt = new Date();

                await existingScore.save();
            }

            return res.json({
                success: true,
                message: 'Score checked successfully.'
            });
        }

        const newScore = new Score({
            username,
            score: numericScore,
            timeMode: numericTimeMode
        });

        await newScore.save();

        res.json({
            success: true,
            message: 'Score saved successfully.'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Unable to save score.'
        });
    }
});


// Get leaderboard endpoint
app.get('/api/leaderboard', async (req, res) => {
    const timeMode = Number(req.query.timeMode || req.query.time || 20);

    if (![20, 30].includes(timeMode)) {
        return res.status(400).json({
            message: 'Time mode must be 20 or 30.'
        });
    }

    try {
        const scores = await Score.find({ timeMode })
            .sort({ score: -1, createdAt: 1 })
            .limit(100)
            .select('username score timeMode -_id');

        res.json(scores);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Unable to load leaderboard.'
        });
    }
});


// Clear leaderboard
app.delete('/api/leaderboard', async (req, res) => {
    const timeMode = Number(req.query.timeMode || req.query.time);

    try {
        if ([20, 30].includes(timeMode)) {
            await Score.deleteMany({ timeMode });
        } else {
            await Score.deleteMany({});
        }

        res.json({
            success: true,
            message: 'Leaderboard cleared.'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Unable to clear leaderboard.'
        });
    }
});


// HTML routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'game.html'));
});

app.get('/leaderboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'leaderboard.html'));
});

app.get('/result', (req, res) => {
    res.sendFile(path.join(__dirname, 'result.html'));
});

app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'settings.html'));
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
