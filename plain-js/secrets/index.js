export default function flatfileEventListener(listener) {
  listener.on("**", async (event) => {
    const tok = await event.secrets("SLACK_TOKEN");
    console.log(tok);
    /* pseudo code for an example
    slack = new Slack(tok);
    slack.api(
      "chat.postMessage",
      {
        text: "Flatfile event received!",
        channel: "#integration-flatfile",
      },
      function (err, response) {
        console.log(response || err);
      }
    ); 
    */
  });
}
