import path from 'path'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload/config";

import {
  UploadFeature,
} from '@payloadcms/richtext-lexical';
import { CodeBlockFeature } from "payload-code-block-feature";
import { cloudStorage } from '@payloadcms/plugin-cloud-storage';
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3';

const adapter = s3Adapter({
  config: {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    region: process.env.S3_REGION,
    // ... Other S3 configuration
  },
  bucket: process.env.S3_BUCKET,
})

import Socials from './collections/Socials'
import Users from './collections/Users'
import Notes from './collections/Notes'
import Media from './collections/Media'
import Tags from './collections/Tags'

export default buildConfig({
  serverURL : process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
  user: Users.slug,
  bundler: webpackBundler(),
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          fs: false
        }
      }
    }),
  },
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
        ...defaultFeatures,
      CodeBlockFeature(),
      UploadFeature({
        collections: {
          uploads: {
            // Example showing how to customize the built-in fields
            // of the Upload feature
            fields: [
              {
                name: 'caption',
                type: 'richText',
                editor: lexicalEditor(),
              },
            ],
          },
        },
      }),
    ]
  }),
  collections: [Socials, Users, Notes, Media, Tags],
  plugins: [
    cloudStorage({
      collections: {
        media: {
          adapter, // see docs for the adapter you want to use
        },
      },
    }),
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
})
