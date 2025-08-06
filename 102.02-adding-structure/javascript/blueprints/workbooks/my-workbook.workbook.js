import { contactsSheet } from "../sheets/contacts.sheet";
import { submitAction } from "../actions/submit.action";

export const myWorkbook = {
  name: 'Contacts',
  sheets: [ contactsSheet ],
  actions: [ submitAction ]
};
