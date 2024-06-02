import { Block } from "payload/types";

const types = [
  {
    label: 'Reply',
    value: 'u-in-reply-to',
  },
  {
    label: 'Like',
    value: 'u-like-of',
  },
  {
    label: 'Repost',
    value: 'u-repost-of',
  },
  {
    label: 'Bookmark',
    value: 'u-bookmark-of',
  },
  {
    label: 'Mention',
    value: 'u-mention-of',
  },
]

export const ReplyContext: Block = {
  slug: 'Reply', // required
  interfaceName: 'ReplyBlock', // optional
  fields: [
    // required
    {
      name: 'typeOfReply',
      type: 'select',
      options: types
    },
    {
      name: 'replyUrl',
      type: 'text',
    },
    {
      name: 'replyCite',
      type: 'group',
      fields: [
        {
          type: 'text',
          name: 'title'
        },
        {
          type: 'richText',
          name: 'content'
        }
      ]
    }
  ],
}
