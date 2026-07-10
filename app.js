const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

app.use(express.json());
app.use(express.static(path.join(__dirname)));

function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed.users) ? parsed.users : [];
  } catch (error) {
    console.error('Unable to read users data:', error);
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users }, null, 2));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/register', (req, res) => {
  const { username, password } = req.body || {};
  const cleanUsername = username ? username.trim() : '';
  const cleanPassword = password ? password.trim() : '';

  if (!cleanUsername || !cleanPassword) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  const users = readUsers();
  const existingUser = users.find((user) => user.username.toLowerCase() === cleanUsername.toLowerCase());

  if (existingUser) {
    return res.status(409).json({ success: false, message: 'That username already exists.' });
  }

  users.push({ username: cleanUsername, password: cleanPassword });
  writeUsers(users);

  return res.status(201).json({ success: true, message: 'Account created successfully.' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  const cleanUsername = username ? username.trim() : '';
  const cleanPassword = password ? password.trim() : '';

  if (!cleanUsername || !cleanPassword) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  const users = readUsers();
  const matchedUser = users.find((user) => user.username.toLowerCase() === cleanUsername.toLowerCase());

  if (!matchedUser || matchedUser.password !== cleanPassword) {
    return res.status(401).json({ success: false, message: 'Incorrect username or password.' });
  }

  return res.json({ success: true, username: matchedUser.username, message: 'Login successful.' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});