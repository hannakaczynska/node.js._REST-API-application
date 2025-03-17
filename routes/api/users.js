const express = require('express');
const { addUser, checkUser } = require('../../controllers/usersControllers');

const router = express.Router();

router.post('/signup', addUser);
router.post('/login', checkUser);

module.exports = router;