/**
 * This code is used in Flatfile's Beginner Tutorial
 * https://flatfile.com/docs/quickstart
 *
 * To see all of Flatfile's code examples go to: https://github.com/FlatFilers/flatfile-docs-kitchen-sink
 */

import { recordHook, FlatfileRecord } from "@flatfile/plugin-record-hook";
import { Client, FlatfileEvent } from "@flatfile/listener";
import api from "@flatfile/api";
import axios from "axios";

// Part 1: Create a Workbook (https://flatfile.com/docs/quickstart/meet-the-workbook)
// If you haven't completed step one in, you can run `npm run create-workbook`

const webhookReceiver = process.env.WEBHOOK_SITE_URL || "YOUR_WEBHOOK_URL"; // TODO: Update this with your webhook.site URL for Part 4

export default function flatfileEventListener(listener: Client) {
  // Part 2: Setup a listener (https://flatfile.com/docs/quickstart/meet-the-listener)
  listener.on("**", (event: FlatfileEvent) => {
    // Log all events
    console.log(`Received event: ${event.topic}`);
  });

  // Part 3: Transform and validate (https://flatfile.com/docs/quickstart/add-data-transformation)
  listener.use(
    recordHook("contacts", (record: FlatfileRecord) => {
      // Validate and transform a Record's first name
      const value = record.get("firstName");
      if (typeof value === "string") {
        record.set("firstName", value.toLowerCase());
      } else {
        record.addError("firstName", "Invalid first name");
      }

      // Validate a Record's email address
      const email = record.get("email") as string;
      const validEmailAddress = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!validEmailAddress.test(email)) {
        console.log("Invalid email address");
        record.addError("email", "Invalid email address");
      }

      return record;
    })
  );

  // Part 4: Configure a submit Action (https://flatfile.com/docs/quickstart/submit-action)
  listener
    .filter({ job: "workbook:submitAction" })
    .on("job:ready", async (event: FlatfileEvent) => {
      const { context, payload } = event;
      const { jobId, workbookId } = context;

      // Acknowledge the job
      try {
        await api.jobs.ack(jobId, {
          info: "Starting job to submit action to webhook.site",
          progress: 10,
        });

        // Collect all Sheet and Record data from the Workbook
        const { data: sheets } = await api.sheets.list({ workbookId });
        const records = {};

        for (const [index, element] of sheets.entries()) {
          records[`Sheet[${index}]`] = await api.records.get(element.id);
        }

        // Transform the records into the desired format
        const transformedRecords = {};
        for (const sheetName in records) {
          if (records.hasOwnProperty(sheetName)) {
            const sheet = records[sheetName];
            const transformedData = {};

            for (const record of sheet.data.records) {
              const recordValues = {};

              for (const key in record.values) {
                if (record.values.hasOwnProperty(key)) {
                  recordValues[key] = record.values[key].value;
                }
              }

              transformedData[record.id] = recordValues;
            }

            transformedRecords[sheetName] = transformedData;
          }
        }

        // If there is only one sheet, remove the "Sheet[0]" layer
        const finalRecords =
          Object.keys(transformedRecords).length === 1
            ? transformedRecords["Sheet[0]"]
            : transformedRecords;

        // Now, finalRecords will have the desired structure

        console.log(JSON.stringify(finalRecords, null, 2));

        // Send the data to our webhook.site URL
        const response = await axios.post(
          webhookReceiver,
          {
            ...payload,
            method: "axios",
            sheets,
            records: finalRecords, // Use the transformed data
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // If the call fails, throw an error
        if (response.status !== 200) {
          throw new Error("Failed to submit data to webhook.site");
        }

        // Otherwise, complete the job
        await api.jobs.complete(jobId, {
          outcome: {
            message: `Data was successfully submitted to Webhook.site. Go check it out at ${webhookReceiver}.`,
          },
        });
      } catch (error) {
        // If an error is thrown, fail the job
        console.log(`webhook.site[error]: ${JSON.stringify(error, null, 2)}`);
        await api.jobs.fail(jobId, {
          outcome: {
            message: `This job failed. Check your ${webhookReceiver}.`,
          },
        });
      }
    });
}
