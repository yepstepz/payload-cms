import { Block } from "payload/types";

export const SocialMessage: Block = {
  slug: 'SocialMessage',
  fields: [
    {
        type: 'relationship',
        relationTo: 'socials',
        name: 'socialEntity',
    },
    {
      name: 'description',
      type: 'textarea'
    },
    {
      name: 'shareTo',
      type: 'checkbox',
      defaultValue: true
    },
    {
      name: 'syndicatedTo',
      type: 'text'
    },
  ]
}
