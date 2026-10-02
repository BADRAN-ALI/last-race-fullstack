'use strict';
const express = require('express');
const { isLoggedIn } = require('../middleware');
const gameDao = require('../dao/gameDao');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    res.json(await gameDao.getRanking()); 
  } catch (err) {
    next(err);
  }
});

module.exports = router;
