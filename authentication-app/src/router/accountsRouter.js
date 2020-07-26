const express = require('express')

const authMiddleware = require('./../middleware/authenticationMiddleware');
const accountsController = require('./../controller/accountsController');

const router = express.Router()

router.get('/register', accountsController.registerForm);

router.post('/register', accountsController.registerPost);

router.get('/register/confirmation/:id/:token/', accountsController.registerConfirmation);

router.get('/login', accountsController.loginForm);
  
router.post('/login', accountsController.loginPost);

router.get('/logout', accountsController.logout);

router.get('/password_reset', accountsController.resetForm);

router.post('/password_reset', accountsController.resetPost);

router.get('/password_reset/confirmation/:id/:token', accountsController.resetConfirmation);

router.post('/password_reset/confirmation/:id/:token', accountsController.resetConfirmationPost);

router.get('/:id', authMiddleware.checkToken, accountsController.userAccount);

module.exports = router