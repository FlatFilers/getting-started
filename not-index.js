import { recordHook } from '@flatfile/plugin-record-hook'

export default function(listener) {

  /** 
   * Part 1 example 
   */

  listener.on('**', (event) => {
    console.log(`-> My event listener received an event: ${event.topic}`)
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
  
  const https = require('https');

  listener.on('action:triggered', async (event) => {
    
    new Promise((resolve, reject) => {
      const req = https.request({
        method: 'POST',
        protocol: 'https:',
        hostname: 'webhook.site',
        // copy your https://webhook.site path for testing
        path: '/<COPY_PATH_HERE>',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const body = JSON.stringify({ event }, null, 2);
      req.write(body);
      req.on('response', (res) => { resolve(); });
      req.on('error', (err) => { reject(err); });
      req.end();
    });

  })

}

