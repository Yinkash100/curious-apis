// const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../models/user.models');

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECERET,
      // callbackURL: '/return',
      callbackURL: '/authWithFacebook/callback',
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log('access token ==> ', accessToken);
      console.log('refresh token ==> ', refreshToken);
      console.log('profile ==> ', profile);
      User.findOrCreate(
        { userid: profile.id },
        {
          email: profile.emails,
          fullname: profile.name.givenName,
          username: profile.displayName,
          userid: profile.id,
        },
        function (err, user) {
          if (err) {
            return cb(err);
          }
          return cb(null, user);
        }
      );
    }
  )
);

module.exports = passport;

// passport.serializeUser(function (user, cb) {
//   cb(null, user);
// });

// passport.deserializeUser(function (obj, cb) {
//   cb(null, obj);
// });
