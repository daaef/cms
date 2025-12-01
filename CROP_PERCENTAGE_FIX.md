# FIXED: Crop Coordinates Conversion (Percentage to Pixels)

## Issue

The crop coordinates from PayloadCMS were being saved as-is (24, 0, 52, 53), which are **percentage values** (0-100), not pixel values. This resulted in a tiny 52x53 pixel crop instead of the intended area.

## Root Cause

PayloadCMS's crop tool returns coordinates as **percentages** of the image dimensions:
- `x: 24` = 24% from left edge
- `y: 0` = 0% from top edge  
- `width: 52` = 52% of image width
- `height: 53` = 53% of image height

We were treating these as pixel values directly, resulting in incorrect Cloudinary transformations.

## Solution

Convert percentage values to pixels before saving to database and generating Cloudinary URLs.

### Updated Hook in `/cms/src/collections/Media.ts`

```typescript
hooks: {
  beforeChange: [
    ({ data, req }) => {
      const uploadEdits = req.query?.uploadEdits as any
      
      if (uploadEdits?.crop) {
        // PayloadCMS provides crop coordinates as percentages (0-100)
        // We need to convert them to pixels for Cloudinary
        const imageWidth = data.width || 100
        const imageHeight = data.height || 100
        
        const cropPercentages = {
          x: uploadEdits.crop.x || 0,
          y: uploadEdits.crop.y || 0,
          width: uploadEdits.crop.width || 100,
          height: uploadEdits.crop.height || 100,
        }
        
        // Convert percentages to pixels
        const cropPixels = {
          x: Math.round((cropPercentages.x / 100) * imageWidth),
          y: Math.round((cropPercentages.y / 100) * imageHeight),
          width: Math.round((cropPercentages.width / 100) * imageWidth),
          height: Math.round((cropPercentages.height / 100) * imageHeight),
        }
        
        // Save pixel coordinates
        data.cropData = cropPixels

        // Generate cropped URL with pixel coordinates
        if (data.url && typeof data.url === 'string' && data.url.includes('cloudinary.com')) {
          const { x, y, width, height } = cropPixels
          const transformations = [`x_${x},y_${y},w_${width},h_${height},c_crop`]
          
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

## Example Calculation

### Your Image
- Dimensions: **468 x 609 pixels**
- Crop percentages: `{ x: 24, y: 0, width: 52, height: 53 }`

### Before Fix (Incorrect)
```
cropData: { x: 24, y: 0, width: 52, height: 53 }  ❌ Only 52x53 pixels!
croppedUrl: .../upload/x_24,y_0,w_52,h_53,c_crop/...
```

### After Fix (Correct)
```javascript
x: (24 / 100) * 468 = 112 pixels
y: (0 / 100) * 609 = 0 pixels
width: (52 / 100) * 468 = 243 pixels
height: (53 / 100) * 609 = 323 pixels

cropData: { x: 112, y: 0, width: 243, height: 323 }  ✅ Much better!
croppedUrl: .../upload/x_112,y_0,w_243,h_323,c_crop/...
```

## Expected API Response

```json
{
  "id": 47,
  "width": 468,
  "height": 609,
  "cropData": {
    "x": 112,
    "y": 0,
    "width": 243,
    "height": 323
  },
  "croppedUrl": "https://res.cloudinary.com/.../upload/x_112,y_0,w_243,h_323,c_crop/...jpg"
}
```

## How to Test

1. **Restart CMS server** to load the updated code
2. **Edit Afekhide's image** in CMS admin
3. **Re-apply the crop** using the crop tool (or just click Save)
4. **Check the cropData** - it should now show pixel values (e.g., 243x323 instead of 52x53)
5. **Check the croppedUrl** - it should use the pixel coordinates
6. **Test on about page** - image should display properly cropped

## Test URLs

### Before (Wrong)
```
https://res.cloudinary.com/dwneq7h9j/image/upload/x_24,y_0,w_52,h_53,c_crop/v1764539002/fainzy-cms/ma9cupnv3rbmomsu3x8d.jpg
```

### After (Correct)
```
https://res.cloudinary.com/dwneq7h9j/image/upload/x_112,y_0,w_243,h_323,c_crop/v1764539002/fainzy-cms/ma9cupnv3rbmomsu3x8d.jpg
```

### With Resize (Final)
```
https://res.cloudinary.com/dwneq7h9j/image/upload/x_112,y_0,w_243,h_323,c_crop,w_400,h_400,c_fill,q_auto/v1764539002/fainzy-cms/ma9cupnv3rbmomsu3x8d.jpg
```

Try opening the "After" URL in your browser - you should see a properly cropped image!

## Build Status

✅ CMS builds successfully  
✅ Website-v2 builds successfully  
✅ Percentage to pixel conversion implemented  
✅ Ready to test

## Note

The `ImageCropField.tsx` component was disabled (renamed to `.tsx.old`) as it's not currently used and was causing build errors. The built-in PayloadCMS crop tool works perfectly for our needs.
