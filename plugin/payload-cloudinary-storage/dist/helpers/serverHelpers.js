import { generateSignedURL as generateCloudinarySignedURL } from "./signedURLs.js";
import { normalizeCollectionConfig, getSignedURLConfig } from "./normalizeConfig.js";
export async function getSignedURL({ payload, collection, docId, user, transformations, pluginOptions }) {
    try {
        const doc = await payload.findByID({
            collection,
            id: docId,
            user,
            depth: 0
        });
        if (!doc) {
            throw new Error('Document not found');
        }
        if (!doc.requiresSignedURL && !doc.isPrivate) {
            const baseUrl = doc.url || doc.cloudinaryUrl;
            if (transformations && baseUrl) {
                return applyTransformationsToUrl(baseUrl, transformations);
            }
            return baseUrl;
        }
        let signedURLConfig;
        if (pluginOptions?.collections?.[collection]) {
            const collectionConfig = pluginOptions.collections[collection];
            const rawConfig = typeof collectionConfig === 'boolean' ? {} : collectionConfig;
            const config = normalizeCollectionConfig(rawConfig);
            signedURLConfig = getSignedURLConfig(config);
        }
        return generateCloudinarySignedURL({
            publicId: doc.cloudinaryPublicId,
            version: doc.cloudinaryVersion,
            resourceType: doc.cloudinaryResourceType || 'image',
            format: doc.cloudinaryFormat,
            transformations,
            expiresIn: signedURLConfig?.expiresIn
        }, signedURLConfig);
    } catch (error) {
        console.error('Failed to generate signed URL:', error);
        return null;
    }
}
export async function getSignedURLs({ payload, collection, docIds, user, transformations, pluginOptions }) {
    const results = {};
    await Promise.all(docIds.map(async (docId)=>{
        const url = await getSignedURL({
            payload,
            collection,
            docId,
            user,
            transformations,
            pluginOptions
        });
        results[docId] = url;
    }));
    return results;
}
export function applyTransformationsToUrl(url, transformations) {
    const urlParts = url.split('/upload/');
    if (urlParts.length !== 2) {
        return url;
    }
    const transformString = Object.entries(transformations).map(([key, value])=>{
        if (key === 'width') key = 'w';
        if (key === 'height') key = 'h';
        if (key === 'crop') key = 'c';
        if (key === 'quality') key = 'q';
        if (key === 'format') key = 'f';
        if (key === 'gravity') key = 'g';
        if (key === 'radius') key = 'r';
        if (key === 'angle') key = 'a';
        if (key === 'opacity') key = 'o';
        if (key === 'border') key = 'bo';
        if (key === 'background') key = 'b';
        if (key === 'overlay') key = 'l';
        if (key === 'underlay') key = 'u';
        if (key === 'fetch_format') key = 'f_auto';
        if (key === 'f_auto') return 'f_auto';
        if (key === 'q' && value === 'auto') return 'q_auto';
        if (key === 'q' && value === 'auto:best') return 'q_auto:best';
        if (key === 'q' && value === 'auto:good') return 'q_auto:good';
        if (key === 'q' && value === 'auto:eco') return 'q_auto:eco';
        if (key === 'q' && value === 'auto:low') return 'q_auto:low';
        return `${key}_${value}`;
    }).join(',');
    const [baseUrl, resourcePath] = urlParts;
    if (resourcePath.includes('/authenticated/')) {
        const authParts = resourcePath.split('/');
        if (authParts.length >= 3 && authParts[0] === 'authenticated') {
            authParts.splice(2, 0, transformString);
            return `${baseUrl}/upload/${authParts.join('/')}`;
        }
    }
    return `${baseUrl}/upload/${transformString}/${resourcePath}`;
}
export function requiresSignedURL(doc) {
    return doc?.requiresSignedURL === true || doc?.isPrivate === true;
}
function extractTransformationsFromUrl(url) {
    if (!url) return undefined;
    const match = url.match(/\/upload\/([^\/]+)\/v\d+/);
    if (!match || !match[1]) return undefined;
    const transformString = match[1];
    const transformations = {};
    const parts = transformString.split(',');
    for (const part of parts){
        if (part === 'f_auto') {
            transformations.fetch_format = 'auto';
            continue;
        }
        if (part === 'q_auto') {
            transformations.quality = 'auto';
            continue;
        }
        if (part.startsWith('q_auto:')) {
            transformations.quality = part.replace('q_', '');
            continue;
        }
        if (part.startsWith('e_') && part.includes(':')) {
            transformations.effect = part.replace('e_', '');
            continue;
        }
        const underscoreIndex = part.indexOf('_');
        if (underscoreIndex === -1) continue;
        const key = part.substring(0, underscoreIndex);
        const value = part.substring(underscoreIndex + 1);
        if (key && value) {
            switch(key){
                case 'w':
                    transformations.width = isNaN(Number(value)) ? value : Number(value);
                    break;
                case 'h':
                    transformations.height = isNaN(Number(value)) ? value : Number(value);
                    break;
                case 'c':
                    transformations.crop = value;
                    break;
                case 'q':
                    transformations.quality = value;
                    break;
                case 'f':
                    transformations.fetch_format = value;
                    break;
                case 'g':
                    transformations.gravity = value;
                    break;
                case 'dpr':
                    transformations.dpr = value;
                    break;
                case 'e':
                    transformations.effect = value;
                    break;
                case 'r':
                    transformations.radius = value;
                    break;
                case 'a':
                    transformations.angle = value;
                    break;
                case 'o':
                    transformations.opacity = value;
                    break;
                case 'bo':
                    transformations.border = value;
                    break;
                case 'b':
                    transformations.background = value;
                    break;
                case 'l':
                    transformations.overlay = value;
                    break;
                case 'u':
                    transformations.underlay = value;
                    break;
                default:
                    transformations[key] = value;
            }
        }
    }
    return Object.keys(transformations).length > 0 ? transformations : undefined;
}
export async function getImageURL(doc, options) {
    if (requiresSignedURL(doc) && options?.payload && options?.collection) {
        return getSignedURL({
            payload: options.payload,
            collection: options.collection,
            docId: doc.id,
            user: options.user,
            transformations: options.transformations,
            pluginOptions: options.pluginOptions
        });
    }
    const baseUrl = doc?.url || doc?.cloudinaryUrl;
    if (!baseUrl) return null;
    if (options?.transformations) {
        return applyTransformationsToUrl(baseUrl, options.transformations);
    }
    return baseUrl;
}
export async function getPrivateImageURL(doc, options) {
    if (!doc) return null;
    const needsSignedUrl = requiresSignedURL(doc);
    if (!needsSignedUrl) {
        return options.includeTransformations && doc?.transformedUrl ? doc.transformedUrl : doc?.url || doc?.cloudinaryUrl;
    }
    let transformations;
    if (options.includeTransformations && doc?.transformedUrl) {
        transformations = extractTransformationsFromUrl(doc.transformedUrl);
    }
    const signedUrl = await getSignedURL({
        payload: options.payload,
        collection: options.collection,
        docId: doc.id,
        user: options.user,
        transformations,
        pluginOptions: options.pluginOptions
    });
    return signedUrl;
}
export function getPublicPreviewURL(doc, includeTransformations = false) {
    if (!doc) return null;
    return includeTransformations && doc?.previewUrl ? doc.previewUrl : doc?.publicTransformationURL || doc?.thumbnailURL;
}
export async function getPremiumImageURL(doc, options) {
    if (!doc) {
        return {
            url: null,
            isPreview: false,
            requiresAuth: false
        };
    }
    const needsSignedUrl = requiresSignedURL(doc);
    if (!needsSignedUrl) {
        const url = options.includeTransformations && doc?.transformedUrl ? doc.transformedUrl : doc?.url || doc?.cloudinaryUrl;
        return {
            url,
            isPreview: false,
            requiresAuth: false
        };
    }
    if (!options.isAuthenticated) {
        const previewUrl = getPublicPreviewURL(doc, options.includeTransformations);
        return {
            url: previewUrl,
            isPreview: true,
            requiresAuth: true
        };
    }
    let transformations;
    if (options.includeTransformations && doc?.transformedUrl) {
        transformations = extractTransformationsFromUrl(doc.transformedUrl);
    }
    const signedUrl = await getSignedURL({
        payload: options.payload,
        collection: options.collection,
        docId: doc.id,
        user: options.user,
        transformations,
        pluginOptions: options.pluginOptions
    });
    const finalUrl = signedUrl || doc?.url;
    return {
        url: finalUrl,
        isPreview: false,
        requiresAuth: true
    };
}
