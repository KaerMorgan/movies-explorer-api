const express = require('express');
const { getMe, changeUserInfo } = require('../controllers/users');
const { userInfoValidation } = require('../middlewares/joi');

const router = express.Router();

router.get('/me', getMe); // get current user
router.patch('/me', userInfoValidation, changeUserInfo); // change info about current user

module.exports = router;
