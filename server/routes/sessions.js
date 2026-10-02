'use strict';
const express = require('express');
const passport = require('../passport-config');

const router = express.Router();

router.post('/', (req, res, next) => {
  const verify = ((err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: (info && info.message) || 'Login failed' });
    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.json(user); 
    });
  });
  passport.authenticate('local', verify)(req, res, next);
});

router.get('/current', (req, res) => {
  if (req.isAuthenticated()) return res.json(req.user);
  return res.json(null);
});

router.delete('/current', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return res.status(204).end();
  });
});

module.exports = router;
