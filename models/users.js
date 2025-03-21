const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

const User = require("./schemas/userSchema");

const registerUser = async (body) => {
  const { email, password } = body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return false;
  }
  const avatarURL = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
  const newUser = new User({ email, avatarURL });
  newUser.setPassword(password);
  await newUser.save();
  return newUser;
};

const loginUser = async (body) => {
  const { email, password } = body;
  const user = await User.findOne({
    email,
  });
  if (!user || !user.validPassword(password)) {
    return false;
  } else {
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });

    const updatedUser = await User.findByIdAndUpdate(
      { _id: user._id },
      { $set: { token } },
      { new: true }
    );
    return updatedUser;
  }
};

const logoutUser = async (id) => {
  const user = await User.findById({ _id: id }); 
  if (!user) {
    return false;
  }
  user.token = null;
  await user.save();
  return true;
};

const currentUser = async (id) => {
  const user = await User.findById({ _id: id });
  if (!user) {
    return false;
  } 
  return user;
};

const updateUserSubscription = async (id, body) => {
  const user = await User.findById({ _id: id });
  if (!user) {
    return false;
  } 
  const updatedUser = await User.findByIdAndUpdate(
    { _id: id  },
    { $set: body },
    { new: true }
  );
  return updatedUser;
};

const updateAvatar = async (id, avatarURL) => {
  const user = await User.findById({ _id: id });
  if (!user) {
    return false;
  } 
  const updatedUser = await User.findByIdAndUpdate(
    { _id: id },
    { $set: { avatarURL } },
    { new: true }
  );
  return updatedUser;
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateUserSubscription,
  updateAvatar,
};
