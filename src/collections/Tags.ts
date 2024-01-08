import { CollectionConfig } from 'payload/types'

const Tags: CollectionConfig = {
    slug: 'tags',
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
            name: 'description',
            type: 'text',
        },
        {
            name: 'slug',
            type: 'text',
            required: true
        },
    ],
}

export default Tags
