import { FlatfileListener } from '@flatfile/listener'
import { configureSpace } from '@flatfile/plugin-space-configure'
import { jobHandler } from '@flatfile/plugin-job-handler'
import { bulkRecordHook } from '@flatfile/plugin-record-hook'
import api from '@flatfile/api'

export default function (listener: FlatfileListener) {
  // Configure the Space with the SpaceConfigure Plugin
  // this replaces the code we built in 101.01
  listener.use(
    configureSpace({
      workbooks: [
        {
          name: 'My Workbook',
          sheets: [
            {
              name: 'contacts',
              slug: 'contacts',
              fields: [
                { key: 'name', type: 'string', label: 'Full Name' },
                { key: 'email', type: 'string', label: 'Email' }
              ]
            }
          ],
          actions: [
            {
              label: 'Submit',
              description: 'Send data to destination system',
              operation: 'submitActionForeground',
              mode: 'foreground',
              primary: true
            }
          ]
        }
      ]
    })
  )

  // Handle email validation with RecordHook Plugin
  // this replaces the code we added in 101.02
  listener.use(
    bulkRecordHook('contacts', (records) => {
      records.map(record => {
        const emailValue = record.get('email') as string
        
        if (emailValue) {
          const email = emailValue.toLowerCase()
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          
          if (!emailRegex.test(email)) {
            record.addError('email', 'Please enter a valid email address (e.g., user@example.com)')
          } else {
            // Normalize the email to lowercase
            record.set('email', email)
          }
        }
        return record
      })
    })
  )

  // Handle Submit Action with JobHandler Plugin
  // this replaces the code we added in 101.03
  listener.use(
    jobHandler('workbook:submitActionForeground', async (event, tick) => {
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
  )
}