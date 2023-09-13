import api from "@flatfile/api";
import { FlatfileListener, FlatfileEvent, Client } from "@flatfile/listener";
import { recordHook, FlatfileRecord } from "@flatfile/plugin-record-hook";

export default function (listener: Client) {
  listener
    .filter({ job: "space:configure" })
    .on("job:ready", async (event: FlatfileEvent) => {
      const { spaceId, environmentId, jobId } = event.context;
      try {
        await api.jobs.ack(jobId, {
          info: "Gettin started.",
          progress: 10,
        });

        await api.workbooks.create({
          spaceId,
          environmentId,
          name: "All Data",
          labels: ["pinned"],
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
            },
            {
              name: "Sheet 2",
              slug: "sheet2",
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
            },
          ],
          actions: [
            {
              operation: "submitActionFg",
              mode: "foreground",
              label: "Submit foreground",
              description: "Submit data to webhook.site",
              primary: true,
            },
          ],
        });

        const doc = await api.documents.create(spaceId, {
          title: "Getting Started",
          body:
            "# Welcome\n" +
            "### Say hello to your first customer Space in the new Flatfile!\n" +
            "Let's begin by first getting acquainted with what you're seeing in your Space initially.\n" +
            "---\n",
        });

        await api.jobs.complete(jobId, {
          outcome: {
            message: "Your Space was created. Let's get started.",
            acknowledge: true,
          },
        });
      } catch (error) {
        console.error("Error:", error.stack);

        await api.jobs.fail(jobId, {
          outcome: {
            message: "Creating a Space encountered an error. See Event Logs.",
            acknowledge: true,
          },
        });
      }
    });

  listener
    .filter({ job: "workbook:submitActionFg" })
    .on("job:ready", async (event: FlatfileEvent) => {
      const { workbookId, jobId } = event.context;

      try {
        await api.jobs.ack(jobId, {
          info: "Gettin started.",
          progress: 10,
        });

        //make changes after cells in a Sheet have been updated
        console.log("make changes here when an action is clicked");

        //todo: get the workbook and sheets here
        const sheet2 = "us_sh_8XFdltuj";

        await api.jobs.complete(jobId, {
          outcome: {
            message: "Submit is now complete.",
            next: {
              type: "id",
              id: sheet2,
              label: "Next: Review Sheet 2",
            },
          },
        });
      } catch (error) {
        console.error("Error:", error.stack);

        await api.jobs.fail(jobId, {
          outcome: {
            message: "This job encountered an error.",
          },
        });
      }
    });

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
}
