// const mongooseDateonly = require('mongoose-dateonly');
const User = require('../models/user.models');
const mongoose = require('mongoose');

module.exports = {
  registerUser(req) {
    return new Promise(async (resolve, reject) => {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        resolve({
          statusCode: 409,
          data: 'Email already exist',
        });
      }
      user = new User({ userid: mongoose.Types.ObjectId(), ...req.body });

      try {
        await user.save();

        const activationToken = await user.generateActivationToken();
        // TODO send welcome email containing activation link

        resolve({
          statusCode: 201,
          data: { user },
        });
      } catch (e) {
        console.error(e);
        resolve({
          statusCode: 400,
          data: e,
        });
      }
    });
  },

  // async authWithFcebook(req, res) {
  //   passport.use(
  //     new FacebookStrategy({
  //       clientId: process.env.FACEBOOK_APP_ID,
  //       clientSecret: process.env.FACEBOOK_APP_SECRET,
  //       callbackURL: `${process.env.FRONT_END_URL}`,
  //     })
  //   );
  // },

  async loginUser(email, password) {
    return new Promise(async (resolve, reject) => {
      try {
        var user = null;
        try {
          // get the user with entered credentials
          user = await User.findByCredentials(email, password);
        } catch (e) {
          resolve({
            statusCode: 404,
            data: 'Invalid Credentials',
          });
        }

        // generate token for current session
        const token = await user.generateAuthToken();

        await user.save();

        // send the user information
        // and the current token as response
        resolve({
          statusCode: 200,
          data: { user, token },
        });
      } catch (e) {
        resolve({
          statusCode: 400,
          data: e,
        });
      }
    });
  },

  async activateUserAccount(req) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({
          activationToken: req.params.activationCode,
          activationTokenExpiry: { $gte: new Date(Date.now()) },
        });
        if (!user) {
          resolve({
            statusCode: 400,
            data: 'Invalid or expired Activation Token',
          });
        }

        user.activated = true;
        user.activationToken = undefined;
        user.activationTokenExpiry = undefined;
        await user.save();
        resolve({
          statusCode: 200,
          data: 'Account successfully activated',
        });
      } catch (e) {
        console.error(e);
        resolve({
          statusCode: 404,
          data: e,
        });
      }
    });
  },
};
