const userDao = require('./../model/userDao');
const serviceToken = require('./../service/token');
const serviceAuth = require('./../service/authentication');
const authMiddleware = require('./../middleware/authenticationMiddleware');

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
      serviceToken.generate({id: id}, (err, token) => {
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
  console.log(req.user);
  res.render('login', {user: req.user});
}

const loginPost = (req, res) => {
  let username = req.body.email;
  let password = req.body.password;

  if (username && password) {
    serviceAuth.authenticate(username, password, (err, isAuthenticated, userId) => {
        if (isAuthenticated) {
          serviceToken.generate({id: userId}, (err, token) => {
            res.cookie('token', token, {httpOnly: true});
            res.redirect('/');
          });
        } else {
          res.status(403).render("login", {err: 'Incorrect username or password'});
        }
    });

  } else {
    res.status(400).json({
      success: false,
      message: 'Authentication failed! Please check the request'
    });
  }
}

const userAccount = (req, res) => {
  console.log('hi accounts');
  res.send('user account: ' + req.params.id)
}

const logout = (req, res) => {
  res.cookie('token', '', {httpOnly: true});
  res.redirect('/accounts/login');
}

const resetForm = (req, res) => {
  res.render('reset-forgot');
}

const resetPost = (req, res) => {
  userDao.getUserByEmail(req.body.email, (err, user) => {
    console.log(user);
    if (err) {
      res.render('reset-forgot', {err: "E-mail inválido."});
    } 
    else {
      serviceToken.generate({id: user.id}, (err, token) => {
        res.render('reset-forgot-done', {id: user.id, token});
      });
    }    
  });
}

const resetConfirmation = (req, res) => {
  let id = req.params.id;
  let token = req.params.token;
  serviceToken.verify(token, (err, decoded) => {
    if (err) {
      res.render('reset-confirm', {err: 'Token inválido.'});
    }
    else {
       res.render('reset-confirm', {id, token});
    }
  });
}

const resetConfirmationPost = (req, res) => {
  let password = req.body.password;
  let passwordConfirm = req.body.passwordConfirm;
  let id = req.params.id;
  let token = req.params.token;

  serviceToken.verify(token, (err, decoded) => {
    if (err) {
      res.render('reset-confirm', {err: 'Token inválido.'});
    }
    else {
        if (password !== '' && password === passwordConfirm) {
          userDao.setNewPassword(id, password, (err) => {
            res.render('reset-confirm-done');
          });
        } else {
          res.render('reset-confirm', {err_pwd: 'As senhas não são idênticas.', id, token});     
        }
    }
  });
}

module.exports = {
  registerForm,
  registerPost,
  registerConfirmation,
  loginForm,
  loginPost,
  logout,
  userAccount,
  resetForm,
  resetPost,
  resetConfirmation,
  resetConfirmationPost,
}