import { Flatfile } from "@flatfile/api";

export const peopleSheet: Flatfile.SheetConfig = {
  name: 'People',
  slug: 'people',
  fields: [
    { key: 'name', type: 'string', label: 'Full Name' },
    { key: 'email', type: 'string', label: 'Email' }
  ]
}