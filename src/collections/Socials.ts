import { CollectionConfig } from 'payload/types'

const Socials: CollectionConfig = {
  slug: 'socials',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true
    },
    {
      name: 'slug',
      type: 'text',
      required: true
    },
  ],
}

export default Socials
