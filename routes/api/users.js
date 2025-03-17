const express = require('express');
const { addUser, checkUser, removeUser, showUser } = require('../../controllers/usersControllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/signup', addUser);
router.post('/login', checkUser);
router.get('/logout', auth, removeUser);
router.get('/current', auth, showUser);

module.exports = router;