import { contactsSheet } from "../sheets/contacts.sheet.js";
import { submitAction } from "../actions/submit.action.js";

export const contactsWorkbook = {
  name: 'Contacts',
  sheets: [ contactsSheet ],
  actions: [ submitAction ]
};
