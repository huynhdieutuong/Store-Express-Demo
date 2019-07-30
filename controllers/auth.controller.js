const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');

module.exports.register = (req, res) => {
  res.render('auth/register', {title: 'Register'});
}

module.exports.postRegister = async (req, res) => {
  const { name, email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  await User.create({
    name,
    email,
    password: hashPassword
  });

  req.flash('success_msg', 'Register Success');
  res.redirect('/auth/login');
}

module.exports.login = (req, res) => {
  res.render('auth/login', {title: 'Login'});
}

module.exports.postLogin = passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/auth/login',
  failureFlash: true,
  successFlash: 'Welcome!'
});

module.exports.logout = (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/auth/login');
}