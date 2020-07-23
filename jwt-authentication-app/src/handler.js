const express = require('express');
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let config = require('./config');

const login = (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  // For the given username fetch user from DB
  let mockedUsername = 'admin';
  let mockedPassword = 'password';

  if (username && password) {
    if (username === mockedUsername && password === mockedPassword) {
      jwt.sign({username: username}, config.secret, (err, token) => {
        res.json({
          success: true,
          message: 'Authentication successful!',
          token: token
        });
      });
      // return the JWT token for the future API calls
    } else {
      res.status(403).json({
        success: false,
        message: 'Incorrect username or password'
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: 'Authentication failed! Please check the request'
    });
  }
}

const index = (req, res) => {
    res.send("Hello Home!");
};

const check = (req, res) => {
    res.send("Hello Private! Foo: " + req.decoded.username);
};

module.exports = {
  login: login,
  index: index,
  check: check
};
