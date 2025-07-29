import { Flatfile } from "@flatfile/api";

export const contactsSheet: Flatfile.SheetConfig = {
  name: 'contacts',
  slug: 'contacts',
  fields: [
    { key: 'name', type: 'string', label: 'Full Name' },
    { key: 'email', type: 'string', label: 'Email' }
  ]
}