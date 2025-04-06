const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");

const User = require("./schemas/userSchema");
const sendVerificationEmail = require("../utils/sendEmail");

const registerUser = async (body) => {
  const { email, password } = body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return false;
  }
  const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
  const verificationToken = nanoid();
  const newUser = new User({ email, avatarURL, verificationToken });
  newUser.setPassword(password);

  await newUser.save();

  const verificationLink = `${process.env.BASE_URL}/api/users/verify/${verificationToken}`;
  await sendVerificationEmail(verificationLink);

  return newUser;
};

const loginUser = async (body) => {
  const { email, password } = body;
  const user = await User.findOne({
    email,
  });
  if (!user || !user.validPassword(password)) {
    return false;
  } else if (!user.verify) {
    return "Verification required";
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
    { _id: id },
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

const verifyUserEmail = async (verificationToken) => {
  const isVeryfied = await User.findOne({ verificationToken });
  if (!isVeryfied) {
    return false;
  } else {
    await User.findOneAndUpdate(
      { verificationToken },
      { $set: { verify: true }, $unset: { verificationToken: null } },
      { new: true }
    );
    return true;
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateUserSubscription,
  updateAvatar,
  verifyUserEmail,
};
