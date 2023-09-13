import api from "@flatfile/api";

const FullExample = [
  {
    name: "Employees",
    slug: "Employees",
    readonly: false,
    fields: [
      {
        key: "firstName dont display",
        label: "First Name",
        type: "string",
        description: "Given Name",
        constraints: [
          {
            type: "required",
          },
          {
            type: "unique",
          },
        ],
      },
      {
        key: "lastName",
        label: "Last Name",
        type: "string",
      },
      {
        key: "fullName",
        label: "Full Name",
        type: "string",
      },
      {
        key: "stillEmployed",
        label: "Still Employed",
        type: "boolean",
      },
      {
        key: "assignedBeer",
        label: "Assigned Beer",
        type: "string",
      },
      {
        key: "department",
        label: "Department",
        type: "enum",
        config: {
          options: [
            {
              value: "engineering",
              label: "Engineering",
            },
            {
              value: "hr",
              label: "People Ops",
            },
            {
              value: "sales",
              label: "Sales",
            },
          ],
        },
      },
      {
        key: "fromHttp",
        label: "From HTTP",
        type: "string",
      },
      {
        key: "salary",
        label: "Salary",
        type: "number",
        description: "Annual Salary in USD",
        constraints: [
          {
            type: "required",
          },
        ],
      },
      {
        key: "startDate",
        label: "Start Date",
        type: "date",
      },
    ],
    actions: [],
  },
];

export default function (listener) {
  listener.filter({ job: "space:configure" }, (configure) => {
    configure.on(
      "job:ready",
      async ({ context: { spaceId, environmentId, jobId } }) => {
        try {
          await api.jobs.ack(jobId, {
            info: "Gettin started.",
            progress: 10,
          });

          const createWorkbook = await api.workbooks.create({
            spaceId: spaceId,
            environmentId: environmentId,
            labels: ["primary"],
            name: "PSDK Full Example",
            sheets: FullExample,
            actions: [
              {
                operation: "elisa:submitAction",
                mode: "foreground",
                label: "Submit this Elisa",
                type: "string",
                description: "Submit data to webhook.site",
                primary: true,
              },
            ],
          });

          const workbookId = createWorkbook.data.id;
          // Log the result of the createWorkbook function to the console as a string
          console.log("Created Workbook with ID: " + workbookId);

          //create document example
          await api.documents.create(spaceId, {
            title: "JSX",
            body:
            "# Build pages in your sidebar with Documents\n\nHere's a look at the code that was used to create it:\n\n```jsx\nimport api from \"@flatfile/api\";\nimport { Client, FlatfileEvent, FlatfileListener } from \"@flatfile/listener\";\nexport default function flatfileEventListener(listener: Client) {\n  listener.filter({ job: \"space:configure\" }, (configure: FlatfileListener) => {\n    configure.on(\n      \"job:ready\",\n      async ({ context: { spaceId, environmentId, jobId } }: FlatfileEvent) => {\n        try {\n          // Acknowledge the space:configure job:ready event was received\n          await api.jobs.ack(jobId, {\n            info: \"Job started.\",\n            progress: 10,\n          });\n\n          // Add first document\n          await api.documents.create(spaceId, {\n            title: \"About this Documents Demo\",\n            body: \"Document text here.\",\n          });\n\n          // Add another document\n          await api.documents.create(spaceId, {\n            title: \"Configure multiple Documents\",\n            body: \"Document text here.\",\n          });\n\n          // Notify the space:configure job has been completed\n          await api.jobs.complete(jobId, {\n            outcome: {\n              message: \"Job completed.\",\n            },\n          });\n        } catch (error) {\n          await api.jobs.fail(jobId, {\n            outcome: {\n              message: \"Job encountered an error.\",\n            },\n          });\n        }\n      }\n    );\n  });\n}\n```\n",
          });

          await api.documents.create(spaceId, {
            title: "JSON",
            body:
            "# Build pages in your sidebar with Documents\n\nHere's a look at the code that was used to create it:\n\n```js\n{\r\n  \"metadata\": {\r\n    \"theme\": {\r\n      \"root\": {\r\n        \"primaryColor\": \"#090B2B\",\r\n        \"dangerColor\": \"#F44336\",\r\n        \"warningColor\": \"#FF9800\"\r\n      },\r\n      \"document\": {\r\n        \"borderColor\": \"#CAD0DC\"\r\n      },\r\n      \"sidebar\": {\r\n        \"logo\": \"https://images.ctfassets.net/hjneo4qi4goj/5DNClD4reUBKoF7u01OgKF/2aa12c49c5ea97bac013a7546e453738/flatfile-white.svg\",\r\n        \"textColor\": \"#ECEEFF\",\r\n        \"titleColor\": \"#C4C9FF\",\r\n        \"focusBgColor\": \"#6673FF\",\r\n        \"focusTextColor\": \"#FFF\",\r\n        \"backgroundColor\": \"#090B2B\",\r\n        \"footerTextColor\": \"#C4C9FF\",\r\n        \"textUltralightColor\": \"#B9DDFF\",\r\n        \"borderColor\": \"#2E3168\",\r\n        \"activeTextColor\": \"#FFF\"\r\n      },\r\n      \"table\": {}\r\n    },\r\n    \"sidebarConfig\": {\r\n      \"showGuestInvite\": true,\r\n      \"showDataChecklist\": true,\r\n      \"showSidebar\": true\r\n    }\r\n  }\r\n}\n```\n",
          });

          await api.documents.create(spaceId, {
            title: "HTML",
            body:
            "# Build pages in your sidebar with Documents\n\nHere's a look at the code that was used to create it:\n\n```html\n<!DOCTYPE html>\r\n<html lang=\"en\">\r\n\r\n<head>\r\n  <!-- Meta Information -->\r\n  <meta charset=\"utf-8\" />\r\n  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\r\n\r\n  <title>FlatFile Test Page</title>\r\n  <script type=\"text/javascript\" src=\"https://code.jquery.com/jquery-3.2.1.min.js\"></script>\r\n  <script type=\"text/javascript\" src=\"/adapter.js\"></script>\r\n\r\n  <style>\r\n    body,\r\n    html {\r\n      font-family: \'Avenir Next\', sans-serif;\r\n      height: 100%;\r\n      margin: 0;\r\n      overflow: hidden;\r\n    }\r\n\r\n    .content {\r\n      padding: 20px;\r\n    }\r\n\r\n    .full-height {\r\n      min-height: 100%;\r\n    }\r\n\r\n    .flex-column {\r\n      display: flex;\r\n      flex-direction: column;\r\n    }\r\n\r\n    .flex-fill {\r\n      flex: 1;\r\n    }\r\n\r\n    .flex-center {\r\n      align-items: center;\r\n      display: flex;\r\n      justify-content: center;\r\n    }\r\n\r\n    .text-center {\r\n      text-align: center;\r\n    }\r\n\r\n    .links {\r\n      padding: 1em;\r\n      text-align: right;\r\n    }\r\n\r\n    .links a {\r\n      text-decoration: none;\r\n    }\r\n\r\n    button {\r\n      background-color: #3097d1;\r\n      border: 0;\r\n      border-radius: 4px;\r\n      color: white;\r\n      cursor: pointer;\r\n      font-size: 14px;\r\n      font-weight: 600;\r\n      padding: 15px;\r\n    }\r\n\r\n    iframe {\r\n      height: 100%;\r\n    }\r\n\r\n    .input-block {\r\n      display: inline-block;\r\n      width: 140px;\r\n      margin-right: 1em;\r\n    }\r\n\r\n    .input-block input {\r\n      width: 100%;\r\n    }\r\n  </style>\r\n</head>\r\n\r\n<body>\r\n  <div class=\"content\">\r\n    <h1>Import your robots!</h1>\r\n    <a href=\"/downloads/robots.csv\">Click here to download a sample CSV file of robots.</a>\r\n    <hr />\r\n    <button id=\"import-button\">Import Robots</button>\r\n    <hr />\r\n    <input type=\"text\" id=\"filename\" disabled />\r\n    <hr />\r\n    <h4>End user information:</h4>\r\n    ￼<label class=\"input-block\">Id: <input type=\"text\" id=\"end-user-id\" value=\"example-id-123\" /></label>\r\n    <label class=\"input-block\">Name: <input type=\"text\" id=\"end-user-name\" value=\"Example Person\" /></label>\r\n    ￼<label class=\"input-block\">Email: <input type=\"text\" id=\"end-user-email\" /></label>\r\n    <label class=\"input-block\">Company Id: <input type=\"text\" id=\"end-user-company-id\" /></label>\r\n    ￼<label class=\"input-block\">Company Name: <input type=\"text\" id=\"end-user-company-name\" /></label>\r\n    <hr />\r\n    <textarea id=\"output\" cols=\"80\" rows=\"20\"></textarea>\r\n  </div>\r\n  <script>\r\n    function setObjectProperty(obj, key, value) {\r\n      obj[key] = value\r\n      return obj\r\n    }\r\n\r\n    function getUrlParams() {\r\n      return (location.search + \'?\')\r\n        .split(\'?\')[1]\r\n        .split(\'&\')\r\n        .reduce(function (params, pair) {\r\n          var results = (pair + \'=\').split(\'=\').map(decodeURIComponent)\r\n          var key = results[0]\r\n          var value = results[1]\r\n\r\n          return key.length > 0 ? setObjectProperty(params, key, value) : params\r\n        }, {})\r\n    }\r\n  </script>\r\n  <script>\r\n    var params = getUrlParams()\r\n    var licenseKey = params.licenseKey\r\n      ?? localStorage.getItem(\'licenseKey\')\r\n      ?? \'00000000-0000-0000-0000-000000000000\'\r\n    var testDomain = params.testDomain\r\n      ?? localStorage.getItem(\'testDomain\')\r\n      ?? \'http://localhost:3000\'\r\n    FlatfileImporter.setMountUrl(\r\n      \'//\' + location.host + \'/?key=:key&domain=\' + encodeURIComponent(testDomain)\r\n    )\r\n  </script>\r\n  <script type=\"text/javascript\">\r\n    var K = 1000,\r\n      M = K * K\r\n\r\n    function setConfig(updates, overwrite = false) {\r\n      const config = overwrite ? updates : { ...getConfig(), ...updates }\r\n      location.search = \'?config=\' + btoa(JSON.stringify(config))\r\n    }\r\n\r\n    function getConfig() {\r\n      var params = getUrlParams()\r\n\r\n      if (params.config) {\r\n        return JSON.parse(atob(params.config))\r\n      }\r\n\r\n      const primaryButton = {\r\n        backgroundColor: \'#06c6ff\',\r\n        color: \'#02394b\',\r\n        border: \'none\',\r\n        borderRadius: \'12px\',\r\n        boxShadow: \'0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)\',\r\n        \':hover\': {\r\n          backgroundColor: \'#118CB0\',\r\n          color: \'#02394b\'\r\n        }\r\n      }\r\n\r\n      const secondaryButton = {\r\n        backgroundColor: \'transparent\',\r\n        color: \'#06c6ff\',\r\n        border: \'1px solid #06c6ff\',\r\n        borderRadius: \'12px\',\r\n        boxShadow: \'0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)\',\r\n        \':hover\': {\r\n          backgroundColor: \'#06c6ff\',\r\n          color: \'white\'\r\n        }\r\n      }\r\n\r\n      return {\r\n        // webhookUrl: \'https://webhook.site/8ebf44a7-c864-475b-b007-50e78ae1f2ca\',\r\n        fields: [\r\n          {\r\n            label: \'Robot Name\',\r\n            key: \'name\',\r\n            sizeHint: 2,\r\n            description: \'<img src=\"/Example.gif\" alt=\"Example test image\" width=\"240\" />\',\r\n            shortDescription: \'Short description\',\r\n            validators: [\r\n              {\r\n                validate: \'required_without_all\',\r\n                fields: [\'id\', \'shield-color\'],\r\n                error: \'must be present if no id and shield color\'\r\n              },\r\n              {\r\n                validate: \'unique\'\r\n              }\r\n            ]\r\n          },\r\n          {\r\n            label: \'Shield Color\',\r\n            key: \'shield-color\',\r\n            description: \'Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />Pellentesque non nunc id odio ultricies lacinia. Nunc est libero, convallis ut imperdiet sed, elementum vel massa.\',\r\n            validators: [\r\n              {\r\n                validate: \'regex_matches\',\r\n                regex: \'^[a-z]+$\',\r\n                regexFlags: { ignoreCase: true },\r\n                error: \'Not alphabet only\'\r\n              }\r\n            ]\r\n          },\r\n          {\r\n            label: \'Robot Helmet Style\',\r\n            key: \'helmet-style\',\r\n            validators: [{ validate: \'unique\' }]\r\n          },\r\n          {\r\n            label: \'Select values\',\r\n            key: \'select_test\',\r\n            description: \'Select Test\',\r\n            type: \'select\',\r\n            options: [\r\n              { value: \'yellow\', label: \'Yellow\' },\r\n              { value: \'red\', label: \'Red\' },\r\n              { value: \'orange\', label: \'Orange\' }\r\n            ]\r\n          },\r\n\r\n          {\r\n            label: \'Call Sign\',\r\n            key: \'sign\',\r\n            sizeHint: 0.75,\r\n            alternates: [\'nickname\', \'wave\'],\r\n            validators: [\r\n              { validate: \'required\' },\r\n              {\r\n                validate: \'regex_matches\',\r\n                regex: \'^[a-zA-Z]{4}$\',\r\n                error: \'must be 4 characters exactly\'\r\n              },\r\n              {\r\n                validate: \'regex_excludes\',\r\n                regex: \'test\',\r\n                error: \'must not include the word \"test\"\'\r\n              }\r\n            ]\r\n          },\r\n          {\r\n            label: \'Robot ID Code\',\r\n            key: \'id\',\r\n            description: \'Digital identity\',\r\n            validators: [\r\n              {\r\n                validate: \'regex_matches\',\r\n                regex: \'^[0-9]+$\',\r\n                error: \'must be numeric\'\r\n              },\r\n              {\r\n                validate: \'required_without\',\r\n                fields: [\'name\'],\r\n                error: \'ID must be present if name is absent\'\r\n              }\r\n            ]\r\n          },\r\n          {\r\n            label: \'Operational\',\r\n            key: \'operational\',\r\n            type: \'checkbox\'\r\n          },\r\n          {\r\n            label: \'Last Use Notes\',\r\n            key: \'failure-note\',\r\n            validators: [\r\n              {\r\n                validate: \'regex_matches\',\r\n                regex: \'^.{4,}$\',\r\n                error: \'must be at least 4 chars\'\r\n              }\r\n            ]\r\n          }\r\n        ],\r\n        type: \'Robot\',\r\n        // title: \'Test Header Title\'\r\n        allowInvalidSubmit: true,\r\n        // forceManualInput: true,\r\n        managed: true,\r\n        // devMode: true,\r\n        allowCustom: true,\r\n        // autoMatch: false,\r\n        // displayEncoding: false,\r\n        styleOverrides: {\r\n          borderRadius: \'10px\',\r\n          primaryButtonColor: \'green\'\r\n        },\r\n        disableManualInput: false,\r\n        integrations: {\r\n          adobeFontsWebProjectId: null\r\n        },\r\n        theme: {\r\n          global: {\r\n            //backgroundColor: \'#fff\',\r\n            //textColor: \'white\',\r\n            //primaryTextColor: \'white\',\r\n            //secondaryTextColor: \'white\'\r\n          },\r\n          buttons: {\r\n            primary: primaryButton,\r\n            secondary: secondaryButton,\r\n            tertiary: secondaryButton,\r\n            headerMatchYes: primaryButton,\r\n            headerMatchNo: secondaryButton,\r\n            columnMatchConfirm: primaryButton\r\n          }\r\n        },\r\n        i18nOverrides: {\r\n          // new config\r\n          \'en-US\': {\r\n            otherLocales: [\'en\', \'en-CA\', \'en-GB\'],\r\n            // setLanguage: \'de\',\r\n            overrides: {\r\n              dropzone: {\r\n                accepted: \'please work\'\r\n              },\r\n              poweredBy: \'testing\'\r\n            }\r\n          }\r\n          // old config\r\n          // \'en-US\': {\r\n          //   dropzone: {\r\n          //     button: \'please work\'\r\n          //   },\r\n          //   poweredBy: \'testing\'\r\n          // }\r\n        },\r\n        preventAutoTrimming: false\r\n        // dateFormat: \'dd/mm/yyyy\'\r\n        // preloadRowCount: 20000 // default is 1000\r\n        // encoding: \'utf-16le\'\r\n        // maxSize: 100, // Bytes\r\n        // maxRecords: 10, // Number of rows\r\n        // maxPartitionSize: 1 * M // Max size of a split\r\n      }\r\n    }\r\n\r\n    var robotImporter = new FlatfileImporter(licenseKey, getConfig())\r\n    // importer.setLanguage example\r\n    // robotImporter.setLanguage(\'de\')\r\n    robotImporter.registerFieldHook(\'shield-color\', function (values) {\r\n      console.log(values)\r\n      // debugger\r\n      return [\r\n        [\r\n          {\r\n            value: \'blue\',\r\n            info: [{ message: \'I did ya\', level: \'warning\' }]\r\n          },\r\n          values[0][1]\r\n        ]\r\n      ]\r\n    })\r\n    robotImporter.registerRecordHook(function (data) {\r\n      const out = {}\r\n      if (data[\'shield-color\']) {\r\n        out[\'shield-color\'] = {\r\n          value: data[\'shield-color\'].replace(/[^a-zA-Z]+/g, \'\'),\r\n          info: [\r\n            {\r\n              message: \'Stripped non alphabet characters\',\r\n              level: \'info\'\r\n            }\r\n          ]\r\n        }\r\n      }\r\n      return out\r\n    })\r\n    if (robotImporter.registerBeforeFetchCallback) {\r\n      robotImporter.registerBeforeFetchCallback(function (req) {\r\n        if (req.operation === \'objectStorage:upload\') {\r\n          return\r\n        }\r\n        /**\r\n         * Request data:\r\n         * {\r\n         *  operation: \"PUBLIC_SET_LEGACY_SETTINGS\",\r\n         *  variables: {licenseKey: \"6b57a798-5063-4607-acf7-8bcd8d0c131f\", settings: {...}}\r\n         * }\r\n         */\r\n\r\n        /**\r\n         * Response data has to be:\r\n         * { headers: Record<string, string> }\r\n         */\r\n\r\n        return {\r\n          headers: {\r\n            Authorization: \'YES!\'\r\n          }\r\n        }\r\n      })\r\n    }\r\n    if (robotImporter.registerNetworkErrorCallback) {\r\n      robotImporter.registerNetworkErrorCallback(function (error) {\r\n        console.log(\'network error\', error)\r\n      })\r\n    }\r\n  </script>\r\n  <!-- @endif -->\r\n  <script>\r\n    var dataSource = [\r\n      {\r\n        data: {\r\n          name: \'Foo Bar\',\r\n          \'shield-color\': \'red\',\r\n          \'helmet-style\': \'metal\',\r\n          \'sign\': \'KXAW\',\r\n          \'id\': \'bar,foo\'\r\n        }\r\n      }\r\n    ]\r\n    function launchImporter() {\r\n      var userId = $(\'#end-user-id\').val()\r\n      var name = $(\'#end-user-name\').val()\r\n      var email = $(\'#end-user-email\').val()\r\n      var companyId = $(\'#end-user-company-id\').val()\r\n      var companyName = $(\'#end-user-company-name\').val()\r\n\r\n      function handleSuccess(results) {\r\n        $(\'#output\').val(JSON.stringify(results.validData, null, 2))\r\n        $(\'#filename\').val(results.filename)\r\n        robotImporter.displaySuccess(\'Success message\')\r\n      }\r\n\r\n      function processResults(results) {\r\n        robotImporter.displayLoader(\'Loading message...\')\r\n        setTimeout(function () {\r\n          if (\r\n            results.validData\r\n          ) {\r\n            handleSuccess(results)\r\n          } else {\r\n            robotImporter\r\n              .requestCorrectionsFromUser(\'One robot must have the call sign ABCD\')\r\n              .then(processResults)\r\n          }\r\n        }, 1500)\r\n      }\r\n\r\n      robotImporter.setCustomer({\r\n        userId: userId,\r\n        name: name,\r\n        email: email,\r\n        companyId: companyId,\r\n        companyName: companyName\r\n      })\r\n      robotImporter\r\n        .requestDataFromUser(\r\n          // { source: dataSource }\r\n          // { source: `brent,kulwicki,brent@flatfile.io,US,,47150,\\njohn,somebody,john@doe.com,US,,47150,` }\r\n        )\r\n        .then(processResults)\r\n        .catch(function (error) {\r\n          console.error(error)\r\n          /* TODO: add error handling */\r\n        })\r\n    }\r\n    $(\'#import-button\').click(launchImporter)\r\n    $(launchImporter)\r\n  </script>\r\n</body>\r\n\r\n</html>\r\n\n```\n",
          });

          await api.documents.create(spaceId, {
            title: "None defined",
            body:
            "# Build pages in your sidebar with Documents\n\nHere's a look at the code that was used to create it:\n\n```\nimport api from \"@flatfile/api\";\nimport { Client, FlatfileEvent, FlatfileListener } from \"@flatfile/listener\";\nexport default function flatfileEventListener(listener: Client) {\n  listener.filter({ job: \"space:configure\" }, (configure: FlatfileListener) => {\n    configure.on(\n      \"job:ready\",\n      async ({ context: { spaceId, environmentId, jobId } }: FlatfileEvent) => {\n        try {\n          // Acknowledge the space:configure job:ready event was received\n          await api.jobs.ack(jobId, {\n            info: \"Job started.\",\n            progress: 10,\n          });\n\n          // Add first document\n          await api.documents.create(spaceId, {\n            title: \"About this Documents Demo\",\n            body: \"Document text here.\",\n          });\n\n          // Add another document\n          await api.documents.create(spaceId, {\n            title: \"Configure multiple Documents\",\n            body: \"Document text here.\",\n          });\n\n          // Notify the space:configure job has been completed\n          await api.jobs.complete(jobId, {\n            outcome: {\n              message: \"Job completed.\",\n            },\n          });\n        } catch (error) {\n          await api.jobs.fail(jobId, {\n            outcome: {\n              message: \"Job encountered an error.\",\n            },\n          });\n        }\n      }\n    );\n  });\n}\n```\n",
          });

          await api.documents.create(spaceId, {
            title: "Nonsense",
            body:
            "# Build pages in your sidebar with Documents\n\nHere's a look at the code that was used to create it:\n\n```asdfasdfasdf\nimport api from \"@flatfile/api\";\nimport { Client, FlatfileEvent, FlatfileListener } from \"@flatfile/listener\";\nexport default function flatfileEventListener(listener: Client) {\n  listener.filter({ job: \"space:configure\" }, (configure: FlatfileListener) => {\n    configure.on(\n      \"job:ready\",\n      async ({ context: { spaceId, environmentId, jobId } }: FlatfileEvent) => {\n        try {\n          // Acknowledge the space:configure job:ready event was received\n          await api.jobs.ack(jobId, {\n            info: \"Job started.\",\n            progress: 10,\n          });\n\n          // Add first document\n          await api.documents.create(spaceId, {\n            title: \"About this Documents Demo\",\n            body: \"Document text here.\",\n          });\n\n          // Add another document\n          await api.documents.create(spaceId, {\n            title: \"Configure multiple Documents\",\n            body: \"Document text here.\",\n          });\n\n          // Notify the space:configure job has been completed\n          await api.jobs.complete(jobId, {\n            outcome: {\n              message: \"Job completed.\",\n            },\n          });\n        } catch (error) {\n          await api.jobs.fail(jobId, {\n            outcome: {\n              message: \"Job encountered an error.\",\n            },\n          });\n        }\n      }\n    );\n  });\n}\n```\n",
          });

          await api.documents.create(spaceId, {
            title: "Inline",
            body:
            "First, we check for `null`, `undefined`, and empty strings, and then we cast them to `null`. Next, we check if we have a number written as a percentage. If so, we extract the numerical portion and divide it by 100. For other strings, we attempt to parse them directly to numbers using `parseFloat`. If we can, we return them as-is; if we cannot, we surface an error to the user.",
          });

          // Update Space to set primary workbook for data checklist functionality using the Flatfile API
          const updateSpace = await api.spaces.update(spaceId, {
            environmentId: environmentId,
            primaryWorkbookId: workbookId,
          });
          // Log the result of the updateSpace function to the console as a string
          console.log("Updated Space with ID: " + updateSpace.data.id);

          console.log(workbookId);

          const answer1 = await api.sheets.list({ workbookId });
          console.log("Here is my result" + JSON.stringify(answer1));

          // Update the job status to 'complete' using the Flatfile API
          await api.jobs.complete(jobId, {
            outcome: {
              message: "This job is now complete.",
            },
          });
        } catch (error) {
          console.error("Error:", error.stack);

          await api.jobs.fail(jobId, {
            outcome: {
              message: "This job encountered an error.",
            },
          });
        }
      }
    );
  });
}
// See full code example (https://github.com/FlatFilers/flatfile-docs-kitchen-sink/blob/main/javascript/dynamic-configurations/index.js)
