const express = require('express')

const controller = require('./../controller/controller');

const router = express.Router()

router.get('/', function (req, res) {
  res.send('Birds home page')
})
//router.get('/', controller.index);

//router.post('/login', controller.login);


module.exports = router