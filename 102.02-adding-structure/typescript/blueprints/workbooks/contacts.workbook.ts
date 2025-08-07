import { Flatfile } from "@flatfile/api";
import { peopleSheet } from "../sheets/people.sheet";
import { submitAction } from "../actions/submit.action";

export const contactsWorkbook: Flatfile.CreateWorkbookConfig = {
  name: 'Contacts',
  sheets: [ peopleSheet ],
  actions: [ submitAction ]
}