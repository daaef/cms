import { v2 as cloudinary } from "cloudinary";
import { getFolderConfig } from "../helpers/normalizeConfig.js";
export const createBeforeChangeHook = (collectionSlug, config)=>async ({ data, originalDoc, req, operation })=>{
        if (!originalDoc?.cloudinaryPublicId) {
            return data;
        }
        if (operation === 'update') {
            req.payload.logger.info({
                msg: 'BeforeChange hook - Cloudinary file preservation check',
                collection: collectionSlug,
                hasOriginalFile: !!originalDoc.cloudinaryPublicId,
                hasNewFile: !!(data._file || data.file),
                willPreserveFile: !data._file && !data.file
            });
        }
        if (!data.cloudinaryPublicId && originalDoc.cloudinaryPublicId) {
            req.payload.logger.warn({
                msg: 'Preserving Cloudinary data - preventing accidental deletion',
                collection: collectionSlug,
                cloudinaryPublicId: originalDoc.cloudinaryPublicId
            });
            data.cloudinaryPublicId = originalDoc.cloudinaryPublicId;
            data.cloudinaryUrl = originalDoc.cloudinaryUrl;
            data.cloudinaryResourceType = originalDoc.cloudinaryResourceType;
            data.cloudinaryFormat = originalDoc.cloudinaryFormat;
            data.cloudinaryVersion = originalDoc.cloudinaryVersion;
            data.url = originalDoc.url;
            data.originalUrl = originalDoc.originalUrl;
            data.thumbnailURL = originalDoc.thumbnailURL;
        }
        const folderConfig = getFolderConfig(config);
        if (!folderConfig.enableDynamic) {
            return data;
        }
        const folderFieldName = folderConfig.fieldName || 'cloudinaryFolder';
        const oldFolder = originalDoc[folderFieldName] || '';
        const newFolder = data[folderFieldName] || '';
        if (oldFolder === newFolder) {
            return data;
        }
        try {
            const oldPublicId = originalDoc.cloudinaryPublicId;
            const parts = oldPublicId.split('/');
            const filename = parts[parts.length - 1];
            const newPublicId = newFolder ? `${newFolder}/${filename}` : filename;
            const result = await cloudinary.uploader.rename(oldPublicId, newPublicId, {
                resource_type: originalDoc.cloudinaryResourceType || 'auto',
                overwrite: false,
                invalidate: true
            });
            if (result.public_id) {
                data.cloudinaryPublicId = result.public_id;
                data.cloudinaryUrl = result.secure_url;
                data.cloudinaryVersion = result.version;
                data.url = result.secure_url;
                const thumbnailUrl = cloudinary.url(result.public_id, {
                    secure: true,
                    version: result.version,
                    transformation: {
                        width: 150,
                        height: 150,
                        crop: 'fill',
                        gravity: 'auto',
                        quality: 'auto',
                        fetch_format: 'auto'
                    }
                });
                data.thumbnailURL = thumbnailUrl;
                if (result.folder) {
                    data[folderFieldName] = result.folder;
                }
                req.payload.logger.info({
                    msg: `Moved Cloudinary asset from ${oldPublicId} to ${newPublicId}`,
                    collection: collectionSlug
                });
            }
        } catch (error) {
            req.payload.logger.error({
                msg: `Failed to move Cloudinary asset`,
                collection: collectionSlug,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        return data;
    };
