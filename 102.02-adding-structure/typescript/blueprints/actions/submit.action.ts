import { Flatfile } from "@flatfile/api";

export const submitAction: Flatfile.Action = {
  label: 'Submit',
  description: 'Send data to destination system',
  operation: 'submitActionForeground',
  mode: 'foreground',
  primary: true
}