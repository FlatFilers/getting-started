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

      // Create the workbook with sheets
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
}