const uuid = require('uuid');
const md5 = require('md5');

const db = require('../db');

module.exports.register = (req, res) => {
  res.render('auth/register', {title: 'Register'});
}

module.exports.postRegister = (req, res) => {
  const { name, email, password } = req.body;
  db.get('users').push({
    id: uuid(),
    name,
    email,
    password: md5(password)
  }).write();

  res.render('auth/register', { msg: 'Registration Success' });
}

module.exports.login = (req, res) => {
  res.render('auth/login', {title: 'Login'});
}

module.exports.postLogin = (req, res) => {
  const user = res.locals.user;
  res.cookie('userId', user.id, {signed: true});
  res.redirect('/admin');
}