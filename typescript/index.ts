/**
 * See all code examples: https://github.com/FlatFilers/flatfile-docs-kitchen-sink
 */

import { recordHook, FlatfileRecord } from "@flatfile/plugin-record-hook";
import { FlatfileEvent, Client } from "@flatfile/listener";
import api from "@flatfile/api";
import axios from "axios";

export default function flatfileEventListener(listener: Client) {
  /**
   * Part 1 example
   */
  listener.on("**", ({ topic }: FlatfileEvent) => {
    console.log(`Received event: ${topic}`);
  });
  /**
   * Part 2 example
   */
  listener.use(
    recordHook("contacts", (record: FlatfileRecord) => {
      const value = record.get("firstName");
      if (typeof value === "string") {
        record.set("firstName", value.toLowerCase());
      }

      const email = record.get("email") as string;
      const validEmailAddress = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!validEmailAddress.test(email)) {
        console.log("Invalid email address");
        record.addError("email", "Invalid email address");
      }

      return record;
    })
  );
  /**
   * Part 3 example
   */
  listener
    .filter({ job: "workbook:submitAction" })
    .on("job:ready", async (event: FlatfileEvent) => {
      const {
        context: { jobId, workbookId },
        payload,
      } = event;
      const { data: sheets } = await api.sheets.list({ workbookId });

      const records: { [name: string]: any } = {};
      for (const [index, element] of sheets.entries()) {
        records[`Sheet[${index}]`] = await api.records.get(element.id);
      }

      try {
        await api.jobs.ack(jobId, {
          info: "Starting job to submit action to webhook.site",
          progress: 10,
        });

        console.log(JSON.stringify(records, null, 2));

        const webhookReceiver =
          process.env.WEBHOOK_SITE_URL ||
          "https://webhook.site/c83648d4-bf0c-4bb1-acb7-9c170dad4388"; //update this

        const response = await axios.post(
          webhookReceiver,
          {
            ...payload,
            method: "axios",
            sheets,
            records,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          await api.jobs.complete(jobId, {
            outcome: {
              message:
                "Data was successfully submitted to webhook.site. Go check it out at " +
                webhookReceiver +
                ".",
            },
          });
        } else {
          throw new Error("Failed to submit data to webhook.site");
        }
      } catch (error) {
        console.log(`webhook.site[error]: ${JSON.stringify(error, null, 2)}`);

        await api.jobs.fail(jobId, {
          outcome: {
            message:
              "This job failed probably because it couldn't find the webhook.site URL.",
          },
        });
      }
    });
}
