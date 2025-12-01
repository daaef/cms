# Team Bio & Video Upload Implementation

## Summary

This document explains the changes made to support:
1. **Team member bios** in the About page
2. **Video uploads** instead of text URLs for the home page video section

---

## ✅ What Has Been Done

### 1. Team Bio Field (Already Implemented)
The bio field has been added to the AboutPage collection for team members:

**Location**: `/cms/src/collections/AboutPage.ts` (lines 185-192)

```typescript
{
    name: 'bio',
    type: 'textarea',
    required: false,
    admin: {
        description: 'Short biography (recommended: 100-150 characters)',
        rows: 3,
    },
}
```

**Seed Data**: Already includes bio data in `/cms/seed-data/about-page.json`

Example:
```json
{
  "name": "Dr. Jude Nwadiuto",
  "role": "Co-Founder & CEO",
  "bio": "Visionary leader with 10+ years in robotics and AI. PhD in Robotics from MIT. Passionate about transforming industries through intelligent automation.",
  "imageUrl": "/about/jude.jpg"
}
```

### 2. Video Upload Field (Just Updated)
Changed the `videoUrl` text field to a proper upload field:

**Location**: `/cms/src/collections/HomePage.ts` (line 101-108)

**Before:**
```typescript
{
    name: 'videoUrl',
    type: 'text',
    required: true,
}
```

**After:**
```typescript
{
    name: 'video',
    type: 'upload',
    relationTo: 'media',
    required: true,
    admin: {
        description: 'Upload video file (MP4, WebM, etc.)',
    },
}
```

### 3. Media Collection Already Supports Videos
The Media collection is configured to accept video files:

**Location**: `/cms/src/collections/Media.ts` (line 13)

```typescript
upload: {
    disableLocalStorage: true,
    mimeTypes: ['image/*', 'video/*'], // ✅ Videos supported
    crop: true,
    focalPoint: true,
}
```

---

## 📋 What You Need To Do

### Step 1: Add Video Files to Seed Data

1. **Place video files** in the website-v2 public folder:
   ```
   /website-v2/public/videos/zibot.mp4
   ```

2. **Update the seed-media.ts script** to include videos:

   Open `/cms/scripts/seed-media.ts` and add video entries around line 80:

   ```typescript
   // Product videos
   { 
       path: '../../website-v2/public/videos/zibot.mp4', 
       alt: 'ZiBot Product Demo', 
       filename: 'zibot-demo.mp4',
       type: 'video'
   },
   ```

3. **Update the upload logic** in `seed-media.ts` to handle video files:

   Find the section that processes files (around line 100+) and ensure it handles both images and videos. The current implementation should work, but verify the `mimeType` detection works for videos.

### Step 2: Update Home Page Seed Data

Update `/cms/seed-data/home-page.json`:

**Before:**
```json
"videoSection": {
  "enabled": true,
  "videoUrl": "/videos/zibot.mp4",
  "posterImage": ""
}
```

**After:**
```json
"videoSection": {
  "enabled": true,
  "video": "zibot-demo.mp4",
  "posterImage": ""
}
```

Note: The value should match the `filename` you used in the media seed.

### Step 3: Update the Home Page Seed Script

Update `/cms/scripts/seed-home.ts` to handle the video upload relationship:

Find where `videoSection` is being created and change:

```typescript
// Before
videoUrl: homePageData.videoSection.videoUrl,

// After
video: await getMediaIdByFilename(homePageData.videoSection.video),
```

You'll need a helper function like:

```typescript
async function getMediaIdByFilename(filename: string) {
  const media = await payload.find({
    collection: 'media',
    where: {
      filename: {
        equals: filename,
      },
    },
  });
  
  return media.docs[0]?.id || null;
}
```

### Step 4: Update Website-v2 to Handle Video Data

Update your website-v2 components to handle the new video structure:

**Before (using videoUrl string):**
```typescript
<video src={videoSection.videoUrl} />
```

**After (using video upload object):**
```typescript
<video src={videoSection.video?.url} poster={videoSection.posterImage?.url} />
```

---

## 🧪 Testing

### Test Team Bio
1. Navigate to CMS → About Page
2. Edit team members
3. Verify bio field appears and saves correctly
4. Check API response includes bio data

### Test Video Upload
1. Navigate to CMS → Home Page
2. Click on Video Section
3. Click "Select File" for the video field
4. Upload a video file or select from media library
5. Verify video saves correctly
6. Check API response has video object with URL

### Seed Testing
1. Run the seed scripts:
   ```bash
   cd /Users/apple/Fainzy/cms
   pnpm run seed
   ```

2. Verify:
   - All media (images + videos) are uploaded
   - Home page has video relationship
   - About page has team member bios

---

## 📁 Files Modified

1. ✅ `/cms/src/collections/AboutPage.ts` - Bio field already added
2. ✅ `/cms/src/collections/HomePage.ts` - Video upload field added
3. ⏳ `/cms/seed-data/home-page.json` - Update video field
4. ⏳ `/cms/scripts/seed-home.ts` - Handle video relationship
5. ⏳ `/cms/scripts/seed-media.ts` - Add video files
6. ⏳ `/website-v2/src/app/page.tsx` (or relevant component) - Handle video object

---

## 🎥 Supported Video Formats

Cloudinary supports:
- MP4 (recommended)
- WebM
- OGG
- AVI
- MOV
- FLV
- MKV

For web use, **MP4** is recommended for best browser compatibility.

---

## 🔧 Cloudinary Video Transformations

You can apply transformations to videos similar to images:

```typescript
// Example: Resize video
const videoUrl = video.url?.replace('/upload/', '/upload/w_800,h_600,c_limit/')

// Example: Generate thumbnail
const thumbnail = video.url?.replace('/upload/', '/upload/so_0,du_1/') // First frame
```

---

## 📝 Notes

- Videos will be stored in Cloudinary, not locally
- PayloadCMS automatically handles video metadata (duration, format, etc.)
- The crop tool works for video thumbnails but not for video content itself
- Consider adding a duration limit in the upload config if needed

---

## Support

If you encounter issues:
1. Check Cloudinary dashboard for uploaded videos
2. Verify CLOUDINARY_URL env variable is set correctly
3. Check CMS logs for upload errors
4. Ensure video file sizes are within Cloudinary limits
