const express = require('express');
const {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  putContact,
  patchContact
} = require('../../controllers/contactsControllers');

const router = express.Router();

router.get('/', getContacts);
router.get('/:contactId', getContact);
router.post('/', createContact);
router.delete('/:contactId', deleteContact);
router.put('/:contactId', putContact);
router.patch('/:contactId/favorite', patchContact);

module.exports = router;
