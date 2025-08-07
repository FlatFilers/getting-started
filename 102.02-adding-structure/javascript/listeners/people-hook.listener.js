import { bulkRecordHook } from "@flatfile/plugin-record-hook";

export const peopleHook = bulkRecordHook('people', (records) => {

  records.map(record => {
    
    const emailValue = record.get('email');

    if (emailValue) {

      const email = emailValue.toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        record.addError('email', 'Please enter a valid email address (e.g., user@example.com)');
      } else {

        // Normalize the email to lowercase
        record.set('email', email);
      }
    }

    return record;
  });
});
