const {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateUserSubscription,
  updateAvatar,
  verifyUserEmail,
  sendEmail,
} = require("../models/users");
const Joi = require("@hapi/joi");
const Jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const emailSchema = Joi.object({
  email: Joi.string().email().required(),
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
    if (user === "Verification required") {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Email not verified",
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

const changeSubscription = async (req, res, next) => {
  const result = subscriptionSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: result.error.message,
    });
  }
  try {
    const user = await updateUserSubscription(req.user._id, req.body);
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

const changeAvatar = async (req, res, next) => {
  try {
    const { path: temporaryName, originalname } = req.file;
    const newFileName = `${req.user._id}-${originalname}`;
    const newFilePath = path.join(__dirname, "../public/avatars", newFileName);
    try {
      const image = await Jimp.read(temporaryName);
      await image.resize(250, 250).write(newFilePath);
    } catch (err) {
      await fs.unlink(temporaryName);
      return next(err);
    }
    const avatarURL = `/avatars/${newFileName}`;
    const user = await updateAvatar(req.user._id, avatarURL);
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
      avatarURL: user.avatarURL,
    });
  } catch (err) {
    next(err);
  }
};

const checkUserVerification = async (req, res, next) => {
  try {
    const user = await verifyUserEmail(req.params.verificationToken);
    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "User not found",
      });
    }
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Verification successful",
    });
  } catch (err) {
    next(err);
  }
};

const checkUserEmailVerification = async (req, res, next) => {
    const result = emailSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: result.error.message,
    });
  }
  try {
    const verified = await sendEmail(req.body.email);
    if (verified === "User not found") {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "User not found",
      });
    }
    if (verified === "isVerified") {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Verification has already been passed",
      });
    }
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Verification email sent",
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
  changeSubscription,
  changeAvatar,
  checkUserVerification,
  checkUserEmailVerification,
};
