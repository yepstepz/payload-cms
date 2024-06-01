export const SocialMessage = {
  slug: 'SocialMessage',
  fields: [
    {
        type: 'relationship',
        relationTo: 'socials',
        name: 'social',
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
  ]
}
