// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import {HomePage} from "@/collections/HomePage";
import {AboutPage} from "@/collections/AboutPage";
import {ProductsPage} from "@/collections/ProductsPage";
import {CareersPage} from "@/collections/CareersPage";
import {BlogPosts} from "@/collections/BlogPosts";
import {ContactPage} from "@/collections/ContactPage";
import {Products} from "@/collections/Products";
import {DashboardHomePage} from "@/collections/DashboardHomePage";
import {ProductDetails} from "@/collections/ProductDetails";

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, HomePage, AboutPage, ProductsPage, CareersPage, BlogPosts, ContactPage, Products, DashboardHomePage, ProductDetails],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
})
