# Video Upload Guide for Fainzy CMS

## Overview
The CMS now supports uploading and managing video files alongside images. Videos can be used in product detail pages, hero sections, and other content areas.

## Supported Video Formats
- **MP4** (.mp4) - Recommended for best browser compatibility
- **WebM** (.webm) - Good for modern browsers
- **MOV** (.mov) - QuickTime format
- **AVI** (.avi) - Windows format

## How to Upload Videos

### Via CMS Admin Panel
1. Navigate to **Media** collection in the admin panel
2. Click **Create New**
3. Drag and drop your video file or click to browse
4. Add alt text (required for accessibility)
5. Click **Save**

### Via Seeding Script
1. Place your video files in `website-v2/public/videos/` directory
2. Update `scripts/seed-media.ts` and add your video to the `imagesToUpload` array:

```typescript
{ 
  path: '../../website-v2/public/videos/product-demo.mp4', 
  alt: 'Product Demo Video', 
  filename: 'product-demo.mp4' 
},
```

3. Run the seed script:
```bash
pnpm run seed:media
```

## Using Videos in Content

### Product Details - Video with Text Section
Videos can be added to product detail pages in the "Video with Text" section:

1. Edit or create a Product Detail
2. Add a new section with type **Video with Text**
3. Select your video from the Media collection
4. Optionally add a poster image (thumbnail shown before video plays)
5. Add accompanying text content

### Product Details - Background Video Section
For immersive hero sections with background videos:

1. Add a section with type **Background Video**
2. Select your video file
3. Add poster image for better loading experience
4. Configure overlay text and CTAs

### Product Details - Video with Stats
Showcase product features with video and statistics:

1. Add section type **Video with Stats**
2. Select background video
3. Add statistics (numbers, labels, descriptions)
4. Configure layout and styling

## Best Practices

### File Size
- **Keep videos under 10MB** for faster loading
- Use compression tools like HandBrake or FFmpeg
- Consider using Cloudinary's video optimization features

### Resolution
- **1920x1080 (Full HD)** for hero/feature videos
- **1280x720 (HD)** for background videos
- **854x480 (SD)** for smaller sections

### Length
- **Hero videos**: 10-15 seconds (looping)
- **Product demos**: 30-60 seconds
- **Background videos**: 5-10 seconds (looping)

### Poster Images
- Always provide a poster image (first frame or custom thumbnail)
- Use same aspect ratio as video
- Optimized JPG/PNG format

### Accessibility
- Add descriptive alt text
- Consider adding captions/subtitles for important content
- Ensure videos don't auto-play with sound

## Video Compression Tips

### Using FFmpeg (Command Line)
```bash
# Compress MP4 to ~10MB max, 720p
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4

# Create WebM version for better compression
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus output.webm
```

### Using Online Tools
- [CloudConvert](https://cloudconvert.com/mp4-converter)
- [Handbrake](https://handbrake.fr/) - Free desktop app
- [Clideo](https://clideo.com/compress-video)

## Cloudinary Integration

Videos uploaded to the CMS are automatically stored in Cloudinary with the following features:

- **Automatic format optimization** - Delivers best format per browser
- **Adaptive bitrate streaming** - Adjusts quality based on connection
- **Thumbnail generation** - Auto-creates poster images
- **Video transformations** - Resize, crop, effects on-the-fly

### Example Cloudinary Video URL
```
https://res.cloudinary.com/dwneq7h9j/video/upload/w_1280,h_720,c_fill,q_auto/v1234567890/fainzy-cms/product-demo.mp4
```

## Testing Videos

After uploading:
1. Check video plays in CMS preview
2. Test on actual website pages
3. Verify on mobile devices
4. Check loading performance
5. Ensure poster image displays correctly

## Troubleshooting

### Video won't upload
- Check file size (max 100MB via admin panel)
- Verify MIME type is supported
- Ensure Cloudinary credentials are configured

### Video doesn't play
- Check browser console for errors
- Verify video format is supported
- Ensure CORS headers are properly configured
- Check Cloudinary URL is accessible

### Slow loading
- Compress video file size
- Use poster image for faster initial load
- Enable lazy loading for below-fold videos
- Consider shorter video duration

## Example Seed Data

Complete example of adding videos to seed data:

```typescript
const imagesToUpload = [
    // ... existing images ...
    
    // Product videos
    { 
        path: '../../website-v2/public/videos/zibot-hero.mp4', 
        alt: 'ZiBot Hero Video', 
        filename: 'zibot-hero.mp4' 
    },
    { 
        path: '../../website-v2/public/videos/glide-demo.mp4', 
        alt: 'Glide Scooter Demo', 
        filename: 'glide-demo.mp4' 
    },
    { 
        path: '../../website-v2/public/videos/manufacturing.mp4', 
        alt: 'Manufacturing Process', 
        filename: 'manufacturing.mp4' 
    },
];
```

## Need Help?

Contact the development team or check:
- [Cloudinary Video Documentation](https://cloudinary.com/documentation/video_manipulation_and_delivery)
- [PayloadCMS Upload Documentation](https://payloadcms.com/docs/upload/overview)
