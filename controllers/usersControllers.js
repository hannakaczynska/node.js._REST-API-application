const { registerUser } = require("../models/users");
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

module.exports = {
  addUser,
};
