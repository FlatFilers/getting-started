import { configureSpace } from "@flatfile/plugin-space-configure";
import { peopleWorkbook } from "../blueprints/workbooks/people.workbook";

export const spaceConfig = configureSpace({
  workbooks: [peopleWorkbook],
});
