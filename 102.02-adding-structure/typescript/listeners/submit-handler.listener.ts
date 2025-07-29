import { jobHandler } from "@flatfile/plugin-job-handler";
import api from "@flatfile/api";

export const submitHandler = jobHandler('workbook:submitActionForeground', async (event, tick) => {
  const { workbookId } = event.context

  await tick(10, 'Starting data processing...')

  // Get the sheets
  const { data: sheets } = await api.sheets.list({ workbookId })

  await tick(30, 'Retrieving records...')

  // Get and count the records
  const records: { [name: string]: any[] } = {}
  let recordsCount = 0
  for (const sheet of sheets) {
    const { data: { records: sheetRecords } } = await api.records.get(sheet.id)
    records[sheet.name] = sheetRecords
    recordsCount += sheetRecords.length
  }

  await tick(60, `Processing ${sheets.length} sheets with ${recordsCount} records...`)

  // Process the data (log to console for now)
  console.log('Processing records:', JSON.stringify(records, null, 2))

  await tick(100, `Successfully processed ${sheets.length} sheets with ${recordsCount} records!`)

  return {
    outcome: {
      message: `Successfully processed ${sheets.length} sheets with ${recordsCount} records!`,
      acknowledge: true
    }
  }
})