/** 
 * Get your Secret key at: https://platform.flatfile.com/developers and then
 * uncomment this line after setting the API Key value.
 */
process.env.FLATFILE_API_KEY = "YOUR SECRET KEY"

/**
 * Write a basic Flatfile event subscriber. You can do nearly anything
 * that reacts to events inside Flatfile. To start - Click Run
 */
export default function(listener) {
  listener.on('**', (event) => {
    console.log('-> My event', event.topic)
  })
}

// You can see the full example used in our getting started guide in ./full-example.js