# Cloudinary Crop Issue - Fix Applied

## Problem Identified

When uploading an image and then cropping it in the Payload CMS admin:
1. User uploads image → Cloudinary URL created: `https://res.cloudinary.com/.../upload/.../image.jpg`
2. User crops the image → **Cloudinary plugin re-uploads cropped version** → URL changes to new cropped image
3. Hook tries to generate `croppedUrl` from the already-cropped URL → results in wrong transformations

**Result**: Both `url` and `croppedUrl` end up being the same (the re-uploaded cropped image URL).

## Root Cause

The Cloudinary storage plugin **physically uploads a new cropped version** of the image when you use Payload's crop tool, changing `data.url`. The `beforeChange` hook was using this new URL to try to generate transformations, which doesn't work correctly.

## Solution Applied

### 1. Added `originalUrl` Field
**File**: `/cms/src/collections/Media.ts`

Added new field to store the original Cloudinary URL:
```typescript
{
  name: 'originalUrl',
  type: 'text',
  label: 'Original Cloudinary URL',
  admin: {
    description: 'Original uncropped URL from Cloudinary',
    readOnly: true,
    position: 'sidebar',
  },
}
```

### 2. Updated `beforeChange` Hook

**Key Changes:**
- On **CREATE**: Store `data.url` as `data.originalUrl` 
- On **UPDATE with crop**: Use `originalUrl` (not `data.url`) to generate `croppedUrl`
- Added `operation` parameter to detect create vs update

**Logic Flow:**
```typescript
// First upload
operation === 'create' → Save data.url to data.originalUrl

// When cropping
uploadEdits?.crop exists → Use data.originalUrl (not data.url) for transformations
```

### 3. How It Works Now

**Upload Flow:**
1. User uploads `image.jpg`
2. Cloudinary returns: `https://res.cloudinary.com/.../upload/.../abc123.jpg`
3. Hook saves this to **both** `url` AND `originalUrl`

**Crop Flow:**
1. User crops the image
2. Cloudinary plugin re-uploads → `url` changes to `xyz789.jpg` (new cropped version)
3. Hook uses `originalUrl` (abc123.jpg) to generate `croppedUrl` with transformations
4. **Result**:
   - `url`: `xyz789.jpg` (Cloudinary's physical crop)
   - `originalUrl`: `abc123.jpg` (preserved original)
   - `croppedUrl`: `abc123.jpg` with `/c_crop,fl_relative,x_0.24,y_0.12,w_0.50,h_0.50/` transformations

## Benefits

1. ✅ **Original URL preserved** - Never lost even after multiple crops
2. ✅ **Correct transformations** - Always based on original image dimensions
3. ✅ **Server-side cropping** - Cloudinary generates crops on-the-fly
4. ✅ **No duplicate uploads** - Original image stays as reference

## Files Modified

- `/cms/src/collections/Media.ts`
  - Added `originalUrl` field
  - Updated `beforeChange` hook to use `operation` parameter
  - Changed transformation logic to use `originalUrl` as base

## Testing

**To verify the fix works:**

1. Upload a new image in CMS
2. Check that `originalUrl` is populated with the initial Cloudinary URL
3. Crop the image using Payload's crop tool
4. Save the changes
5. Verify:
   - `url` = New Cloudinary URL (the cropped version)
   - `originalUrl` = Original Cloudinary URL (unchanged)
   - `croppedUrl` = Original URL with transformations like `/c_crop,fl_relative,x_0.24,.../`

**Expected Console Output:**
```
Crop percentages: { x: 24, y: 12, width: 50, height: 50 }
Transformations: [ 'c_crop,fl_relative,x_0.24,y_0.12,w_0.50,h_0.50' ]
[Media Hook] Generated cropped URL: {
  originalUrl: 'https://res.cloudinary.com/.../abc123.jpg',
  currentUrl: 'https://res.cloudinary.com/.../xyz789.jpg',
  croppedUrl: 'https://res.cloudinary.com/.../upload/c_crop,fl_relative,x_0.24,y_0.12,w_0.50,h_0.50/abc123.jpg'
}
```

## Next Steps

1. Deploy updated code to Vercel
2. Test with a new image upload and crop
3. Verify `croppedUrl` displays the correct cropped image
4. Existing images without `originalUrl` will use `data.url` as fallback

## Database Migration (Optional)

For existing images that don't have `originalUrl` set:

```sql
-- Update existing media to set originalUrl from url
UPDATE media 
SET original_url = url 
WHERE original_url IS NULL AND url IS NOT NULL;
```

---

**Date**: December 3, 2025  
**Status**: ✅ Fix applied - Ready for deployment  
**Impact**: All future image uploads will preserve original URL for correct crop transformations
