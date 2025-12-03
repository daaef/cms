import { v2 as cloudinary } from "cloudinary";
export const createDeleteHandler = (options)=>async ({ collection, doc, filename })=>{
        console.log('[Cloudinary Delete] Delete handler called for collection:', collection.slug);
        console.log('[Cloudinary Delete] Filename:', filename);
        console.log('[Cloudinary Delete] Has doc:', !!doc);
        console.log('[Cloudinary Delete] Doc data:', doc ? {
            id: doc.id,
            cloudinaryPublicId: doc.cloudinaryPublicId,
            filename: doc.filename
        } : 'No doc');
        console.log('[Cloudinary Delete] Stack trace:', new Error().stack);
        if (doc && doc.cloudinaryPublicId) {
            const stackTrace = new Error().stack || '';
            const isUpdateOperation = stackTrace.includes('beforeChange') || stackTrace.includes('updateDocument');
            const isDeleteOperation = stackTrace.includes('afterDelete') || stackTrace.includes('deleteByID');
            console.log('[Cloudinary Delete] Is update operation:', isUpdateOperation);
            console.log('[Cloudinary Delete] Is delete operation:', isDeleteOperation);
            console.log('[Cloudinary Delete] Has valid Cloudinary URL:', !!doc.url);
            if (isUpdateOperation && !isDeleteOperation) {
                console.warn('[Cloudinary Delete] WARNING: Delete called during update operation!');
                console.warn('[Cloudinary Delete] Document still has valid Cloudinary data. Preventing deletion.');
                console.warn('[Cloudinary Delete] This appears to be a bug in Payload cloud storage plugin.');
                return;
            }
            if (isDeleteOperation) {
                console.log('[Cloudinary Delete] Legitimate delete operation detected. Proceeding with deletion.');
            }
        }
        const collectionConfig = options.collections[collection.slug];
        if (!collectionConfig || typeof collectionConfig === 'boolean') {
            return;
        }
        const deleteFromCloudinary = collectionConfig.deleteFromCloudinary !== false;
        if (!deleteFromCloudinary) {
            return;
        }
        try {
            const publicId = doc.cloudinaryPublicId || extractPublicId(doc.url || filename);
            const resourceType = doc.cloudinaryResourceType || 'image';
            if (publicId) {
                await cloudinary.uploader.destroy(publicId, {
                    resource_type: resourceType,
                    invalidate: true
                });
                try {
                    await cloudinary.api.delete_derived_resources([
                        publicId
                    ], {
                        resource_type: resourceType
                    });
                } catch (derivedError) {
                    console.log(`No derived resources to delete for ${publicId}`);
                }
            }
        } catch (error) {
            console.error(`Failed to delete from Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };
function extractPublicId(urlOrFilename) {
    try {
        if (urlOrFilename.includes('cloudinary.com')) {
            const parts = urlOrFilename.split('/');
            const uploadIndex = parts.findIndex((part)=>part === 'upload');
            if (uploadIndex !== -1 && uploadIndex < parts.length - 1) {
                const publicIdWithExtension = parts.slice(uploadIndex + 2).join('/');
                return publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
            }
        }
        return urlOrFilename.substring(0, urlOrFilename.lastIndexOf('.'));
    } catch  {
        return null;
    }
}
