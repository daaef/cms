# Backup Information

**Timestamp:** 2025-11-28 20:33:09

**Change Description:** Refactoring Media collection to use beforeChange hook with Cloudinary buffer upload

**Reason for Change:** 
Fix Vercel EROFS (read-only file system) error when uploading media files. The current implementation uses `afterChange` hook which tries to write to local disk first, then upload to Cloudinary. This fails on Vercel's serverless environment which has a read-only filesystem.

**Affected Files:**
- src/collections/Media.ts

**Changes:**
1. Remove `staticDir: 'media'` from upload config to prevent local filesystem writes
2. Replace `afterChange` hook with `beforeChange` hook
3. Upload file buffer directly to Cloudinary from memory using upload_stream
4. Handle file metadata (filename, size, mimeType) properly
5. Return Cloudinary URL as the primary file source

**How to Restore:**
```bash
cp backups/cloudinary-buffer-upload-20251128-203309/src/collections/Media.ts src/collections/Media.ts
```

**Related Issues:**
- Vercel deployment fails with "EROFS: read-only file system, open 'media/about.png'"
- Error occurs at file upload in production environment

