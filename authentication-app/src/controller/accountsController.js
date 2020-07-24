const userDao = require('./../model/userDao');
const serviceToken = require('./../service/token');

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

module.exports = {
  registerForm,
  registerPost,
  registerConfirmation
}