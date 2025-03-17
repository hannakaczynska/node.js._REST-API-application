const Contact = require("./schemas/contactSchema");

const listContacts = async ({limit, skip, favorite}) => {
  if (limit) {
    const contacts = await Contact.find({favorite: favorite}).skip(skip).limit(limit);
    return contacts;
  } else {
  const contacts = await Contact.find({favorite: favorite});
  return contacts;
  }
};

const getContactById = async (contactId) => {
  const contact = await Contact.findOne({ _id: contactId });
  return contact;
};

const removeContact = async (contactId) => {
  const contact = await getContactById(contactId);
  if (!contact) {
    return false;
  } else {
    await Contact.findByIdAndDelete({ _id: contactId });
    return true;
  }
};

const addContact = async (body) => {
  const { name, email, phone } = body;
  const newContact = await Contact.create({ name, email, phone });
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contact = await getContactById(contactId);
  if (!contact) {
    return false;
  } else {
    const updatedContact = await Contact.findByIdAndUpdate(
      { _id: contactId },
      { $set: body },
      { new: true}
    );
    return updatedContact;
  }
};

const updateStatusContact = async (contactId, body) => {
  const { favorite } = body;
  const contact = await getContactById(contactId);
  if (!contact) {
    return false;
  } else {
    const updatedContact = await Contact.findByIdAndUpdate(
      { _id: contactId },
      { $set: { favorite } },
      { new: true}
    );    
    return updatedContact;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
};
