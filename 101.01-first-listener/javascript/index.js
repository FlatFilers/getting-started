import api from "@flatfile/api";

export default function (listener) {
  // Configure the Space when it's created
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
      console.error("Error configuring Space:", error);
      // Fail the job if something goes wrong
      await api.jobs.fail(jobId, {
        outcome: {
          message: `Failed to configure workspace: ${error.message}`,
          acknowledge: true,
        },
      });
    }
  });
}