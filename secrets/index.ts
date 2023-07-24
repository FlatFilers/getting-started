import { FlatfileEvent, Client } from "@flatfile/listener";

export default function flatfileEventListener(listener: Client) {
  listener.on("**", async (event: FlatfileEvent) => {
    // Hardcode specific environment and space for this listener's case
    const credential = await event.secrets("SLACK_TOKEN", {
      environmentId: "us_env_123",
      spaceId: "us_sp_123",
    });
    console.log(credential);
  });
}
