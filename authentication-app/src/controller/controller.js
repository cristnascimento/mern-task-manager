const express = require('express');
const bodyParser = require('body-parser');
const serviceAuth = require('./../service/authentication');
const serviceToken = require('./../service/token');

const login = (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    serviceAuth.authenticate(username, password, (err, isAuthenticated) => {
        if (isAuthenticated) {
          serviceToken.generate({username: username}, (err, token) => {
            res.json({
              success: true,
              message: 'Authentication successful!',
              token: token
            });
          });
        } else {
          res.status(403).json({
            success: false,
            message: 'Incorrect username or password'
          });
        }
    });

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
