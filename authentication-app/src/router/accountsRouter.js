const express = require('express')

const middleware = require('./../middleware/middleware');
const authMiddleware = require('./../middleware/authenticationMiddleware');
const controller = require('./../controller/controller');
const accountsController = require('./../controller/accountsController');

const router = express.Router()

router.use(authMiddleware.validateToken);

router.get('/register', accountsController.registerForm);

router.post('/register', accountsController.registerPost);

router.get('/register/confirmation/:id/:token/', accountsController.registerConfirmation);

router.get('/login', accountsController.loginForm);
  
router.post('/login', accountsController.loginPost);

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

router.get('/:id', authMiddleware.checkToken, accountsController.userAccount);

module.exports = router