const db = require('../db');

module.exports.requireAuth = (req, res, next) => {
  const { userId } = req.signedCookies;
  const user = db.get('users').find({id: userId}).value();
  if(!userId) {
    return res.redirect('/auth/login');
  }
  if(!user) {
    return res.redirect('/auth/login');
  }

  res.locals.name = user.name;
  next();
}

module.exports.loggedIn = (req, res, next) => {
  const { userId } = req.signedCookies;
  const user = db.get('users').find({id: userId}).value();
  if(user) {
    return res.redirect('/admin');
  }

  next();
}