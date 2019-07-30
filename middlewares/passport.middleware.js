const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');

passport.use(new LocalStrategy({usernameField: 'email'},
  async (email, password, done) => {
    // Match email
    const user = await User.findOne({email});
    if(!user) {
      return done(null, false, {message: 'Not Found User'});
    }

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return done(null, false, {message: 'Password Incorrect'});
    }

    return done(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  })
})