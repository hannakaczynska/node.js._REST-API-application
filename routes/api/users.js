const express = require('express');
const { addUser, checkUser } = require('../../controllers/usersControllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/signup', addUser);
router.post('/login', checkUser);
router.get('/logout', auth, (req, res) => {
  res.json({ message: 'Logout success' });
});

module.exports = router;