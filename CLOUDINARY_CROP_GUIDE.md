# Cloudinary Image Cropping Guide

Since PayloadCMS's built-in `crop` feature doesn't work with Cloudinary storage, we use Cloudinary's URL-based transformations instead.

## How It Works

1. **In CMS Admin**: Optionally enter crop coordinates (x, y, width, height) in the Media collection
2. **In Frontend**: Use utility functions to apply transformations via Cloudinary URLs

## Usage Examples

### Basic Usage

```typescript
import { getCloudinaryUrl, cloudinaryPresets } from '@/utils/cloudinary'

// Simple resize
const resized = getCloudinaryUrl(media.url, {
  width: 800,
  height: 600,
  crop: 'fill',
  quality: 'auto',
  format: 'auto'
})

// Use preset
const thumbnail = cloudinaryPresets.thumbnail(media.url, media.cropData)
```

### With Custom Crop Coordinates from CMS

```typescript
import { getMediaUrl } from '@/utils/cloudinary'

// Automatically applies crop coordinates if they exist in media.cropData
const croppedImage = getMediaUrl(media, {
  width: 1200,
  crop: 'fill'
})
```

### Responsive Images

```typescript
// Auto quality, format, and DPR for responsive images
const responsiveUrl = getCloudinaryUrl(media.url, {
  width: 800,
  quality: 'auto',
  format: 'auto',
  dpr: 'auto',
  customCrop: media.cropData
})
```

### In React/Next.js Components

```tsx
import { getMediaUrl, cloudinaryPresets } from '@/utils/cloudinary'
import type { MediaDocument } from '@/utils/cloudinary'

interface Props {
  media: MediaDocument
}

export function ProductImage({ media }: Props) {
  return (
    <picture>
      {/* Mobile */}
      <source
        media="(max-width: 640px)"
        srcSet={getMediaUrl(media, { width: 640, crop: 'fill' })}
      />
      
      {/* Tablet */}
      <source
        media="(max-width: 1024px)"
        srcSet={getMediaUrl(media, { width: 1024, crop: 'fill' })}
      />
      
      {/* Desktop */}
      <img
        src={getMediaUrl(media, { width: 1920, crop: 'fill' })}
        alt={media.alt}
        loading="lazy"
      />
    </picture>
  )
}

// Or use preset
export function Avatar({ media }: Props) {
  return (
    <img
      src={cloudinaryPresets.avatar(media.url, media.cropData)}
      alt={media.alt}
    />
  )
}
```

## Available Presets

- `thumbnail` - 150x150, fill
- `card` - 400x300, fill
- `hero` - 1920x1080, fill
- `avatar` - 200x200, fill with face detection
- `responsive(width)` - Dynamic width with auto optimizations

## Cloudinary Transformation Options

### Crop Modes
- `fill` - Resize and crop to exact dimensions
- `fit` - Resize to fit within dimensions
- `scale` - Force exact dimensions (may distort)
- `limit` - Only resize if larger
- `pad` - Resize and pad to exact dimensions
- `crop` - Extract specific region

### Gravity/Focal Point
- `auto` - Auto-detect focal point
- `center` - Center of image
- `face` / `faces` - Focus on detected faces
- `north`, `south`, `east`, `west` - Edge alignment

### Quality
- `auto` - Cloudinary auto-optimizes
- `1-100` - Manual quality setting

### Format
- `auto` - Best format for browser (WebP, AVIF, etc.)
- `jpg`, `png`, `webp`, `avif` - Specific format

## Manual Crop Coordinates

If you want to manually define crop coordinates in the CMS:

1. Go to Media collection
2. Edit any image
3. Expand "Crop Settings (Optional)"
4. Enter coordinates:
   - **x**: Left position (pixels from left edge)
   - **y**: Top position (pixels from top edge)
   - **width**: Crop width in pixels
   - **height**: Crop height in pixels

These coordinates will be automatically applied when using `getMediaUrl()` or passing `media.cropData` to `cloudinaryPresets`.

## Learn More

- [Cloudinary Transformation Reference](https://cloudinary.com/documentation/image_transformations)
- [Cloudinary URL Parameters](https://cloudinary.com/documentation/image_transformation_reference)
