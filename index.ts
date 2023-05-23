import { recordHook } from "@flatfile/plugin-record-hook";
import api from "@flatfile/api"

export default function (listener) {
  /**
   * Part 1 example
   */

  listener.on("**", (event) => {
    console.log(
      `-> My event listener received an event: ${JSON.stringify(event)}`
    );
  });

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

  /**
   * Part 3 example
   */

  listener.filter({ job: 'workbook:submitAction' }, (configure) => {
    configure.on('job:ready', async (event) => {
      const { jobId } = event.context;
      try {
        await api.jobs.ack(jobId, {
          info: 'Starting job to submit action to webhook.site',
          progress: 10
        });
        const webhookReceiver = 'https://webhook.site/c83648d4-bf0c-4bb1-acb7-9c170dad4388';
        // copy your https://webhook.site URL for testing
        await fetch(webhookReceiver, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...event.payload, method: "fetch" }),
        })

        await api.jobs.complete(jobId, {
          outcome:{
            message:"Data was successfully submitted to webbook.site. Go check it out!"
          }
        });
      }
      catch (error) {
        console.log(`webhook.site[error]: ${JSON.stringify(error, null, 2)}`);

        await api.jobs.fail(jobId, {
          outcome:{
            message:"This job failed probably because it couldn't find the webhook.site url."
          }
        });
      }


    })
  })

}
