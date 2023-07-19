import { UploadCompletedEvent } from "@flatfile/api/api";
import { FlatfileListener } from "@flatfile/listener";
import {
  JSONExtractor,
  jsonExtractorPlugin,
} from "@flatfile/plugin-json-extractor";

export default function (listener: FlatfileListener) {
  listener.on("**", ({ topic }) => {
    console.log(`Received event: ${topic}`);
  });
  listener.on("file:created", (event) => {
    return new JSONExtractor(
      event as unknown as UploadCompletedEvent
    ).runExtraction();
  });
  // jsonExtractorPlugin()(listener);
}
