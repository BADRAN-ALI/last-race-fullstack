'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const userDao = require('./dao/userDao');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await userDao.getUserByUsername(username);
      if (!user) return done(null, false, { message: 'Incorrect username or password' });

      const candidate = crypto.scryptSync(password, user.salt, 32);
      const stored = Buffer.from(user.hash, 'hex');
      const ok = stored.length === candidate.length && crypto.timingSafeEqual(stored, candidate);
      if (!ok) return done(null, false, { message: 'Incorrect username or password' });

      return done(null, { id: user.id, username: user.username, name: user.name });
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    done(null, await userDao.getUserById(id));
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
