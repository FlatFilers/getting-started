import axios from "axios";
import api from "@flatfile/api";

export default function (listener) {
  //when the button is clicked in the UI
  listener.filter({ job: "space:configure" }, (configure) => {
    configure.on("job:ready", async (event) => {
      const { spaceId, environmentId, jobId } = event.context;

      await api.jobs.ack(jobId, {
        info: "Gettin started.",
        progress: 10,
      });

      await api.workbooks.create({
        spaceId: spaceId,
        environmentId: environmentId,
        name: "All Data",
        labels: ["primary"],
        sheets: [
          {
            name: "Family",
            slug: "family",
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
                operation: "submitAction",
                mode: "foreground",
                label: "Export Sheet Data",
                type: "string",
                description: "This will send sheet data to a webhook url!",
                primary: true,
              },
            ],
          },
          {
            name: "Friends",
            slug: "friends",
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
                key: "nickName",
                type: "string",
                label: "Nick Name",
              },
              {
                key: "email",
                type: "string",
                label: "Email",
              },
            ],
            actions: [
              {
                operation: "submitAction",
                mode: "foreground",
                label: "Export Sheet Data",
                type: "string",
                description: "This will send sheet data to a webhook url!",
                primary: true,
              },
            ],
          },
        ],
        actions: [
          {
            operation: "submitAction",
            mode: "foreground",
            label: "Export Workbook Data",
            type: "string",
            description: "This will send all workbook data to a webhook url!",
            primary: true,
          },
        ],
      });

      const updateJob3 = await api.jobs.complete(jobId, {
        outcome: {
          message: "This job is now done.",
        },
      });

      console.log("Updated Job" + JSON.stringify(updateJob3));
    });
  });
  //when the workbook action is clicked
  listener.filter({ job: "workbook:submitAction" }, (configure) => {
    configure.on("job:ready", async (event) => {
      const { jobId, workbookId } = event.context;

      //get all sheets
      const sheets = await api.sheets.list({ workbookId });

      const records = {};
      for (const [index, element] of sheets.data.entries()) {
        records[`Sheet[${index}]`] = await api.records.get(element.id);
      }

      try {
        await api.jobs.ack(jobId, {
          info: "Starting job to submit action to webhook.site",
          progress: 10,
        });

        const webhookReceiver =
          process.env.WEBHOOK_SITE_URL || "https://webhook.site/<PASTE_URL>";

        const response = await axios.post(
          webhookReceiver,
          {
            ...event.payload,
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
              "This job failed probably because it couldn't find the webhook.site URL.",
          },
        });
      }
    });
  });
  //when the sheet action is clicked
  listener.filter({ job: "sheet:submitAction" }, (configure) => {
    configure.on("job:ready", async (event) => {
      const { jobId, sheetId } = event.context;

      const records = await api.records.get(sheetId);

      try {
        await api.jobs.ack(jobId, {
          info: "Starting job to submit action to webhook.site",
          progress: 10,
        });
        const webhookReceiver =
          process.env.WEBHOOK_SITE_URL || "https://webhook.site/<PASTE_URL>";
        // replace with your webhook URL

        const response = await axios.post(
          webhookReceiver,
          {
            ...event.payload,
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
              "This job failed probably because it couldn't find the webhook.site URL.",
          },
        });
      }
    });
  });
}
