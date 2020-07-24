

const registerForm = (req, res) => {
  res.render('register');
}

const registerPost = (req, res) => {
  console.log(req.body);
  res.redirect('/accounts/register/done');
}

const registerDone = (req, res) => {
  res.render('register-done');
}

module.exports = {
  registerForm,
  registerPost,
  registerDone,
}