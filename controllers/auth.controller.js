const md5 = require('md5');

const User = require('../models/user.model');

module.exports.register = (req, res) => {
  res.render('auth/register', {title: 'Register'});
}

module.exports.postRegister = async (req, res) => {
  const { name, email, password } = req.body;
  await User.create({
    name,
    email,
    password: md5(password)
  });

  res.redirect('/auth/login');
}

module.exports.login = (req, res) => {
  res.render('auth/login', {title: 'Login'});
}

module.exports.postLogin = (req, res) => {
  const user = res.locals.user;
  res.cookie('userId', user.id, {signed: true});
  res.redirect('/admin');
}