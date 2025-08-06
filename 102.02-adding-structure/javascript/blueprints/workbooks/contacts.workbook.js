import { contactsSheet } from "../sheets/contacts.sheet";
import { submitAction } from "../actions/submit.action";

export const contactsWorkbook = {
  name: 'Contacts',
  sheets: [ contactsSheet ],
  actions: [ submitAction ]
};
