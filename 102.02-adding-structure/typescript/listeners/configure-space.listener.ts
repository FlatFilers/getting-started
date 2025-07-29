import { configureSpace } from "@flatfile/plugin-space-configure";
import { myWorkbook } from "../blueprints/workbooks/my-workbook.workbook"

export const spaceConfig = configureSpace({
  workbooks: [myWorkbook]
})