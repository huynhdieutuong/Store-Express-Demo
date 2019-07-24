const User = require('../models/user.model');

module.exports.requireAuth = async (req, res, next) => {
  const { userId } = req.signedCookies;
  const user = await User.findById(userId);
  if(!userId) {
    return res.redirect('/auth/login');
  }
  if(!user) {
    return res.redirect('/auth/login');
  }

  res.locals.name = user.name;
  next();
}

module.exports.loggedIn = async (req, res, next) => {
  const { userId } = req.signedCookies;
  const user = await User.findById(userId);
  if(user) {
    return res.redirect('/admin');
  }

  next();
}