import { configureSpace } from "@flatfile/plugin-space-configure";
import { myWorkbook } from "../blueprints/workbooks/contacts.workbook";

export const spaceConfig = configureSpace({
  workbooks: [myWorkbook],
});
