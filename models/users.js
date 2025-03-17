const User = require("./schemas/userSchema");

const registerUser = async (body) => {
  const { email, password } = body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return false;
  }
  const newUser = new User({ email });
  newUser.setPassword(password);
  await newUser.save();
  return newUser;
};

const loginUser = async (body) => {
  const { email, password } = body;
  const user = await User.findOne({
    email,
  });
  if (!user) {
    return false;
  }
  const isValid = user.validPassword(password);
  if (!isValid) {
    return false;
  }
  return user;
};

module.exports = {
  registerUser,
  loginUser,
};
