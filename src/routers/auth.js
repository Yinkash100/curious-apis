const express = require('express');
const router = express.Router();

const passportFacebook = require('../auth/facebook');
const passportGoogle = require('../auth/google');

const User = require('../models/user.models');

router.get('/authWithFacebook', passportFacebook.authenticate('facebook'));
router.get(
  '/authWithFacebook/callback',
  passportFacebook.authenticate('facebook', { failureRedirect: '/longthin' }),
  (req, res) => {
    // success redirect'
    console.log('Auth with facebook susceeded');
    res.status(200).send('Authentication wwith facebook successful');
  }
);

/* Google Router */
router.get(
  '/authWithGoogle',
  passportGoogle.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login'],
  }),
  () => {
    console.log('Inna the google auth this.route');
  }
);

router.post(
  'authWithGoogle/callback',
  passportGoogle.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    console.log('Auth with google susceeded');
    res.send('Auth with Google succeded');
  }
);

router.post('checkLoginUser');

module.exports = router;
