
/** 
 * This file is meant to be a reference. Paste these examples into 
 * index.js and use the Run button.
 */

import { recordHook } from '@flatfile/plugin-record-hook'
import * as EmailValidator from 'email-validator';

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

  listener.use(
    recordHook('contacts', (record) => {
      const value = record.get('firstName')?.toString()
      if (value) {
        record.set('firstName', value.toLowerCase())
      }

      if (!EmailValidator.validate(record.get('email'))) {
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

