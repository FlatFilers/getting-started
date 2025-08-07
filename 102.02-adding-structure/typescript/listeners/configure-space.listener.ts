import { configureSpace } from "@flatfile/plugin-space-configure";
import { contactsWorkbook } from "../blueprints/workbooks/contacts.workbook";

export const spaceConfig = configureSpace({
  workbooks: [contactsWorkbook],
});
