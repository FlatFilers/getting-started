
import { recordHook } from '@flatfile/plugin-record-hook'

export default function(listener) {

  /** 
   * Part 1 example 
   */

  listener.on('**', (event) => {
    console.log('-> My event', event.topic)
  })


  /** 
   * Part 2 example 
   */

  const validEmailAddress = /^[\w\d.-]+@[\w\d]+\.\w+$/;

  listener.use(
    recordHook('contacts', (record) => {
      const value = record.get('firstName')?.toString()
      if (value) {
        record.set('firstName', value.toLowerCase())
      }

      if (!validEmailAddress.test(record.get('email'))) {
        console.log("got email")
        record.addError('email', 'Invalid email address')
      }

      return record
    })
  )

  /** 
   * Part 3 example 
   */

  listener.on('action:triggered', async (event) => {
    const webhookReceiver = '<Webhook URL>';
    // copy your https://webhook.site URL for testing
    const res = await fetch(webhookReceiver, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event.payload)
    })
  })

}

