const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper function to simulate async operation
const getBooksAsync = () => {
  return new Promise((resolve, reject) => {
    console.log("Promise to get books called");
    setTimeout(() => {
      console.log("Promise to get books resolved");
      resolve(books);
    }, 1000); 
  });
};

const getBookByIsbnAsync = (isbn) => {
  return new Promise((resolve, reject) => {
    console.log(`Promise to get book with ISBN ${isbn} called`);
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        console.log(`Promise to get book with ISBN ${isbn} resolved`);
        resolve(book);
      } else {
        reject("Book not found");
      }
    }, 1000); 
  });
};

const getBooksByAuthorAsync = (author) => {
  return new Promise((resolve, reject) => {
    console.log(`Promise to get books by author ${author} called`);
    setTimeout(() => {
      const booksByAuthor = [];
      for (let key in books) {
        if (books[key].author === author) {
          booksByAuthor.push(books[key]);
        }
      }
      if (booksByAuthor.length > 0) {
        console.log(`Promise to get books by author ${author} resolved`);
        resolve(booksByAuthor);
      } else {
        reject("No books found for this author");
      }
    }, 1000); 
  });
};

const getBooksByTitleAsync = (title) => {
  return new Promise((resolve, reject) => {
    console.log(`Promise to get books with title ${title} called`);
    setTimeout(() => {
      const booksByTitle = [];
      for (let key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          booksByTitle.push(books[key]);
        }
      }
      if (booksByTitle.length > 0) {
        console.log(`Promise to get books with title ${title} resolved`);
        resolve(booksByTitle);
      } else {
        reject("No books found");
      }
    }, 1000); 
  });
};

// Get the book list available in the shop
public_users.get("/", (req, res) => {
  getBooksAsync()
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(500).json({ message: err }));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  getBookByIsbnAsync(isbn)
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err }));
});

// Get book details based on author
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;
  getBooksByAuthorAsync(author)
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(404).json({ message: err }));
});

// Get all books based on title
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;
  getBooksByTitleAsync(title)
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(404).json({ message: err }));
});

//  Get book review
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "No reviews found" });
  }
});

module.exports.general = public_users;
