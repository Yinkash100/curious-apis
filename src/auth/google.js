const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user.models');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGL_OAUTH_CLIENT_SECRET,
      callbackURL: `${process.env.FRONT_END_URL}/googleauth`,
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
13;
// const https = require('https');
// async function fetchMyData() {
//   const req = https.request(
//     'https://www.googleapis.com/oauth2/v2/userinfo',
//     {
//       headers: {
//         Authorization:
//           'Bearer ya29.a0AfH6SMCIFcWzD2oFPflZ7u5S0NgDfrQxqhgDXJAiiLBsF9QfvaVwWM1YXWWt4hRRhA3BjUcxEhoOujCQcu--5QbD70FCdcaT-ntAJgt4St_-FIl5J5RteD-sLPgG6fy8tTYGmn7DyZzEYBFXewh4p7KPMltYiAWynH4',
//         method: 'GET',
//       },
//     },
//     (res) => {
//       console.log(`statusCode: ${res.statusCode}`);
//       res.on('data', (chunk) => {
//         process.stdout.write(chunk);
//       });
//     }
//   );
//   req.on('error', (error) => {
//     console.error(error);
//   });

//   req.end();
//   console.log('The Request ==> ', req);
// }

// fetchMyData();
