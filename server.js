const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 1. CONNECT TO CLOUD DATABASE
const MONGO_URI = 'mongodb://localhost:27017/typerush_db';

mongoose.connect(MONGO_URI)
    .then(function() { console.log('Connected smoothly to MongoDB Atlas Cloud!'); })
    .catch(function(err) { console.error('Database connection error:', err); });


// 2. DESIGN YOUR USER MODEL (SCHEMA)
// This dictates exactly how a user profile is structured in your database
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);


// 3. REGISTER ENDPOINT
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query the collection to see if someone already owns this username
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ message: 'That username is taken.' });
        }

        // Hash the password securely so it isn't stored in plain text
        const hashedPassword = await bcrypt.hash(password, 10);

        // Build the new document matching our schema layout
        const newUser = new User({
            username: username,
            password: hashedPassword
        });

        // Save it directly into MongoDB
        await newUser.save();
        res.json({ success: true, message: 'Account saved to cloud database!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server registration error.' });
    }
});


// 4. LOGIN ENDPOINT
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user document by username
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(400).json({ message: 'Username or password not recognized.' });
        }

        // Compare the typed password with the encrypted string in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Username or password not recognized.' });
        }

        // If everything checks out, return success
        res.json({ success: true, username: user.username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server login error.' });
    }
});

app.listen(PORT, () => {
    console.log('Server is alive and kicking on http://localhost:' + PORT);
});