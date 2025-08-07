import { configureSpace } from "@flatfile/plugin-space-configure";
import { peopleWorkbook } from "../blueprints/workbooks/people.workbook.js";

export const spaceConfig = configureSpace({
  workbooks: [peopleWorkbook],
});
