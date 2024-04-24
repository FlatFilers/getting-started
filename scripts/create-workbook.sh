source ./.env

curl --request POST \
  --url https://platform.flatfile.com/api/v1/workbooks \
  --header "Authorization: Bearer $(echo $FLATFILE_API_KEY)" \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "My First Workbook",
  "labels": ["simple-demo"],
  "namespace": "red",
  "sheets": [
    {
      "name": "Contacts",
      "slug": "contacts",
      "fields": [
        {
          "key": "firstName",
          "type": "string",
          "label": "First Name"
        },
        {
          "key": "lastName",
          "type": "string",
          "label": "Last Name"
        },
        {
          "key": "email",
          "type": "string",
          "label": "Email"
        }
      ]
    }
  ],
  "actions": [
    {
      "operation": "submitAction",
      "mode": "foreground",
      "label": "Submit",
      "description": "Submit data to webhook.site",
      "primary": true
    }
  ]
}'
