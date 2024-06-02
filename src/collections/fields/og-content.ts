import { Block } from "payload/types";

export const OgContent: Block = {
  slug: 'Og',
  interfaceName: 'OgContent',
  fields: [
    {
      type: 'text',
      name: 'tag'
    },
    {
      type: 'text',
      name: 'content'
    }
  ]
}
