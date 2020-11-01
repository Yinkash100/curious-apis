const User = require('../models/user.models');
const https = require('https');

function getUserInfo(id, token) {
  return new Promise((resolve, reject) => {
    // const urri = new URL(`/v8.0/${id}/picture?fields=url`, 'https://graph.facebook.com');
    const urri = new URL(
      `/v8.0/${id}/?fields=id,name,email,picture.type(large)`,
      'https://graph.facebook.com'
    );
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        method: 'GET',
      },
    };
    const userDetail = https.request(urri, options, (res) => {
      let out1 = '';
      res.setEncoding('utf-8');
      res.on('data', (chunk) => {
        out1 += chunk;
      });
      res.on('error', () => reject('error getting userdetails'));
      res.on('end', () => {
        resolve(out1);
      });
    });
    userDetail.end();
  });
}

module.exports = {
  async authenticate(facebookUserID, facebookAccessToken) {
    console.log(222);
    return new Promise(async (resolve, reject) => {
      let userData = await getUserInfo(
        facebookUserID,
        facebookAccessToken
      ).catch((err) => console.error(err));
      console.log('userprocessed userdata ==> \n', userData);
      userData = JSON.parse(userData);
      userData.photoURL = userData.picture.data.url;
      delete userData.picture;
      console.log('userData ==>> ', userData);
      if (!userData) {
        resolve({
          statusCode: 400,
          data: 'Incorrect or expired token',
        });
      }
      console.log('The returned userData is ', userData);
      const user = await User.findOrCreateFacebookUser(userData);
      await user.save();
      const jwtToken = await user.generateAuthToken();
      resolve({
        statusCode: 200,
        data: { user, jwtToken },
      });
    });
  },
};
