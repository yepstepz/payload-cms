import { CollectionConfig } from 'payload/types'
import path from 'path'

export const Media: CollectionConfig = {
    slug: 'media',
    upload: {
        staticDir: path.resolve(__dirname, '../../media'),
        resizeOptions: {
            fit: 'cover'
        },
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'alt',
            type: 'text',
            required: true,
        },
        {
            name: 'caption',
            type: 'text',
        },
    ],
}

export default Media;
