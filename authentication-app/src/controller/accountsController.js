const userDao = require('./../model/userDao');
const serviceToken = require('./../service/token');
const serviceAuth = require('./../service/authentication')

const registerForm = (req, res) => {
  res.render('register');
}

const registerPost = (req, res) => {
  console.log(req.body);
  userDao.createUser(req.body, (err, newId) => {
    if (err) {
      res.render('register', {err: "E-mail ou senha inválidos.", user: req.body});
    } 
    else {      
      let id = newId;
      serviceToken.generate({id}, (err, token) => {
        res.render('register-done', {id, token});
      });
    }
  });
}

const registerConfirmation = (req, res) => {
  let id = req.params.id;
  let token = req.params.token;
  serviceToken.verify(token, (err, decoded) => {
    if (err) {
      res.render('register-confirmed', {err: 'Token inválido.'});
    }
    else {
      userDao.activateUser(id, (err) => {
        if (err) {
          res.render('register-confirmed', {err: 'Erro ao ativar usuário.'});     
        }
        else {
          res.render('register-confirmed')
        }
      });
    }
  });
}

const loginForm = (req, res) => {
  res.render('login');
}

const loginPost = (req, res) => {
  let username = req.body.email;
  let password = req.body.password;

  if (username && password) {
    serviceAuth.authenticate(username, password, (err, isAuthenticated) => {
        if (isAuthenticated) {
          serviceToken.generate({username: username}, (err, token) => {
            res.cookie('token', token, {httpOnly: true});
            res.redirect('/');
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

module.exports = {
  registerForm,
  registerPost,
  registerConfirmation,
  loginForm,
  loginPost,
}