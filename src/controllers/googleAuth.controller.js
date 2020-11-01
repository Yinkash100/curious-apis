const User = require('../models/user.models');
const https = require('https');

function getUserInfo(token) {
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
      (res) => {
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

module.exports = {
  async authenticate(googleAccessToken) {
    return new Promise(async (resolve, reject) => {
      let userData = await getUserInfo(googleAccessToken).catch((err) =>
        console.error(err)
      );
      userData = JSON.parse(userData);
      if (!userData) {
        resolve({
          statusCode: 400,
          data: 'Incorrect or expired token',
        });
      }
      const user = await User.findOrCreateGoogleUser(userData);
      await user.save();
      const jwtToken = await user.generateAuthToken();
      resolve({
        statusCode: 200,
        data: { user, jwtToken },
      });
    });
  },
};
