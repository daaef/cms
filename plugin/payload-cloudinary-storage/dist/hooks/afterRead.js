import { v2 as cloudinary } from "cloudinary";
import { getTransformationConfig, getSignedURLConfig } from "../helpers/normalizeConfig.js";
import { generateSignedURL } from "../helpers/signedURLs.js";
import { buildWatermarkTransformation, buildImageWatermarkTransformation, buildBlurTransformation } from "../helpers/watermark.js";
export const createAfterReadHook = (_collectionSlug, config)=>async ({ doc })=>{
        if (!doc || !doc.cloudinaryPublicId) {
            return doc;
        }
        const transformConfig = getTransformationConfig(config);
        const signedURLConfig = getSignedURLConfig(config);
        if (transformConfig.preserveOriginal && transformConfig.enablePresetSelection) {
            const presetField = transformConfig.presetFieldName || 'transformationPreset';
            const selectedPresets = doc[presetField];
            let combinedTransformations = {};
            if (transformConfig.default) {
                combinedTransformations = {
                    ...transformConfig.default
                };
            }
            if (selectedPresets && transformConfig.presets) {
                const presetArray = Array.isArray(selectedPresets) ? selectedPresets : [
                    selectedPresets
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
        if (transformConfig.publicTransformation?.enabled && doc.isPrivate && doc[transformConfig.publicTransformation.fieldName || 'hasPublicTransformation'] === true) {
            const presetField = transformConfig.presetFieldName || 'transformationPreset';
            const selectedPresets = doc[presetField];
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
                const typeFieldName = transformConfig.publicTransformation.typeFieldName || 'transformationType';
                const transformationType = doc[typeFieldName] || 'watermark';
                let publicTransformation;
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
                }
            }
        }
        return doc;
    };
