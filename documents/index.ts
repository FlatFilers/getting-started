import api from "@flatfile/api";
import { FlatfileEvent, Client } from "@flatfile/listener";

export default function flatfileEventListener(listener: Client) {
  listener.on(
    "upload:completed",
    async ({ context: { spaceId, fileId } }: FlatfileEvent) => {
      const fileName = (await api.files.get(fileId)).data.name;
      const bodyText = `# Welcome
    ### Say hello to your first customer Space in the new Flatfile!
    Let's begin by first getting acquainted with what you're seeing in your Space initially.
    ---
    Your uploaded file, ${fileName}, is located in the Files area.`;

      const documentId = "us_dc_Vsk5VRfF";

      const updateDoc = await api.documents.update(spaceId, documentId, {
        title: "Getting Started",
        body: bodyText,
      });
    }
  );
}
