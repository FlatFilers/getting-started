import { Flatfile } from "@flatfile/api";
import { contactsSheet } from "../sheets/contacts.sheet";
import { submitAction } from "../actions/submit.action";

export const myWorkbook: Flatfile.CreateWorkbookConfig = {
  name: 'My Workbook',
  sheets: [ contactsSheet ],
  actions: [ submitAction ]
}