const express = require('express');
const { addUser, checkUser, removeUser, showUser, changeSubscription, changeAvatar } = require('../../controllers/usersControllers');
const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/upload');

const router = express.Router();

router.patch('/', auth, changeSubscription);
router.post('/signup', addUser);
router.post('/login', checkUser);
router.get('/logout', auth, removeUser);
router.get('/current', auth, showUser);
router.patch('/avatars', auth, upload.single("avatar"), changeAvatar);

module.exports = router;