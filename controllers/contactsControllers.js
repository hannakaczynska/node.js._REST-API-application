const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../models/contacts");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(7).max(15).required(),
});

const favoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const getContacts = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const skip = page ? (page - 1) * limit : 0;
    const contacts = await listContacts({ limit, skip });
    res.status(200).json({
      status: "success",
      code: 200,
      data: { contacts },
    });
  } catch (err) {
    next(err);
  }
};

const getContact = async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (contact) {
      res.status(200).json({
        status: "success",
        code: 200,
        data: { contact },
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

const createContact = async (req, res, next) => {
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "missing required name field",
    });
  }
  try {
    const contact = await addContact(req.body);
    res.status(201).json({
      status: "success",
      code: 201,
      data: { contact },
    });
  } catch (err) {
    next(err);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const deletedContact = await removeContact(req.params.contactId);
    if (deletedContact) {
      res.status(200).json({
        status: "success",
        code: 200,
        message: "contact deleted",
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: "contact not found",
      });
    }
  } catch (err) {
    next(err);
  }
};

const putContact = async (req, res, next) => {
  const result = schema.validate(req.body);
  if (result.error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "missing fields",
    });
  }
  try {
    const contact = await updateContact(req.params.contactId, req.body);
    if (contact) {
      res.status(200).json({
        status: "success",
        code: 200,
        data: { contact },
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

const patchContact = async (req, res, next) => {
  const result = favoriteSchema.validate(req.body);
  if (result.error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "missing field favorite",
    });
  }
  try {
    const contact = await updateStatusContact(req.params.contactId, req.body);
    if (contact) {
      res.status(200).json({
        status: "success",
        code: 200,
        data: { contact },
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  putContact,
  patchContact,
};
