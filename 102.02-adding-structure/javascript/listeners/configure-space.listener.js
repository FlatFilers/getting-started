import { configureSpace } from "@flatfile/plugin-space-configure";
import { contactsWorkbook } from "../blueprints/workbooks/contacts.workbook.js";

export const spaceConfig = configureSpace({
  workbooks: [contactsWorkbook],
});
