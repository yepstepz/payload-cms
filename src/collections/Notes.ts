import { CollectionConfig } from 'payload/types'

const Notes: CollectionConfig = {
    slug: 'notes',
    access: { read: () => true },
    admin: {
        useAsTitle: 'title_text',
    },
    fields: [
        {
            name: 'title', // required
            type: 'group', // required
            interfaceName: 'Title', // optional
            fields: [
                {
                    name: 'text',
                    type: 'text',
                    required: true
                },
                {
                    name: 'visibility',
                    type: 'checkbox',
                    defaultValue: true
                },
            ],
        },
        {
            name: 'content',
            type: 'richText',
        },
        {
            name: 'image',
            type: 'upload',
            label: 'Note Image',
            relationTo: 'media', // required
            admin: {
                position: 'sidebar',
            }
        },
        {
            name: 'og', // required
            type: 'group', // required
            label: 'OG Tags', // optional
            fields: [
                {
                    name: 'type',
                    type: 'text',
                    required: true
                },
                {
                    name: 'title',
                    type: 'text',
                    required: true
                }
            ],
        },
        {
            name: 'meta', // required
            type: 'group', // required
            interfaceName: 'Meta', // optional
            fields: [
                {
                    name: 'description',
                    type: 'text'
                }
            ],
            admin: {
                position: 'sidebar',
            }
        },
        {
            name: 'tags',
            label: 'Tags',
            type: 'relationship',
            relationTo: 'tags',
            hasMany: true,
            admin: {
                position: 'sidebar',
            }
        },
        {
            name: 'slug',
            type: 'text',
            label: 'Slug',
            required: true

        },
        {
            name: 'oldDate',
            type: 'date',
            label: 'Old Date',
        },
    ]
}

export default Notes
