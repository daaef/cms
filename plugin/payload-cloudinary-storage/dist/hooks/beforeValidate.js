export const createBeforeValidateHook = (collectionSlug, _config)=>async ({ data, originalDoc, req, operation })=>{
        if (operation !== 'update' || !originalDoc || !data) {
            return data;
        }
        if (originalDoc.cloudinaryPublicId) {
            req.payload.logger.info({
                msg: 'BeforeValidate hook - checking Cloudinary data',
                collection: collectionSlug,
                operation,
                hasOriginalCloudinaryData: !!originalDoc.cloudinaryPublicId,
                hasIncomingCloudinaryData: !!data.cloudinaryPublicId,
                incomingFields: Object.keys(data)
            });
        }
        if (originalDoc.cloudinaryPublicId && !data.cloudinaryPublicId) {
            req.payload.logger.info({
                msg: 'Preserving Cloudinary data during metadata update',
                collection: collectionSlug,
                cloudinaryPublicId: originalDoc.cloudinaryPublicId
            });
            data.cloudinaryPublicId = originalDoc.cloudinaryPublicId;
            data.cloudinaryUrl = originalDoc.cloudinaryUrl;
            data.cloudinaryResourceType = originalDoc.cloudinaryResourceType;
            data.cloudinaryFormat = originalDoc.cloudinaryFormat;
            data.cloudinaryVersion = originalDoc.cloudinaryVersion;
            data.cloudinaryFolder = originalDoc.cloudinaryFolder;
            data.url = originalDoc.url;
            data.originalUrl = originalDoc.originalUrl;
            data.thumbnailURL = originalDoc.thumbnailURL;
            data.filename = data.filename || originalDoc.filename;
            data.filesize = data.filesize || originalDoc.filesize;
            data.mimeType = data.mimeType || originalDoc.mimeType;
            data.width = data.width || originalDoc.width;
            data.height = data.height || originalDoc.height;
            if (originalDoc.eagerTransformations) {
                data.eagerTransformations = originalDoc.eagerTransformations;
            }
            if (originalDoc.secureTransformedUrl) {
                data.secureTransformedUrl = originalDoc.secureTransformedUrl;
            }
        }
        return data;
    };
