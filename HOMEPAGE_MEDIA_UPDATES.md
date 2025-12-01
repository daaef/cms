# HomePage Media Upload Updates

## Summary
Updated the HomePage collection to use media uploads instead of text fields for hero slide content.

## Changes Made

### 1. HomePage Collection (`src/collections/HomePage.ts`)

**Before:**
- `type`: Select field (zibot, glide, consultancy, custom)
- `subtitle`: Text field
- `cursiveText`: Text field

**After:**
- `typeImage`: Upload field (media) - For product type logos/images
- `title`: Text field (optional) - For custom title text
- `subtitleImage`: Upload field (media) - For subtitle images
- `cursiveTextImage`: Upload field (media) - For cursive text images

### 2. Benefits

1. **Better Design Control**: Designers can create custom graphics with exact fonts, colors, and styling
2. **Multi-language Support**: Different language versions can have properly designed graphics
3. **Consistency**: Typography and branding remain consistent across all slides
4. **Performance**: Optimized images load faster than web fonts
5. **Flexibility**: Can use custom artwork, animations, or special effects

### 3. Migration Required

**Old Seed Data Format:**
```json
{
  "type": "zibot",
  "subtitle": "Anything Anytime Anywhere",
  "cursiveText": "Delivery"
}
```

**New Format (requires media references):**
```json
{
  "typeImage": "{{MEDIA_ID_FOR_ZIBOT_LOGO}}",
  "title": "",
  "subtitleImage": "{{MEDIA_ID_FOR_SUBTITLE_IMAGE}}",
  "cursiveTextImage": "{{MEDIA_ID_FOR_DELIVERY_TEXT}}"
}
```

### 4. Media Collection

The Media collection already supports:
- ✅ Video uploads (`mimeTypes: ['image/*', 'video/*']`)
- ✅ Image cropping with Cloudinary
- ✅ Automatic crop URL generation
- ✅ Focal point selection

### 5. Video Upload Already Implemented

The `videoSection` in HomePage already uses media upload:
```typescript
{
  name: 'video',
  type: 'upload',
  relationTo: 'media',
  required: true,
}
```

### 6. About Page Team Bio

The team members bio field is already implemented:
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

Seed data also includes bio content for all team members.

## Next Steps

### For Development Team:

1. **Create Image Assets**
   - Design images for:
     - ZiBot type logo
     - Glide type logo
     - Consultancy type logo
     - Subtitle images (e.g., "Anything Anytime Anywhere")
     - Cursive text images (e.g., "Delivery")

2. **Update Seed Script**
   - Upload media assets first
   - Get media IDs
   - Update home-page.json with media IDs instead of text

3. **Update Website-v2 Frontend**
   - Modify hero slide component to render images instead of text
   - Handle fallback if images are not provided
   - Ensure responsive image loading

### Sample Media Upload Script:

```javascript
// Upload images and get IDs
const zibotLogo = await uploadToMedia('/path/to/zibot-logo.png', 'ZiBot Logo');
const subtitleImg = await uploadToMedia('/path/to/subtitle.png', 'Subtitle Image');
const cursiveImg = await uploadToMedia('/path/to/cursive-text.png', 'Cursive Text');

// Update seed data
heroSlides[0].typeImage = zibotLogo.id;
heroSlides[0].subtitleImage = subtitleImg.id;
heroSlides[0].cursiveTextImage = cursiveImg.id;
```

## Backward Compatibility

⚠️ **Breaking Change**: Old text-based hero slides will need migration.

**Migration Path:**
1. Export existing hero slide text content
2. Create image assets from text
3. Upload images to media collection
4. Update hero slides with media references

## Testing Checklist

- [ ] Upload video to Media collection
- [ ] Video displays correctly in videoSection
- [ ] Upload hero slide images
- [ ] Hero slides render images correctly
- [ ] Test responsive behavior
- [ ] Verify Cloudinary crop works on all media types
- [ ] Check team member bios display correctly
- [ ] Verify SEO metadata is preserved
