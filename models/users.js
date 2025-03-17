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

module.exports = {
  registerUser,
};
