import { generateSignedURL, generateDownloadURL, isAccessAllowed } from "../helpers/signedURLs.js";
import { normalizeCollectionConfig, getSignedURLConfig } from "../helpers/normalizeConfig.js";
export const createSignedURLEndpoint = (collectionSlug, options)=>({
        path: '/signed-url/:id',
        method: 'get',
        handler: async (req)=>{
            const id = req.routeParams?.id;
            if (!id) {
                return Response.json({
                    error: 'Document ID required'
                }, {
                    status: 400
                });
            }
            try {
                const doc = await req.payload.findByID({
                    collection: collectionSlug,
                    id,
                    req
                });
                if (!doc) {
                    return Response.json({
                        error: 'Document not found'
                    }, {
                        status: 404
                    });
                }
                if (!doc.requiresSignedURL) {
                    return Response.json({
                        error: 'This file does not require signed URLs',
                        url: doc.url
                    }, {
                        status: 400
                    });
                }
                const collectionConfig = options.collections[collectionSlug];
                const rawConfig = typeof collectionConfig === 'boolean' ? {} : collectionConfig;
                const config = normalizeCollectionConfig(rawConfig);
                const signedURLConfig = getSignedURLConfig(config);
                if (!signedURLConfig) {
                    return Response.json({
                        error: 'Signed URLs not configured for this collection'
                    }, {
                        status: 500
                    });
                }
                const hasAccess = await isAccessAllowed(req, doc, signedURLConfig);
                if (!hasAccess) {
                    return Response.json({
                        error: 'Access denied'
                    }, {
                        status: 403
                    });
                }
                let transformations;
                const transformParam = req.query?.transformations;
                if (transformParam) {
                    try {
                        transformations = typeof transformParam === 'string' ? JSON.parse(transformParam) : transformParam;
                    } catch (e) {
                        if (typeof transformParam === 'string') {
                            transformations = {};
                            transformParam.split(',').forEach((pair)=>{
                                const [key, value] = pair.split(':');
                                if (key && value) {
                                    transformations[key.trim()] = isNaN(Number(value)) ? value.trim() : Number(value);
                                }
                            });
                        }
                    }
                }
                const signedUrl = generateSignedURL({
                    publicId: doc.cloudinaryPublicId,
                    version: doc.cloudinaryVersion,
                    resourceType: doc.cloudinaryResourceType,
                    format: doc.cloudinaryFormat,
                    expiresIn: signedURLConfig.expiresIn,
                    transformations
                }, signedURLConfig);
                let downloadUrl;
                if (req.query?.download === 'true') {
                    downloadUrl = generateDownloadURL(doc.cloudinaryPublicId, doc.filename, {
                        version: doc.cloudinaryVersion,
                        resourceType: doc.cloudinaryResourceType,
                        expiresIn: signedURLConfig.expiresIn
                    });
                }
                return Response.json({
                    url: signedUrl,
                    downloadUrl,
                    expiresIn: signedURLConfig.expiresIn || 3600,
                    expiresAt: new Date(Date.now() + (signedURLConfig.expiresIn || 3600) * 1000).toISOString(),
                    transformations
                });
            } catch (error) {
                console.error('Error generating signed URL:', error);
                if (error instanceof Error && (error.message.includes('Authentication required') || error.message.includes('Unauthorized'))) {
                    return Response.json({
                        error: 'Authentication required for private files'
                    }, {
                        status: 403
                    });
                }
                return Response.json({
                    error: 'Failed to generate signed URL'
                }, {
                    status: 500
                });
            }
        }
    });
export const createBatchSignedURLEndpoint = (collectionSlug, options)=>({
        path: '/signed-urls',
        method: 'post',
        handler: async (req)=>{
            const body = await req.json?.();
            const ids = body?.ids;
            const transformations = body?.transformations;
            if (!ids || !Array.isArray(ids)) {
                return Response.json({
                    error: 'Array of document IDs required'
                }, {
                    status: 400
                });
            }
            try {
                const docs = await req.payload.find({
                    collection: collectionSlug,
                    where: {
                        id: {
                            in: ids
                        }
                    },
                    limit: ids.length,
                    req
                });
                const collectionConfig = options.collections[collectionSlug];
                const rawConfig = typeof collectionConfig === 'boolean' ? {} : collectionConfig;
                const config = normalizeCollectionConfig(rawConfig);
                const signedURLConfig = getSignedURLConfig(config);
                if (!signedURLConfig) {
                    return Response.json({
                        error: 'Signed URLs not configured for this collection'
                    }, {
                        status: 500
                    });
                }
                const results = await Promise.all(docs.docs.map(async (doc)=>{
                    if (!doc.requiresSignedURL) {
                        return {
                            id: doc.id,
                            url: doc.url,
                            requiresSignedURL: false
                        };
                    }
                    const hasAccess = await isAccessAllowed(req, doc, signedURLConfig);
                    if (!hasAccess) {
                        return {
                            id: doc.id,
                            error: 'Access denied'
                        };
                    }
                    const signedUrl = generateSignedURL({
                        publicId: doc.cloudinaryPublicId,
                        version: doc.cloudinaryVersion,
                        resourceType: doc.cloudinaryResourceType,
                        format: doc.cloudinaryFormat,
                        expiresIn: signedURLConfig.expiresIn,
                        transformations
                    }, signedURLConfig);
                    return {
                        id: doc.id,
                        url: signedUrl,
                        expiresIn: signedURLConfig.expiresIn || 3600,
                        expiresAt: new Date(Date.now() + (signedURLConfig.expiresIn || 3600) * 1000).toISOString(),
                        transformations
                    };
                }));
                return Response.json({
                    results
                });
            } catch (error) {
                console.error('Error generating batch signed URLs:', error);
                return Response.json({
                    error: 'Failed to generate signed URLs'
                }, {
                    status: 500
                });
            }
        }
    });
