import { v2 as cloudinary } from "cloudinary";
import { generateSignedURL } from "../helpers/signedURLs.js";
import { getSignedURLConfig, getTransformationConfig } from "../helpers/normalizeConfig.js";
import { buildWatermarkTransformation, buildImageWatermarkTransformation, buildBlurTransformation } from "../helpers/watermark.js";
export const createAfterChangeHook = (collectionSlug, config)=>async ({ doc, previousDoc, req })=>{
        if (doc.cloudinaryPublicId) {
            req.payload.logger.info({
                msg: 'AfterChange hook triggered',
                collection: collectionSlug,
                cloudinaryPublicId: doc.cloudinaryPublicId,
                hasCloudinaryUrl: !!doc.cloudinaryUrl,
                operation: previousDoc ? 'update' : 'create',
                previousUrl: previousDoc?.url,
                currentUrl: doc.url,
                urlChanged: previousDoc?.url !== doc.url
            });
        }
        const privacyChanged = previousDoc?.isPrivate !== doc.isPrivate;
        const transformConfig = getTransformationConfig(config);
        const presetFieldName = transformConfig.presetFieldName || 'transformationPreset';
        const currentPresets = doc[presetFieldName];
        const previousPresets = previousDoc?.[presetFieldName];
        const presetChanged = JSON.stringify(currentPresets) !== JSON.stringify(previousPresets);
        const publicPreviewFieldName = transformConfig.publicTransformation?.fieldName || 'hasPublicTransformation';
        const publicPreviewChanged = previousDoc?.[publicPreviewFieldName] !== doc[publicPreviewFieldName];
        const watermarkFieldName = transformConfig.publicTransformation?.watermark?.textFieldName || 'watermarkText';
        const watermarkChanged = previousDoc?.[watermarkFieldName] !== doc[watermarkFieldName];
        const typeFieldName = transformConfig.publicTransformation?.typeFieldName || 'transformationType';
        const typeChanged = previousDoc?.[typeFieldName] !== doc[typeFieldName];
        if (!doc.cloudinaryPublicId || !privacyChanged && !presetChanged && !publicPreviewChanged && !watermarkChanged && !typeChanged) {
            return doc;
        }
        req.payload.logger.info({
            msg: 'Updating URLs due to changes',
            collection: collectionSlug,
            cloudinaryPublicId: doc.cloudinaryPublicId,
            changes: {
                privacyChanged,
                presetChanged,
                publicPreviewChanged,
                watermarkChanged,
                typeChanged
            }
        });
        const signedURLConfig = getSignedURLConfig(config);
        if (privacyChanged) {
            if (doc.isPrivate && signedURLConfig) {
                doc.requiresSignedURL = true;
                doc.url = generateSignedURL({
                    publicId: doc.cloudinaryPublicId,
                    version: doc.cloudinaryVersion,
                    resourceType: doc.cloudinaryResourceType,
                    format: doc.cloudinaryFormat,
                    transformations: transformConfig.default
                }, signedURLConfig);
                doc.originalUrl = generateSignedURL({
                    publicId: doc.cloudinaryPublicId,
                    version: doc.cloudinaryVersion,
                    resourceType: doc.cloudinaryResourceType,
                    format: doc.cloudinaryFormat
                }, signedURLConfig);
            } else {
                doc.requiresSignedURL = false;
                if (transformConfig.default && Object.keys(transformConfig.default).length > 0) {
                    doc.url = cloudinary.url(doc.cloudinaryPublicId, {
                        secure: true,
                        version: doc.cloudinaryVersion,
                        resource_type: doc.cloudinaryResourceType,
                        transformation: transformConfig.default
                    });
                } else {
                    doc.url = cloudinary.url(doc.cloudinaryPublicId, {
                        secure: true,
                        version: doc.cloudinaryVersion,
                        resource_type: doc.cloudinaryResourceType
                    });
                }
                doc.originalUrl = cloudinary.url(doc.cloudinaryPublicId, {
                    secure: true,
                    version: doc.cloudinaryVersion,
                    resource_type: doc.cloudinaryResourceType,
                    type: 'upload',
                    format: doc.cloudinaryFormat
                });
            }
        }
        if (transformConfig.preserveOriginal && transformConfig.enablePresetSelection && presetChanged) {
            let combinedTransformations = {};
            if (transformConfig.default) {
                combinedTransformations = {
                    ...transformConfig.default
                };
            }
            if (doc[presetFieldName] && transformConfig.presets) {
                const presetArray = Array.isArray(doc[presetFieldName]) ? doc[presetFieldName] : [
                    doc[presetFieldName]
                ];
                for (const presetName of presetArray){
                    const preset = transformConfig.presets.find((p)=>p.name === presetName);
                    if (preset) {
                        combinedTransformations = {
                            ...combinedTransformations,
                            ...preset.transformations
                        };
                    }
                }
            }
            if (Object.keys(combinedTransformations).length > 0) {
                if (doc.isPrivate && signedURLConfig) {
                    doc.transformedUrl = generateSignedURL({
                        publicId: doc.cloudinaryPublicId,
                        version: doc.cloudinaryVersion,
                        resourceType: doc.cloudinaryResourceType,
                        format: doc.cloudinaryFormat,
                        transformations: combinedTransformations
                    }, signedURLConfig);
                } else {
                    doc.transformedUrl = cloudinary.url(doc.cloudinaryPublicId, {
                        secure: true,
                        version: doc.cloudinaryVersion,
                        resource_type: doc.cloudinaryResourceType || 'image',
                        transformation: combinedTransformations
                    });
                }
            } else {
                doc.transformedUrl = null;
            }
        }
        if (transformConfig.publicTransformation?.enabled && (publicPreviewChanged || watermarkChanged || typeChanged)) {
            const fieldName = transformConfig.publicTransformation.fieldName || 'hasPublicTransformation';
            if (doc[fieldName] === true && doc.isPrivate) {
                req.payload.logger.info({
                    msg: 'Creating permanently transformed public version',
                    collection: collectionSlug,
                    transformationType: doc[typeFieldName] || 'watermark'
                });
                try {
                    if (doc.publicTransformationPublicId) {
                        try {
                            await cloudinary.uploader.destroy(doc.publicTransformationPublicId, {
                                resource_type: doc.cloudinaryResourceType || 'image',
                                invalidate: true
                            });
                            req.payload.logger.info({
                                msg: 'Deleted old public transformation',
                                publicId: doc.publicTransformationPublicId
                            });
                        } catch (error) {
                            req.payload.logger.warn({
                                msg: 'Failed to delete old public transformation',
                                error: error instanceof Error ? error.message : 'Unknown error'
                            });
                        }
                    }
                    let publicTransformation;
                    const typeFieldName = transformConfig.publicTransformation.typeFieldName || 'transformationType';
                    const transformationType = doc[typeFieldName] || 'watermark';
                    if (transformationType === 'watermark' && transformConfig.publicTransformation.watermark) {
                        const watermarkFieldName = transformConfig.publicTransformation.watermark.textFieldName || 'watermarkText';
                        const watermarkText = doc[watermarkFieldName];
                        if (transformConfig.publicTransformation.watermark.imageId) {
                            publicTransformation = buildImageWatermarkTransformation(transformConfig.publicTransformation.watermark);
                        } else {
                            publicTransformation = buildWatermarkTransformation(transformConfig.publicTransformation.watermark, watermarkText);
                        }
                    } else if (transformationType === 'blur') {
                        publicTransformation = buildBlurTransformation(transformConfig.publicTransformation.blur);
                    }
                    const publicTransformationPublicId = `${doc.cloudinaryPublicId}_public_${transformationType}`;
                    const transformedUrl = cloudinary.url(doc.cloudinaryPublicId, {
                        secure: true,
                        transformation: publicTransformation,
                        format: doc.cloudinaryFormat || 'jpg'
                    });
                    const transformedResult = await cloudinary.uploader.upload(transformedUrl, {
                        public_id: publicTransformationPublicId,
                        resource_type: doc.cloudinaryResourceType || 'image',
                        overwrite: true,
                        invalidate: true
                    });
                    if (transformedResult && transformedResult.secure_url) {
                        doc.publicTransformationUrl = transformedResult.secure_url;
                        doc.publicTransformationPublicId = publicTransformationPublicId;
                        doc.previewUrl = transformedResult.secure_url;
                        req.payload.logger.info({
                            msg: 'Public transformation created successfully',
                            publicId: publicTransformationPublicId,
                            url: doc.publicTransformationUrl,
                            previewUrl: doc.previewUrl,
                            docId: doc.id,
                            willReturn: true
                        });
                    }
                } catch (error) {
                    req.payload.logger.error({
                        msg: 'Failed to create public transformation',
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                    doc.publicTransformationUrl = null;
                    doc.publicTransformationPublicId = null;
                    doc.previewUrl = null;
                }
            } else {
                if (doc.publicTransformationPublicId) {
                    try {
                        await cloudinary.uploader.destroy(doc.publicTransformationPublicId, {
                            resource_type: doc.cloudinaryResourceType || 'image',
                            invalidate: true
                        });
                        req.payload.logger.info({
                            msg: 'Deleted public transformation (disabled)',
                            publicId: doc.publicTransformationPublicId
                        });
                    } catch (error) {
                        req.payload.logger.warn({
                            msg: 'Failed to delete public transformation',
                            error: error instanceof Error ? error.message : 'Unknown error'
                        });
                    }
                }
                doc.publicTransformationUrl = null;
                doc.publicTransformationPublicId = null;
                doc.previewUrl = null;
            }
        }
        if (transformConfig.publicTransformation?.enabled && doc.isPrivate && doc[publicPreviewFieldName] === true && (presetChanged || publicPreviewChanged || watermarkChanged || typeChanged) && !doc.previewUrl) {
            const selectedPresets = doc[presetFieldName];
            if (selectedPresets) {
                let previewTransformations = {};
                if (transformConfig.default) {
                    previewTransformations = {
                        ...transformConfig.default
                    };
                }
                if (transformConfig.presets) {
                    const presetArray = Array.isArray(selectedPresets) ? selectedPresets : [
                        selectedPresets
                    ];
                    for (const presetName of presetArray){
                        const preset = transformConfig.presets.find((p)=>p.name === presetName);
                        if (preset) {
                            previewTransformations = {
                                ...previewTransformations,
                                ...preset.transformations
                            };
                        }
                    }
                }
                const transformationType = doc[typeFieldName] || 'watermark';
                let publicTransformation;
                if (transformationType === 'watermark' && transformConfig.publicTransformation.watermark) {
                    const watermarkText = doc[watermarkFieldName];
                    if (transformConfig.publicTransformation.watermark.imageId) {
                        publicTransformation = buildImageWatermarkTransformation(transformConfig.publicTransformation.watermark);
                    } else {
                        publicTransformation = buildWatermarkTransformation(transformConfig.publicTransformation.watermark, watermarkText);
                    }
                } else if (transformationType === 'blur') {
                    publicTransformation = buildBlurTransformation(transformConfig.publicTransformation.blur);
                }
                if (Object.keys(previewTransformations).length > 0 || publicTransformation) {
                    const combinedTransformation = [];
                    if (Object.keys(previewTransformations).length > 0) {
                        combinedTransformation.push(previewTransformations);
                    }
                    if (publicTransformation) {
                        if (Array.isArray(publicTransformation)) {
                            combinedTransformation.push(...publicTransformation);
                        } else {
                            combinedTransformation.push(publicTransformation);
                        }
                    }
                    doc.previewUrl = cloudinary.url(doc.cloudinaryPublicId, {
                        secure: true,
                        version: doc.cloudinaryVersion,
                        resource_type: doc.cloudinaryResourceType || 'image',
                        type: 'upload',
                        transformation: combinedTransformation
                    });
                } else {
                    doc.previewUrl = null;
                }
            }
        }
        if (doc.publicTransformationUrl) {
            req.payload.logger.info({
                msg: 'AfterChange hook returning doc with public transformation',
                publicTransformationUrl: doc.publicTransformationUrl,
                publicTransformationPublicId: doc.publicTransformationPublicId
            });
        }
        return doc;
    };
