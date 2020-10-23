/* eslint-disable global-require */
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var DateOnly = require('mongoose-dateonly')(mongoose);

const userSchema = new mongoose.Schema(
  {
    // userid: {
    //   type: String,
    //   unique: true,
    //   required: true,
    // },
    username: {
      type: String,
      lowercase: true,
      unique: true,
      // required: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      // required: true,
    },
    phone: {
      type: String,
    },
    birthDate: {
      type: DateOnly,
      trim: true,
    },
    googleId: {
      type: String,
      unique: true,
    },
    facebookId: {
      type: String,
      unique: true,
    },
    instagramId: {
      type: String,
    },
    twitterId: {
      type: String,
    },
    // inconsistienc in naming convention below
    account_type: {
      type: String,
      enum: ['client', 'admin', 'supplier'],
      default: 'client',
    },
    // mongoose timestamps could carry out this function below
    // updatedDate: { type: Date, default: Date.now },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
    lastLogin: {
      type: Date,
    },
    activated: {
      type: Boolean,
    },
    activationToken: {
      type: String,
    },
    activationTokenExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  const user = this;

  try {
    if (!user.isModified('password')) next();

    let hash = await bcrypt.hash(user.password, 13);
    user.password = hash;

    next();
  } catch (e) {
    console.error(e);
    next(e);
  }
});

userSchema.methods.comparePassword = async function (password) {
  try {
    let result = await bcrypt.compare(password, this.password);

    return result;
  } catch (e) {
    console.error(e);

    return false;
  }
};

// use nodejs crypto to generate a random token
// for email verification
userSchema.methods.generateActivationToken = async function () {
  let user = this;

  // Token generator function
  function generateToken() {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(20, (err, buf) => {
        if (err) {
          reject(err);
        } else {
          resolve(buf.toString('hex'));
        }
      });
    });
  }

  // add user id to the generated token to ensure uniquness
  user.activationToken = user._id + (await generateToken());

  // set token expiration time // 48 hours
  user.activationTokenExpiry = Date.now() + 48 * 3600 * 1000;

  await user.save();

  return user.activationToken;
};

// generate JWT auth tokens for authentication
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// find a user (for login)
userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return;
  }

  return user;
};

userSchema.statics.findOrCreateGoogleUser = async function (userData) {
  console.log('using this find or create shii');
  let user = await User.findOne({ googleId: userData.id });
  if (!user) {
    console.log(1);
    user = new User({
      email: userData.email,
      name: userData.given_name,
      googleId: userData.id,
      password: '',
    });
    console.log(2);
    await user.save();
    console.log(3);
    return user;
  }
  console.log('The user from the find or create shii');
  return user;
};

// returnes formatted user information whenever user is called
// helps remove sensitive information
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject._id;
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
