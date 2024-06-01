import { CollectionConfig } from 'payload/types'
import { ReplyContext } from "./fields/reply-context";
import { OgContent } from "./fields/og-content";
import { SocialMessage } from "./fields/social-message";

// @ts-ignore
const Notes: CollectionConfig = {
    slug: 'notes',
    access: { read: () => true },
    admin: {
        useAsTitle: 'titleForAdmin'
    },
    fields: [
        {
            name: 'status',
            type: 'select',
            options: [
                {
                    value: 'draft',
                    label: 'Draft',
                },
                {
                    value: 'published',
                    label: 'Published',
                },
            ],
            defaultValue: 'draft',
            admin: {
                position: 'sidebar',
            }
        },
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
            ]
        },
        {
            name: 'titleForAdmin',
            type: 'text',
            label: 'Title for Admin',
            admin: {
                hidden: true,
                disableBulkEdit: true
            },
            hooks: {
                beforeChange: [({ data }) => data.title.text],
                afterRead: [({ data }) => data.title.text]
            }
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
            type: 'blocks', // required
            minRows: 1,
            maxRows: 20,
            blocks: [
                OgContent,
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
            name: 'replyContexts',
            type: 'blocks',
            minRows: 1,
            maxRows: 20,
            blocks: [
                ReplyContext,
            ],
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
            name: 'socialMessages',
            label: 'Social Messages',
            type: 'blocks',
            blocks: [
                SocialMessage
            ],
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
