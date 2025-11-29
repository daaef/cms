# Cloudinary Implementation for Payload CMS v3

## Overview

This implementation uses the official `payload-storage-cloudinary` plugin for Payload CMS v3, providing serverless-compatible media uploads with Cloudinary. It bypasses the local filesystem entirely, making it compatible with read-only environments like Vercel.

## Plugin Information

- **Package:** [`payload-storage-cloudinary`](https://www.npmjs.com/package/payload-storage-cloudinary)
- **Version:** 1.1.3+
- **Compatibility:** Payload CMS v3.x

## Problem Solved

**Error on Vercel:**
```
EROFS: read-only file system, open 'media/about.png'
```

**Root Cause:** Payload CMS was trying to write files to the local `media/` directory. Vercel's serverless functions have a read-only filesystem, causing uploads to fail.

## Solution

### Architecture

The `payload-storage-cloudinary` plugin handles:

1. **Direct Upload to Cloudinary** - Files go straight to Cloudinary from memory
2. **No Filesystem Dependency** - Completely bypasses local file storage
3. **Automatic URL Generation** - Plugin manages all Cloudinary URLs
4. **Smart Re-upload Prevention** - Avoids duplicate uploads
5. **CDN Delivery** - Global content delivery via Cloudinary CDN

### Installation

```bash
pnpm add payload-storage-cloudinary
```

### Configuration

#### 1. Environment Variables

Required in both local development and Vercel:

```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### 2. Payload Config (`src/payload.config.ts`)

```typescript
import { cloudinaryStorage } from 'payload-storage-cloudinary'

export default buildConfig({
  // ...existing config
  plugins: [
    cloudinaryStorage({
      cloudConfig: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
        api_key: process.env.CLOUDINARY_API_KEY!,
        api_secret: process.env.CLOUDINARY_API_SECRET!,
      },
      collections: {
        media: {
          folder: 'fainzy-cms', // Cloudinary folder for uploads
        },
      },
    }),
  ],
})
```

#### 3. Media Collection (`src/collections/Media.ts`)

```typescript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true, // Public read access
    create: ({ req: { user } }) => !!user, // Authenticated users only
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  upload: {
    disableLocalStorage: true, // Required - Cloudinary handles storage
    mimeTypes: ['image/*', 'video/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
```

## How It Works

1. **User uploads file** through Payload Admin UI
2. **Plugin intercepts upload** before filesystem write
3. **File streams directly to Cloudinary** from memory buffer
4. **Cloudinary returns URL** and metadata
5. **Plugin stores URL** in Payload database
6. **File served via Cloudinary CDN**

## Plugin Features

### Automatic URL Fields

The plugin automatically adds these fields to your documents:

- **`url`** - Main URL for the file
- **`originalUrl`** - Direct URL to original file
- **`thumbnailURL`** - Admin UI thumbnail (150x150)

### Folder Organization

All uploads are organized in Cloudinary:
```
fainzy-cms/
  ├── image1.jpg
  ├── image2.png
  └── video1.mp4
```

### Setting in Vercel

1. Go to Project Settings → Environment Variables
2. Add the three variables above
3. Set for all environments (Production, Preview, Development)
4. Redeploy

## File Structure

```
fainzy-cms/
├── src/
│   ├── collections/
│   │   └── Media.ts           # ✅ Simple plugin-based config
│   └── payload.config.ts      # ✅ Plugin configured here
├── package.json               # payload-storage-cloudinary dependency
└── .env                       # Local environment variables
```

## Testing

### Local Development
```bash
pnpm dev
# Upload a file through Payload Admin
# File goes directly to Cloudinary
```

### Vercel Deployment
```bash
git add .
git commit -m "feat: implement payload-storage-cloudinary plugin"
git push
# Test upload in production admin panel
```

## Verification Checklist

- [x] `payload-storage-cloudinary` package installed
- [x] Plugin configured in `payload.config.ts`
- [x] `disableLocalStorage: true` in Media collection
- [x] Cloudinary credentials set in environment variables
- [x] Access control configured (create/update/delete for authenticated users)
- [x] No custom hooks needed - plugin handles everything
- [x] No `staticDir` in upload config

## Advanced Configuration

### Custom Folder per Upload

```typescript
collections: {
  media: {
    folder: ({ req }) => {
      // Dynamic folder based on user or other logic
      return req.user ? `uploads/${req.user.id}` : 'public'
    },
  },
}
```

### With Transformation Presets

```typescript
collections: {
  media: {
    folder: 'fainzy-cms',
    transformations: [
      {
        name: 'Thumbnail',
        transformation: { width: 150, height: 150, crop: 'fill' },
      },
      {
        name: 'Medium',
        transformation: { width: 800, quality: 'auto' },
      },
    ],
  },
}
```

### Private Files with Signed URLs

```typescript
collections: {
  media: {
    folder: 'fainzy-cms',
    enableSignedUrls: true, // Generate time-limited URLs
    signedUrlExpiry: 3600,  // 1 hour expiry
  },
}
```

## Migration from Custom Implementation

If upgrading from a custom Cloudinary implementation:

1. **Install plugin:** `pnpm add payload-storage-cloudinary`
2. **Update payload.config.ts:** Add plugin configuration
3. **Simplify Media.ts:** Remove custom hooks and fields
4. **Remove cloudinary package:** `pnpm remove cloudinary` (plugin includes it)
5. **Test uploads:** Verify files upload to same Cloudinary folder

## Troubleshooting

### 403 Forbidden - "You are not allowed to perform this action"
**Check:** Media collection access control configuration

**Solution:** 
1. Ensure you're logged in to the Payload Admin
2. Verify Media collection has proper access control:
```typescript
access: {
  read: () => true,
  create: ({ req: { user } }) => !!user,
  update: ({ req: { user } }) => !!user,
  delete: ({ req: { user } }) => !!user,
}
```
3. Check browser console for authentication token
4. Verify you have a valid user session

### Upload Fails Silently
**Check:** Cloudinary credentials in environment variables
```bash
# Verify in Vercel logs or local terminal
echo $CLOUDINARY_CLOUD_NAME
echo $CLOUDINARY_API_KEY
echo $CLOUDINARY_API_SECRET
```

**Solution:**
1. Verify all three environment variables are set
2. Ensure no typos in variable names
3. Restart dev server after adding variables
4. For Vercel: Redeploy after adding env vars

### Plugin Not Working
**Check:** Plugin configuration in payload.config.ts

**Solution:**
```typescript
// ✅ Correct
plugins: [
  cloudinaryStorage({
    cloudConfig: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    },
    collections: {
      media: {
        folder: 'fainzy-cms',
      },
    },
  }),
]

// ❌ Wrong - Missing import
// Missing: import { cloudinaryStorage } from 'payload-storage-cloudinary'
```

### Files Still Trying to Write to Disk
**Check:** `disableLocalStorage` in upload config

**Solution:**
```typescript
upload: {
  disableLocalStorage: true, // ✅ Required
  mimeTypes: ['image/*', 'video/*'],
}
```

### TypeScript Errors
**Check:** Package installation and imports

**Solution:**
```bash
# Reinstall plugin
pnpm add payload-storage-cloudinary

# Regenerate types
pnpm run generate:types
```

## Performance Considerations

### Upload Speed
- Direct buffer upload is faster than disk → Cloudinary
- No intermediate filesystem operations
- Streaming reduces memory footprint

### Memory Usage
- Files are streamed, not loaded entirely into memory
- Suitable for large files (videos, high-res images)

### Concurrent Uploads
- Each upload is independent
- No filesystem lock contention
- Scales horizontally on Vercel

## Security

### Credentials
- Never commit `.env` to git
- Use Vercel environment variables for production
- Rotate API keys periodically

### Public Access
- All uploads are public by default
- Configure Cloudinary access control if needed
- Use signed URLs for private content

## References

- [Payload CMS v3 Documentation](https://payloadcms.com/docs)
- [payload-storage-cloudinary Plugin](https://www.npmjs.com/package/payload-storage-cloudinary)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)

---

**Implementation Date:** November 28, 2025  
**Payload CMS Version:** 3.65.0  
**Plugin Version:** payload-storage-cloudinary 1.1.3

