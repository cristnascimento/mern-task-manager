const userDao = require('./../model/userDao');

const registerForm = (req, res) => {
  res.render('register');
}

const registerPost = (req, res) => {
  console.log(req.body);
  userDao.createUser(req.body, (err) => {
    if (err) {
      res.render('register', {err: "E-mail ou senha inválidos.", user: req.body});
    } 
    else {      
      let id = 'x';
      let token = 'y';
      //res.redirect('/accounts/register/done/'+id+'/'+token);
      res.render('register-done', {id, token});
    }
    
  });
  
}

module.exports = {
  registerForm,
  registerPost,
}