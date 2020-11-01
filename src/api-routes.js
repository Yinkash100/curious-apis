const express = require('express');

const router = express.Router();
const userRouter = require('./routers/user.routes');

router.use('/user', userRouter);
module.exports = router;
