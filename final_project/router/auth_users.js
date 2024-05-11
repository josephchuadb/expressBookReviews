const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=> {
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });

    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization["username"];
    const isbn = req.params.isbn;
    const findUser = users[username];
    const findBook = books[isbn];

    if (findUser) {
        findBook["review"] = req.body.review;
        res.send(`Book review with the isbn ${isbn} updated.`);
    } else {
        findBook.push({ review: review });
        res.send(`Book review with the isbn new ${isbn} updated.`);
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization["username"];
    const isbn = req.params.isbn;
    if (isbn) {
        if (books[isbn].reviews.username === username) {
            delete books[isbn].reviews;
        }
        res.send(`Book review with the ${isbn} for this username review deleted.`);
    }
    res.send(`Book review with the ${isbn} for this username is not found.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
