const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});    
        }
    }
    return res.status(300).json({message: "Unable to register user."});
});

// Task 1: Get the book list available in the shop
public_users.get('/',async function (req, res) {
    // res.send(JSON.stringify(books,null,4));

    // Task 10
    const getBooks = () => {
        return new Promise((resolve,reject) => {
            if (books){
                resolve(books);
            } else {
                reject(new Error("Book not available"));
            }
        });
    }

    // Task 10
    getBooks().then((books) => {
        res.json(books);
    }).catch((err) =>{
      res.status(500).json({error: `An error occured`});
    });
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    /*
    const isbn = req.params.isbn;
    const findIsbn = await books[isbn];
    if (findIsbn) {
        res.send(findIsbn);
    } else {
        res.send("ISBN cannot be found in the book details");
    }
    */

    // Task 11
    const isbn = req.params.isbn;
    const findIsbn = (isbn) => {
        return new Promise((resolve, reject) => {
            let isbnNum = parseInt(isbn);
            if (books[isbnNum]) {
                resolve(books[isbnNum]);
            } else {
                reject({ status: 404, message: `ISBN ${isbn} cannot be found in the book details`});
            }
        });
    };

    // Task 11
    findIsbn(isbn).then((books) => {
        res.json(books);
    }).catch((err)=>{
        res.status(400).json({error:`ISBN ${isbn} cannot be found in the book details`})
    });
});
  
// Task 3: Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    /*
    const author = req.params.author;
    const bookList = await Object.values(books);
    const findByAuthor = await bookList.filter((book) => book.author === author);
    
    if (findByAuthor.length > 0) {
        res.send(findByAuthor);
    } else {
        res.send("Book not found by this author");
    }
    */

    // Task 12
    const author = req.params.author;
    const getBooks = () => {
        return new Promise((resolve,reject) => {
            if (books){
                resolve(books);
            } else {
                reject(new Error("Book not available"));
            }
        });
    }

    // Task 12
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.author === author))
    .then((filteredBooks) => res.send(filteredBooks));
});

// Task 4: Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    /*
    const title = req.params.title;
    const bookList = await Object.values(books);
    const findByTitle = await bookList.filter((book) => book.title === title);

    if (findByTitle.length > 0) {
        res.send(findByTitle);
      } else {
        res.send("Book title not found");
    }
    */

    // Task 13
    const title = req.params.title;
    const getBooks = () => {
        return new Promise((resolve,reject) => {
            if (books){
                resolve(books);
            } else {
                reject(new Error("Book not available"));
            }
        });
    }

    // Task 13
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.title === title))
    .then((filteredBooks) => res.send(filteredBooks));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const review = books[isbn]?.reviews;

    if (review) {
        res.send(review);
    } else {
        res.send("Book review not found for this isbn");
    }
});

module.exports.general = public_users;
