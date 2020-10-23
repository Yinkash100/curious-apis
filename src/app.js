const http = require('http')
const express = require('express');
const Session = require('express-session');

const cors = require('cors');
require('./db/mongoose');

const userRouter = require('./routers/user.routes');
const auth = require('./routers/auth');
const goauth = require('./routers/gauth');

const app = express();
app.use(
  Session({
    secret: 'ThisIsMySecretNoScandal',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(userRouter);
// app.use(auth);
app.use(goauth);

module.exports = app;
