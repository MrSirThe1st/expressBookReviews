const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Helper function to check if a username is valid
const isValid = (username) => {
  return username && username.trim().length > 0; // Check if username is not empty
};

// Helper function to check if the username and password match the records
const authenticatedUser = (username, password) => {
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  return user !== undefined;
};

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;

  // Check if review and isbn are provided
  if (!review || !isbn) {
    return res
      .status(400)
      .json({ message: "ISBN and review text are required" });
  }

  // Extract username from JWT token (session)
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let username;
  try {
    const decoded = jwt.verify(token, "your_secret_key");
    username = decoded.username;
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }


  if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review updated successfully" });
  } else {
    // Add new review
    if (!books[isbn]) {
      books[isbn] = { reviews: {} };
    }
    books[isbn].reviews[username] = review;
    return res.status(201).json({ message: "Review added successfully" });
  }
});

regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;


  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }


  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add the new user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
