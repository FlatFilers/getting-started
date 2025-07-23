import type { FlatfileListener } from "@flatfile/listener";
import api from "@flatfile/api";

export default function (listener: FlatfileListener) {
  // Configure the space when it's created
  listener.on("job:ready", { job: "space:configure" }, async (event) => {
    const { jobId, spaceId } = event.context;
    
    try {
      // Acknowledge the job
      await api.jobs.ack(jobId, {
        info: "Setting up your workspace...",
        progress: 10
      });

      // Create the workbook with sheets and actions
      await api.workbooks.create({
        spaceId,
        name: "My Workbook",
        sheets: [
          {
            name: "contacts",
            slug: "contacts",
            fields: [
              { key: "name", type: "string", label: "Full Name" },
              { key: "email", type: "string", label: "Email" },
            ],
          },
        ],
        actions: [
          {
            label: "Submit",
            description: "Send data to destination system",
            operation: "submitActionForeground",
            mode: "foreground",
          },
        ],
      });

      // Update progress
      await api.jobs.update(jobId, {
        info: "Workbook created successfully",
        progress: 75
      });

      // Complete the job
      await api.jobs.complete(jobId, {
        outcome: {
          message: "Workspace configured successfully!",
          acknowledge: true
        }
      });

    } catch (error) {
      console.error("Error configuring space:", error);
      
      // Fail the job if something goes wrong
      await api.jobs.fail(jobId, {
        outcome: {
          message: `Failed to configure workspace: ${error.message}`,
          acknowledge: true
        }
      });
    }
  });

  // Handle when someone clicks Submit
  listener.on(
    "job:ready",
    { job: "workbook:submitActionForeground" },
    async (event) => {
      const { jobId, workbookId } = event.context;

      try {
        // Acknowledge the job
        await api.jobs.ack(jobId, {
          info: "Starting data processing...",
          progress: 10
        });

        // Get the data
        const job = await api.jobs.get(jobId);
        
        // Update progress
        await api.jobs.update(jobId, {
          info: "Retrieving records...",
          progress: 30
        });

        // Get the sheets
        const { data: sheets } = await api.sheets.list({ workbookId });

        // Get and count the records
        const records: { [name: string]: any[] } = {};
        let recordsCount = 0;
        for (const sheet of sheets) {
          const { data: { records: sheetRecords}} = await api.records.get(sheet.id);
          records[sheet.name] = sheetRecords;
          recordsCount += sheetRecords.length;
        }

        // Update progress
        await api.jobs.update(jobId, {
          info: `Processing ${sheets.length} sheets with ${recordsCount} records...`,
          progress: 60
        });

        // Process the data (log to console for now)
        console.log("Processing records:", JSON.stringify(records, null, 2));

        // Complete the job
        await api.jobs.complete(jobId, {
          outcome: {
            message: `Successfully processed ${sheets.length} sheets with ${recordsCount} records!`,
            acknowledge: true
          }
        });

      } catch (error) {
        console.error("Error processing data:", error);
        
        // Fail the job if something goes wrong
        await api.jobs.fail(jobId, {
          outcome: {
            message: `Data processing failed: ${error.message}`,
            acknowledge: true
          }
        });
      }
    }
  );
}