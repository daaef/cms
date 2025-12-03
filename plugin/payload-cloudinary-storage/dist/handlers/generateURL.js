import { v2 as cloudinary } from "cloudinary";
import { generateSignedURL } from "../helpers/signedURLs.js";
import { normalizeCollectionConfig, getTransformationConfig, getSignedURLConfig } from "../helpers/normalizeConfig.js";
export const createURLGenerator = (options)=>({ collection, filename, prefix, data })=>{
        const collectionConfig = options.collections[collection.slug];
        if (!collectionConfig) {
            return filename;
        }
        if (data?.cloudinaryUrl) {
            return data.cloudinaryUrl;
        }
        const rawConfig = typeof collectionConfig === 'boolean' ? {} : collectionConfig;
        const config = normalizeCollectionConfig(rawConfig);
        const transformConfig = getTransformationConfig(config);
        const signedURLConfig = getSignedURLConfig(config);
        if (data?.requiresSignedURL && signedURLConfig) {
            return generateSignedURL({
                publicId: data.cloudinaryPublicId || filename,
                version: data.cloudinaryVersion,
                resourceType: data.cloudinaryResourceType,
                format: data.cloudinaryFormat,
                transformations: transformConfig.default
            }, signedURLConfig);
        }
        const transformations = {
            ...transformConfig.default || {}
        };
        if (transformations.format === 'auto' || transformations.fetchFormat === 'auto') {
            transformations.fetch_format = 'auto';
            delete transformations.format;
        }
        if (transformations.quality === 'auto') {
            transformations.quality = 'auto';
        }
        const publicId = data?.cloudinaryPublicId || filename.substring(0, filename.lastIndexOf('.'));
        const fullPublicId = prefix && !data?.cloudinaryPublicId ? `${prefix}/${publicId}` : publicId;
        const urlOptions = {
            secure: true,
            transformation: Object.keys(transformations).length > 0 ? transformations : undefined
        };
        if (data?.cloudinaryVersion) {
            urlOptions.version = data.cloudinaryVersion;
        }
        return cloudinary.url(fullPublicId, urlOptions);
    };
