import axios from "axios";
import api from "@flatfile/api";
import { Flatfile, FormData } from "@flatfile/api";

const apiUrl =
  process.env.FLATFILE_API_URL || "https://platform.flatfile.com/api";
const apiKey = process.env.FLATFILE_API_KEY;

/**
 * Download file data from Flatfile
 */
const getFileBufferFromApi = async (fileId) => {
  const file = await api.files.download(fileId);
  const chunks = [];

  for await (const chunk of file) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
};

export default function flatfileEventListener(listener) {
  // Listen for file:created events
  // Update the File with the new Actions
  listener.on("file:created", async ({ context: { fileId } }) => {
    const file = await api.files.get(fileId);
    const actions = file.data?.actions || [];
    const newActions = [
      ...actions,
      {
        operation: "logFileContents",
        mode: Flatfile.ActionMode.Background,
        label: "Log File Metadata",
        description: "This will log the file metadata.",
      },
      {
        operation: "decryptAction",
        mode: Flatfile.ActionMode.Background,
        label: "Decrypt File",
        description: "This will create a new decrypted file.",
      },
    ];

    await api.files.update(fileId, {
      actions: newActions,
    });
  });

  listener.filter({ job: "file:logFileContents" }, (configure) => {
    configure.on("job:ready", async ({ context: { fileId, jobId } }) => {
      await api.jobs.ack(jobId, {
        info: "Getting started.",
        progress: 10,
      });

      const file = await api.files.get(fileId);
      console.log({ file });

      await api.jobs.complete(jobId, {
        outcome: {
          message: "Logging file contents is complete.",
        },
      });
    });
  });

  listener.filter({ job: "file:decryptAction" }, (configure) => {
    configure.on(
      "job:ready",
      async ({ context: { spaceId, fileId, jobId, environmentId } }) => {
        try {
          await api.jobs.ack(jobId, {
            info: "Getting started.",
            progress: 10,
          });

          const fileResponse = await api.files.get(fileId);
          const buffer = await getFileBufferFromApi(fileId);
          const { name, ext } = fileResponse.data;
          const newFileName = name
            ? `${name.split(".")[0]}[Decrypted].${ext}`
            : "DecryptedFile.csv";

          const formData = new FormData();
          formData.append("file", buffer, { filename: newFileName });
          formData.append("spaceId", spaceId);
          formData.append("environmentId", environmentId);

          await axios.post(`${apiUrl}/v1/files/`, formData, {
            headers: {
              ...formData.getHeaders(),
              Authorization: `Bearer ${apiKey}`,
            },
            transformRequest: () => formData,
          });

          await api.jobs.complete(jobId, {
            outcome: {
              message: "Decrypting is now complete.",
            },
          });
        } catch (e) {
          await api.jobs.fail(jobId, {
            outcome: {
              message: "The decryption job failed.",
            },
          });
        }
      }
    );
  });
}
