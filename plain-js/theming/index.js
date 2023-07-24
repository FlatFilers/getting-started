import api from "@flatfile/api";

export default function flatfileEventListener(listener) {
  //configure space initially
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

  //update space after created
  //you can also do this during configuration
  listener.on(
    "space:created",
    async ({ context: { spaceId, environmentId } }) => {
      //const updateSpace = await flatfile.spaces.update(spaceId, {});

      const updateSpace = await api.spaces.update(spaceId, {
        environmentId,
        metadata: {
          theme: {
            root: {
              primaryColor: "red",
            },
            sidebar: {
              logo: "https://image.png",
            },
            // See reference for all possible variables
          },
        },
      });
    }
  );
}
