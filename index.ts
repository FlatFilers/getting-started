import { recordHook } from "@flatfile/plugin-record-hook";
import api from "@flatfile/api"
import fetch from "node-fetch";
import axios from "axios";

export default function (listener) {
  /**
   * Part 1 example
   */

  listener.on('records:*', async (event) => {
    const data = await event.data
    console.log(`-> Records ${event.topic} ${event.context.sheetSlug} = ${data.records.length}`)
  })

  /**
   * Part 2 example
   */

  const validEmailAddress = /^[\w\d.-]+@[\w\d]+\.\w+$/;

  listener.use(
    recordHook("contacts", (record) => {
      const value = record.get("firstName")?.toString();
      if (value) {
        record.set("firstName", value.toLowerCase());
      }

      if (!validEmailAddress.test(String(record.get("email")))) {
        record.addError("email", "Invalid email address");
      }

      return record;
    })
  );

  listener.on(
    "commit:created",
    { context: { sheetSlug: "contacts" } },
    async (event) => {
      const { sheetId } = event.context;
      const records = (await event.data).records;

      records.forEach((record) => {
        record.values.lastName.value = "Rock";

        Object.keys(record.values).forEach((key) => {
          if (record.values[key].value === null) {
            delete record.values[key];
          }
        });
      });
      await api.records.update(sheetId, records);
    }
  );

  /**
   * Part 3 example
   */

  listener.on("action:triggered", async (event) => {
    const webhookReceiver = "<WEBHOOK URL>";
    // copy your https://webhook.site URL for testing
    const res = await fetch(webhookReceiver, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...event.payload, method: "fetch" }),
    });
  });

  listener.on("action:triggered", async (event) => {
    const webhookReceiver = "<WEBHOOK URL>";
    // copy your https://webhook.site URL for testing
    const res = await axios(webhookReceiver, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ ...event.payload, method: "axios" }),
    });
  });
}
