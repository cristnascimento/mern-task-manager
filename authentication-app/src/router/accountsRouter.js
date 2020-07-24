const express = require('express')

const middleware = require('./../middleware/middleware');
const controller = require('./../controller/controller');
const accountsController = require('./../controller/accountsController');

const router = express.Router()

router.get('/register', accountsController.registerForm);

router.post('/register', accountsController.registerPost);

router.get('/register/confirmation/:id/:token/', accountsController.registerConfirmation);

router.get('/login', function (req, res) {
  res.send('login')
})
  
router.post('/login', controller.login);

router.get('/logout', function (req, res) {
  res.send('login')
})

router.get('/password_reset', function (req, res) {
  res.send('reset')
})

router.post('/password_reset', function (req, res) {
  res.send('reset')
})

router.get('/password_reset/done', function (req, res) {
  res.send('reset')
})

router.get('/reset/:id/:token', function (req, res) {
  res.send('reset')
})

router.post('/reset/:id/:token', function (req, res) {
  res.send('reset')
})

router.get('/reset/done', function (req, res) {
  res.send('reset')
})

router.get('/check', middleware.checkToken, controller.check);

module.exports = router