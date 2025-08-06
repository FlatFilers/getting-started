import { Flatfile } from "@flatfile/api";
import { contactsSheet } from "../sheets/contacts.sheet";
import { submitAction } from "../actions/submit.action";

export const contactsWorkbook: Flatfile.CreateWorkbookConfig = {
  name: 'Contacts',
  sheets: [ contactsSheet ],
  actions: [ submitAction ]
}