import axios from "axios";
import api from "@flatfile/api";

export default function (listener) {
  //when the button is clicked in the UI
  listener.filter({ job: "space:configure" }, (configure) => {
    configure.on(
      "job:ready",
      async ({ context: { spaceId, environmentId, jobId } }) => {
        await api.jobs.ack(jobId, {
          info: "Gettin started.",
          progress: 10,
        });

        await api.workbooks.create({
          spaceId,
          environmentId,
          name: "All Data",
          labels: ["primary"],
          sheets: [
            {
              name: "Contacts",
              slug: "contacts",
              fields: [
                {
                  key: "firstName",
                  type: "string",
                  label: "First Name",
                },
                {
                  key: "lastName",
                  type: "string",
                  label: "Last Name",
                },
                {
                  key: "email",
                  type: "string",
                  label: "Email",
                },
              ],
              actions: [
                {
                  operation: "duplicate",
                  mode: "background",
                  label: "Duplicate Sheet",
                  type: "string",
                  description:
                    "Duplicate this Sheet and lock down the original.",
                  primary: true,
                },
              ],
            },
          ],
          actions: [
            {
              operation: "submitActionFg",
              mode: "foreground",
              label: "Submit foreground",
              type: "string",
              description: "Submit data to webhook.site",
              primary: true,
            },
          ],
        });

        await api.documents.create(spaceId, {
          title: "Getting Started",
          body: `# Welcome
  ### Say hello to your first customer Space in the new Flatfile!
  Let's begin by first getting acquainted with what you're seeing in your Space initially.
  ---`,
        });

        await api.jobs.complete(jobId, {
          outcome: {
            message: "This job is now complete.",
          },
        });
      }
    );
  });
  //when the workbook action is clicked
  listener.filter({ job: "workbook:submitActionFg" }, (configure) => {
    configure.on(
      "job:ready",
      async ({ context: { jobId, workbookId }, payload }) => {
        try {
          const sheets = await api.sheets.list({ workbookId });
          const records = {};

          for (const element of sheets.data) {
            records[`Sheet[${element.id}]`] = await api.records.get(element.id);
          }

          await api.jobs.ack(jobId, {
            info: "Starting job to submit action to webhook.site",
            progress: 10,
          });

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
                "This job failed probably because it couldn't submit data to webhook.site.",
            },
          });
        }
      }
    );
  });
  //when the sheet action is clicked
  listener.filter({ job: "sheet:submitAction" }, (configure) => {
    configure.on(
      "job:ready",
      async ({ context: { jobId, sheetId }, payload }) => {
        try {
          const records = await api.records.get(sheetId);

          await api.jobs.ack(jobId, {
            info: "Starting job to submit action to webhook.site",
            progress: 10,
          });

          const webhookReceiver =
            process.env.WEBHOOK_SITE_URL || "https://webhook.site/<PASTE_URL>";
          // Replace <PASTE_URL> with the actual webhook URL

          const response = await axios.post(
            webhookReceiver,
            {
              ...payload,
              method: "axios",
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
                  "Data was successfully submitted to webhook.site. Go check it out!",
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
                "This job failed probably because it couldn't submit data to webhook.site.",
            },
          });
        }
      }
    );
  });
}
