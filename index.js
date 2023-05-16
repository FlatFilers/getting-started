/**
 * Write a basic Flatfile event subscriber. You can do nearly anything
 * that reacts to events inside Flatfile.
 */
export default function(listener) {
  listener.on('**', (event) => {
    console.log('-> My event', event.topic)
  })
}