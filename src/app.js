const http = require('http');
const express = require('express');
const Session = require('express-session');
const apiRoutes = require('./api-routes');
const baseRoutes = require('./routers/base.routes');

const cors = require('cors');
require('./db/mongoose');

const userRouter = require('./routers/user.routes');

const app = express();
app.use(
  Session({
    cookie: {
      secure: true,
      maxAge: 60000,
    },
    secret: 'yeyesecretforhere',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(baseRoutes);
app.use('/api', apiRoutes);

module.exports = app;
