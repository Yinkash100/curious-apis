const express = require('express');
const router = express.Router();
const https = require('https');

const google = require('googleapis');
const OAuth2 = google.Auth.OAuth2Client;

const User = require('../models/user.models');

function getOAuthClient() {
  new OAuth2();
  return new OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    'http://localhost:3002/authWithGoogle/callback'
  );
}

function getAuthUrl() {
  const oauth2client = getOAuthClient();
  const scope = [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  const url = oauth2client.generateAuthUrl({
    access_type: 'offline',
    scope,
  });

  return url;
}

async function getUserInfo(token) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        method: 'GET',
      },
    };
    const userDetail = https.request(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      options,
      async (res) => {
        let out1 = '';
        res.setEncoding('utf-8');
        res.on('data', (chunk) => {
          out1 += chunk;
        });
        res.on('error', () => reject('error getting userdetails'));
        res.on('end', () => {
          resolve(out1);
        });
      }
    );
    userDetail.end();
  });
}

router.get('/authWithGoogle/callback', (req, res) => {
  const oauth2client = getOAuthClient();
  const session = req.session;
  const code = req.query.code;
  oauth2client.getToken(code, async function (err, tokens) {
    // At this point, Tokens should contain an access token and optional refresh token

    if (!err) {
      oauth2client.setCredentials(tokens);
      session['tokens'] = tokens;
      let userData = await getUserInfo(tokens.access_token);
      userData = JSON.parse(userData);
      console.log('The UserData => ', typeof userData);
      if (userData) {
        const user = await User.findOrCreateGoogleUser(userData);
        await user.save();
        console.log('The User => ', user);
        if (user) {
          const token = await user.generateAuthToken();
          res.redirect(`${process.env.FRONT_END_URL}googleauth`);
          return res.status(200).send({ user, token });
        }
      }
      return res.status(200).send({});
    } else {
      console.log('The error that occured is \n', err);
      res.status(400).send('login not  successfool');
    }
  });
});

router.get('/googleAuthUrl', (req, res) => {
  return res.send(getAuthUrl());
});

module.exports = router;
