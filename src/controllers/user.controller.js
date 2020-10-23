// const mongooseDateonly = require('mongoose-dateonly');
const passport = require('passport');
const User = require('../models/user.models');
const mongoose = require('mongoose');

module.exports = {
  async registerUser(req, res) {
    const user = new User({ userid: mongoose.Types.ObjectId(), ...req.body });

    try {
      await user.save();

      const activationToken = await user.generateActivationToken();
      // TODO send welcome email containing activation link

      res.status(201).send({ user });
    } catch (e) {
      console.error(e);
      res.status(400).send(e);
    }
  },

  async authWithFacebook(req, res) {
    passport.use(
      new FacebookStrategy({
        clientId: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.FRONT_END_URL}`,
      })
    );
  },

  async loginUser(req, res) {
    try {
      var user = null;
      try {
        // get the user with entered credentials
        user = await User.findByCredentials(req.body.email, req.body.password);
      } catch (e) {
        res.status(404).send('Invalid Username or password');
      }

      // } catch (e) {
      //   console.error(e);
      //   return res.status(404).send('invalid login details');
      // }

      // generate token for current session
      const token = await user.generateAuthToken();

      await user.save();

      // send the user information
      // and the current token as response
      res.send({ user, token });
    } catch (e) {
      res.status(400).send(e);
    }
  },

  async activateUserAccount(req, res) {
    try {
      const user = await User.findOne({
        activationToken: req.params.activationCode,
        activationTokenExpiry: { $gte: new Date(Date.now()) },
      });
      if (!user) {
        return res.status(400).send('Invalid or expired Activation Token');
      }

      user.activated = true;
      user.activationToken = undefined;
      user.activationTokenExpiry = undefined;
      await user.save();
      res.status(200).send('Account successfully activated');
    } catch (e) {
      console.error(e);
      res.status(404).send(e);
    }
  },
};
