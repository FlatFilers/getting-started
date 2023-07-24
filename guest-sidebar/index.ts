import api from "@flatfile/api";
import { FlatfileEvent, Client } from "@flatfile/listener";

export default function flatfileEventListener(listener: Client) {
  listener.on(
    "upload:completed",
    async ({ context: { spaceId, environmentId } }: FlatfileEvent) => {
      try {
        const updateSpace = await api.spaces.update(spaceId, {
          environmentId,
          metadata: {
            sidebarConfig: {
              showSidebar: false,
            },
          },
        });
        console.log(updateSpace.data.metadata?.sidebarConfig);
        // Additional code related to the space update process
      } catch (error) {
        console.error("Error:", error.stack);
        // Handle the error appropriately
      }
    }
  );
}
