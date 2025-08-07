import api from "@flatfile/api";

export default function (listener) {
  // Configure the space when it's created
  listener.on("job:ready", { job: "space:configure" }, async (event) => {
    const { jobId, spaceId } = event.context;
    try {
      // Acknowledge the job
      await api.jobs.ack(jobId, {
        info: "Setting up your workspace...",
        progress: 10,
      });
      // Create the Blueprint for the space
      await api.workbooks.create({
        spaceId,
        name: "Contacts",
        sheets: [
          {
            name: "People",
            slug: "people",
            fields: [
              { key: "name", type: "string", label: "Full Name" },
              { key: "email", type: "string", label: "Email" },
            ],
          },
        ],
      });
      // Update progress
      await api.jobs.update(jobId, {
        info: "Workbook created successfully",
        progress: 75,
      });
      // Complete the job
      await api.jobs.complete(jobId, {
        outcome: {
          message: "Workspace configured successfully!",
          acknowledge: true,
        },
      });
    } catch (error) {
      console.error("Error configuring space:", error);
      // Fail the job if something goes wrong
      await api.jobs.fail(jobId, {
        outcome: {
          message: `Failed to configure workspace: ${error.message}`,
          acknowledge: true,
        },
      });
    }
  });

  // Listen for commits and validate email format
  listener.on("commit:created", async (event) => {
    const { sheetId } = event.context;
    try {
      // Get records from the sheet
      const response = await api.records.get(sheetId);
      const records = response.data.records;
      // Simple email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Prepare updates for records with invalid emails
      const updates = [];
      for (const record of records) {
        const emailValue = record.values.email?.value;
        if (emailValue) {
          const email = emailValue.toLowerCase();
          if (!emailRegex.test(email)) {
            updates.push({
              id: record.id,
              values: {
                email: {
                  value: email,
                  messages: [
                    {
                      type: "error",
                      message:
                        "Please enter a valid email address (e.g., user@example.com)",
                    },
                  ],
                },
              },
            });
          }
        }
      }
      // Update records with validation messages
      if (updates.length > 0) {
        await api.records.update(sheetId, updates);
      }
    } catch (error) {
      console.error("Error during validation:", error);
    }
  });
}