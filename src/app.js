const http = require('http');
const express = require('express');
const apiRoutes = require('./api-routes');
const baseRoutes = require('./routers/base.routes');

const cors = require('cors');
require('./db/mongoose');

const userRouter = require('./routers/user.routes');

const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(baseRoutes);
app.use('/api', apiRoutes);

module.exports = app;
