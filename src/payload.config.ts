// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { cloudinaryStorage } from '../plugin/payload-cloudinary-storage/dist/index.js'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import {HomePage} from "@/collections/HomePage"
import {AboutPage} from "@/collections/AboutPage"
import {ProductsPage} from "@/collections/ProductsPage"
import {CareersPage} from "@/collections/CareersPage"
import {BlogPosts} from "@/collections/BlogPosts"
import {ContactPage} from "@/collections/ContactPage"
import {Products} from "@/collections/Products"
import {DashboardHomePage} from "@/collections/DashboardHomePage"
import {ProductDetails} from "@/collections/ProductDetails"
import {Navbar} from "@/collections/Navbar"
import {Footer} from "@/collections/Footer"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const serverURL = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001'
const allowedOrigins = [
  serverURL,
  'http://localhost:3000',  // Development frontend
  'https://fainzy.com',     // Production frontend (update with your actual domain)
  'https://www.fainzy.com', // Production frontend with www
  'https://dashboard-v2-inky.vercel.app',
  'https://fainzy-website-v2.vercel.app',
]

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, HomePage, AboutPage, ProductsPage, CareersPage, BlogPosts, ContactPage, Products, DashboardHomePage, ProductDetails, Navbar, Footer],
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
  serverURL,
  cors: allowedOrigins,
  csrf: allowedOrigins,
  plugins: [
    cloudinaryStorage({
      cloudConfig: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
        api_key: process.env.CLOUDINARY_API_KEY!,
        api_secret: process.env.CLOUDINARY_API_SECRET!,
        params: {
          // Keep filenames readable, but don't force unique_filename here
          use_filename: true,
          unique_filename: false, // Let public_id be derived from filename/folder
          overwrite: true,        // Allow safe updates if the adapter tries to overwrite
          invalidate: true,       // Ensure cached URLs are invalidated if overwritten
          folder: 'fainzy-cms',
        },
      },
      collections: {
        media: {
          // You can still override per-collection if needed
          folder: 'fainzy-cms',
        },
      },
    })
  ],
})
