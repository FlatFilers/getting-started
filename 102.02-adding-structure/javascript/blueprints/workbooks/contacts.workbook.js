import { peopleSheet } from "../sheets/people.sheet.js";
import { submitAction } from "../actions/submit.action.js";

export const contactsWorkbook = {
  name: 'Contacts',
  sheets: [ peopleSheet ],
  actions: [ submitAction ]
};
