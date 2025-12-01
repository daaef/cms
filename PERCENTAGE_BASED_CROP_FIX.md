# FINAL FIX: Percentage-Based Cloudinary Cropping

## Problem

The image had different dimensions at different stages:
- **Original upload**: 831 x 1069 pixels
- **After Cloudinary processing**: 493 x 552 pixels

When we converted crop percentages to pixels using the resized dimensions, we got incorrect crop areas (e.g., 243x323 pixels instead of 432x567 pixels from the original).

## Root Cause

PayloadCMS's crop tool returns **percentages** (24%, 0%, 52%, 53%), but Cloudinary had already resized the image. We were converting these percentages to pixels using the **wrong dimensions** (the resized version, not the original).

## Solution

Use **Cloudinary's percentage-based cropping** directly by adding the `p` suffix to crop coordinates. This way, Cloudinary applies the percentage crop to whatever version of the image it serves.

### Updated Hook in `/cms/src/collections/Media.ts`

```typescript
hooks: {
  beforeChange: [
    ({ data, req }) => {
      const uploadEdits = req.query?.uploadEdits as any
      
      if (uploadEdits?.crop) {
        // PayloadCMS provides crop coordinates as percentages (0-100)
        // Save them as-is since Cloudinary also supports percentage-based cropping
        const cropPercentages = {
          x: Math.round(uploadEdits.crop.x || 0),
          y: Math.round(uploadEdits.crop.y || 0),
          width: Math.round(uploadEdits.crop.width || 100),
          height: Math.round(uploadEdits.crop.height || 100),
        }
        
        // Save percentage coordinates
        data.cropData = cropPercentages

        // Generate cropped URL using percentage-based coordinates
        // Cloudinary syntax: x_24p,y_0p,w_52p,h_53p (p = percentage)
        if (data.url && typeof data.url === 'string' && data.url.includes('cloudinary.com')) {
          const { x, y, width, height } = cropPercentages
          const transformations = [`x_${x}p,y_${y}p,w_${width}p,h_${height}p,c_crop`]
          
          const parts = data.url.split('/upload/')
          if (parts.length === 2) {
            data.croppedUrl = `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`
          }
        }
      }
      
      return data
    },
  ],
}
```

### Updated Frontend `/website-v2/lib/cloudinary.ts`

```typescript
// Apply custom crop coordinates if provided
// CropData values are percentages (0-100), so we add 'p' suffix for Cloudinary
if (options.customCrop) {
  const { x, y, width, height } = options.customCrop;
  if (x !== undefined && x !== null && y !== undefined && y !== null && width && height) {
    transformations.push(`x_${x}p,y_${y}p,w_${width}p,h_${height}p,c_crop`);
  }
}
```

## How Percentage-Based Cropping Works

### Your Image with Crop: x=24%, y=0%, width=52%, height=53%

**On Original Image (831x1069):**
- x: 24% of 831 = 199px from left
- y: 0% of 1069 = 0px from top
- width: 52% of 831 = 432px wide ✅
- height: 53% of 1069 = 567px tall ✅

**On Resized Image (493x552):**
- x: 24% of 493 = 118px from left
- y: 0% of 552 = 0px from top
- width: 52% of 493 = 256px wide ✅
- height: 53% of 552 = 293px tall ✅

**On Any Size:**
- The crop **percentage stays the same**
- Cloudinary calculates pixels dynamically
- Works perfectly regardless of transformations!

## Generated URLs

### Percentage-Based (Correct) ✅
```
https://res.cloudinary.com/dwneq7h9j/image/upload/x_24p,y_0p,w_52p,h_53p,c_crop/v1764539002/fainzy-cms/ma9cupnv3rbmomsu3x8d.jpg
```

### With Additional Transformations
```
https://res.cloudinary.com/dwneq7h9j/image/upload/x_24p,y_0p,w_52p,h_53p,c_crop,w_400,h_400,c_fill,q_auto/v1764539002/fainzy-cms/ma9cupnv3rbmomsu3x8d.jpg
```

## Expected API Response

```json
{
  "id": 47,
  "width": 493,
  "height": 552,
  "cropData": {
    "x": 24,
    "y": 0,
    "width": 52,
    "height": 53
  },
  "croppedUrl": "https://res.cloudinary.com/.../upload/x_24p,y_0p,w_52p,h_53p,c_crop/...jpg"
}
```

**Note**: `cropData` now stores percentages, not pixels!

## Benefits

✅ **Dimension-independent**: Works on original, resized, or any transformed version  
✅ **Simpler logic**: No conversion needed, just add 'p' suffix  
✅ **More accurate**: Cloudinary handles pixel calculations  
✅ **Future-proof**: Works even if Cloudinary changes resize behavior  

## How to Test

1. **Restart CMS server**
2. **Edit Afekhide's image** in CMS admin
3. **Re-crop or just click Save**
4. **Check API response**:
   - `cropData` should be percentages: `{ x: 24, y: 0, width: 52, height: 53 }`
   - `croppedUrl` should have `p` suffix: `.../x_24p,y_0p,w_52p,h_53p,c_crop/...`
5. **Test the croppedUrl** directly in browser
6. **Check about page** - image should display with correct crop

## Test URL

```
https://res.cloudinary.com/dwneq7h9j/image/upload/x_24p,y_0p,w_52p,h_53p,c_crop/v1764539002/fainzy-cms/ma9cupnv3rbmomsu3x8d.jpg
```

Open this in your browser - you should see a properly cropped image that's approximately 52% of the width and 53% of the height of the original!

## Build Status

✅ CMS builds successfully  
✅ Website-v2 builds successfully  
✅ Percentage-based cropping implemented  
✅ Ready to deploy and test!

## Documentation References

- [Cloudinary Percentage-Based Cropping](https://cloudinary.com/documentation/image_transformation_reference#x_y_parameters)
- Note: Adding `p` suffix to coordinates tells Cloudinary to treat them as percentages
