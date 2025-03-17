const { registerUser, loginUser, logoutUser, currentUser } = require("../models/users");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const addUser = async (req, res, next) => {
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: result.error.message,
    });
  }
  try {
    const user = await registerUser(req.body);
    if (!user) {
      return res.status(409).json({
        status: "error",
        code: 409,
        message: "Email in use",
      });
    }
    res.status(201).json({
      status: "success",
      code: 201,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (err) {
    next(err);
  }
};

const checkUser = async (req, res, next) => {
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: result.error.message,
    });
  }
  try {
    const user = await loginUser(req.body);
    if (!user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Email or password is wrong",
      });
    }
    res.status(200).json({
      status: "success",
      code: 200,
      token: user.token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (err) {
    next(err);
  }
};

const removeUser = async (req, res, next) => {
  try {
    const user = await logoutUser(req.user._id);
    if (!user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Not authorized",
      });
    }
    res.status(204).json({
      status: "success",
      code: 204,
    });
  } catch (err) {
    next(err);
  }
};

const showUser = async (req, res, next) => {
    try {
    const user = await currentUser(req.user._id);       
    if (!user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Not authorized",
      });
    }
    res.status(200).json({
      status: "success",
      code: 200,
      user: { email: user.email, subscription: user.subscription },
    });
    } catch (err) {
    next(err);
    }
};

module.exports = {
  addUser,
  checkUser,
  removeUser,
  showUser,
};
