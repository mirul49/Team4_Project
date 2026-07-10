const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Optional: allows Express to serve your HTML, CSS and JS files
app.use(express.static(__dirname));

const usersFile = path.join(__dirname, "data", "users.json");

function readUsers() {
  try {
    const data = fs.readFileSync(usersFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Unable to read users.json:", error);
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Register
app.post("/api/register", (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required."
    });
  }

  if (username.length < 3) {
    return res.status(400).json({
      success: false,
      message: "Username must contain at least 3 characters."
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must contain at least 6 characters."
    });
  }

  const users = readUsers();

  const existingUser = users.find(
    user => user.username.toLowerCase() === username.toLowerCase()
  );

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "That username is already registered."
    });
  }

  users.push({
    id: Date.now(),
    username,
    password
  });

  saveUsers(users);

  res.status(201).json({
    success: true,
    username,
    message: "Account created successfully."
  });
});

// Login
app.post("/api/login", (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required."
    });
  }

  const users = readUsers();

  const user = users.find(
    account =>
      account.username.toLowerCase() === username.toLowerCase() &&
      account.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Incorrect username or password."
    });
  }

  res.json({
    success: true,
    username: user.username,
    message: "Login successful."
  });
});

app.listen(PORT, () => {
  console.log(`TypeRush server running at http://localhost:${PORT}`);
});