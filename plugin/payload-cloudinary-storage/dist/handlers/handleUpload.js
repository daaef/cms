import { v2 as cloudinary } from "cloudinary";
import { queueManager } from "../queue/queueManager.js";
import { generatePrivateUploadOptions, generateSignedURL } from "../helpers/signedURLs.js";
import { normalizeCollectionConfig, getFolderConfig, getTransformationConfig, getSignedURLConfig } from "../helpers/normalizeConfig.js";
import { buildWatermarkTransformation, buildImageWatermarkTransformation, buildBlurTransformation } from "../helpers/watermark.js";
export const createUploadHandler = (options)=>async ({ collection, file, data })=>{
        console.log('[Cloudinary Upload] Starting upload for collection:', collection.slug);
        console.log('[Cloudinary Upload] File:', file.filename, 'Size:', file.filesize, 'Has buffer:', !!file.buffer);
        console.log('[Cloudinary Upload] Existing cloudinaryPublicId:', data?.cloudinaryPublicId);
        const collectionConfig = options.collections[collection.slug];
        if (!collectionConfig) {
            throw new Error(`Collection ${collection.slug} is not configured for Cloudinary storage`);
        }
        const rawConfig = typeof collectionConfig === 'boolean' ? {} : collectionConfig;
        const config = normalizeCollectionConfig(rawConfig);
        if (!file.buffer) {
            if (data?.cloudinaryPublicId) {
                console.log('[Cloudinary Upload] Skipping upload - no new file provided, keeping existing Cloudinary asset');
                if (!data.url && data.cloudinaryUrl) {
                    data.url = data.cloudinaryUrl;
                }
                data.filename = data.filename || file.filename;
                data.filesize = data.filesize || file.filesize;
                data.mimeType = data.mimeType || file.mimeType;
                return;
            }
            throw new Error('No file buffer provided for upload');
        }
        if (data?.cloudinaryPublicId) {
            console.log('[Cloudinary Upload] Existing file detected with publicId:', data.cloudinaryPublicId);
            console.log('[Cloudinary Upload] Current filename:', file.filename, 'Stored filename:', data.filename);
            console.log('[Cloudinary Upload] Incoming file will overwrite the existing Cloudinary asset.');
        }
        try {
            const uploadOptions = buildUploadOptions(config, file.filename, data);
            console.log('[Cloudinary Upload] Upload options:', JSON.stringify(uploadOptions, null, 2));
            console.log('[Cloudinary Upload] Collection config:', JSON.stringify(config, null, 2));
            if (config.uploadQueue?.enabled) {
                const queue = queueManager.getQueue(collection.slug, config.uploadQueue);
                data.uploadStatus = 'queued';
                data.uploadProgress = 0;
                if (config.uploadQueue.enableChunkedUploads && file.filesize > (config.uploadQueue.largeFileThreshold || 100) * 1024 * 1024) {
                    uploadOptions.chunk_size = (config.uploadQueue.chunkSize || 20) * 1024 * 1024;
                }
                const uploadPromise = new Promise((resolve, reject)=>{
                    queue.addUpload({
                        filename: file.filename,
                        buffer: file.buffer,
                        size: file.filesize,
                        options: uploadOptions,
                        onProgress: (progress)=>{
                            data.uploadProgress = progress;
                            data.uploadStatus = 'uploading';
                        },
                        onComplete: (result)=>{
                            data.uploadStatus = 'completed';
                            data.uploadProgress = 100;
                            resolve(result);
                        },
                        onError: (error)=>{
                            data.uploadStatus = 'failed';
                            reject(error);
                        }
                    });
                });
                const result = await uploadPromise;
                delete data.uploadStatus;
                delete data.uploadProgress;
                return processUploadResult(result, data, file, config);
            }
            const isLargeFile = file.filesize > 100 * 1024 * 1024;
            let result;
            if (isLargeFile) {
                try {
                    const { Readable } = await import("stream");
                    const bufferStream = new Readable();
                    bufferStream.push(file.buffer);
                    bufferStream.push(null);
                    result = await new Promise((resolve, reject)=>{
                        const uploadStream = cloudinary.uploader.upload_large_stream({
                            ...uploadOptions,
                            chunk_size: 20 * 1024 * 1024
                        }, (error, result)=>{
                            if (error) {
                                const errorMsg = error.message || 'Unknown error';
                                if (errorMsg.includes('413') || errorMsg.includes('File size too large')) {
                                    reject(new Error(`File too large. Cloudinary has file size limits based on your plan. Consider upgrading your Cloudinary plan for larger files.`));
                                } else {
                                    reject(error);
                                }
                            } else {
                                resolve(result);
                            }
                        });
                        bufferStream.pipe(uploadStream);
                    });
                } catch (error) {
                    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
                    if (errorMsg.includes('File size too large') || errorMsg.includes('413')) {
                        throw new Error(`File too large for your Cloudinary plan. Free plans typically support up to 100MB for images and 100MB for videos. Paid plans support larger files.`);
                    }
                    throw error;
                }
            } else {
                result = await new Promise((resolve, reject)=>{
                    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result)=>{
                        if (error) {
                            console.error('[Cloudinary Upload] Upload error:', error);
                            const errorMsg = error.message || 'Unknown error';
                            if (errorMsg.includes('File size too large')) {
                                reject(new Error(`File too large for upload. Maximum file size depends on your Cloudinary plan. Error: ${errorMsg}`));
                            } else if (errorMsg.includes('Invalid image file')) {
                                reject(new Error(`Invalid file format. Please check that the file is a valid ${config.resourceType || 'media'} file.`));
                            } else {
                                reject(error);
                            }
                        } else {
                            console.log('[Cloudinary Upload] Upload successful:', result?.public_id);
                            resolve(result);
                        }
                    });
                    uploadStream.end(file.buffer);
                });
            }
            return processUploadResult(result, data, file, config);
        } catch (error) {
            throw new Error(`Failed to upload to Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };
function processUploadResult(result, data, file, config) {
    if (result) {
        data.cloudinaryPublicId = result.public_id;
        data.cloudinaryUrl = result.secure_url;
        data.cloudinaryResourceType = result.resource_type;
        data.cloudinaryFormat = result.format;
        data.cloudinaryVersion = result.version;
        const thumbnailUrl = cloudinary.url(result.public_id, {
            secure: true,
            version: result.version,
            resource_type: result.resource_type || 'image',
            type: result.type || 'upload',
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
        console.log('[Cloudinary Upload] Thumbnail URL:', thumbnailUrl);
        const originalUrl = cloudinary.url(result.public_id, {
            secure: true,
            version: result.version,
            resource_type: result.resource_type || 'image',
            type: result.type || 'upload',
            format: result.format
        });
        data.originalUrl = originalUrl;
        const transformConfig = getTransformationConfig(config);
        data.url = originalUrl;
        data.filename = file.filename;
        data.filesize = result.bytes || file.filesize;
        data.mimeType = file.mimeType;
        if (result.width) data.width = result.width;
        if (result.height) data.height = result.height;
        if (result.folder) {
            data.cloudinaryFolder = result.folder;
        }
        if (config.privateFiles) {
            const signedURLConfig = getSignedURLConfig(config);
            if (data.isPrivate === false) {
                data.requiresSignedURL = false;
            } else {
                data.isPrivate = true;
                data.requiresSignedURL = true;
                if (transformConfig.publicTransformation?.enabled && signedURLConfig) {
                    data.url = generateSignedURL({
                        publicId: result.public_id,
                        version: result.version,
                        resourceType: result.resource_type,
                        format: result.format,
                        transformations: transformConfig.default
                    }, signedURLConfig);
                    data.originalUrl = generateSignedURL({
                        publicId: result.public_id,
                        version: result.version,
                        resourceType: result.resource_type,
                        format: result.format
                    }, signedURLConfig);
                }
            }
        }
        if (transformConfig.publicTransformation?.enabled && data.isPrivate) {
            const fieldName = transformConfig.publicTransformation.fieldName || 'hasPublicTransformation';
            if (data[fieldName] === true) {
                let publicTransformation;
                const typeFieldName = transformConfig.publicTransformation.typeFieldName || 'transformationType';
                const transformationType = data[typeFieldName] || 'watermark';
                if (transformationType === 'watermark' && transformConfig.publicTransformation.watermark) {
                    const watermarkFieldName = transformConfig.publicTransformation.watermark.textFieldName || 'watermarkText';
                    const watermarkText = data[watermarkFieldName];
                    if (transformConfig.publicTransformation.watermark.imageId) {
                        publicTransformation = buildImageWatermarkTransformation(transformConfig.publicTransformation.watermark);
                    } else {
                        publicTransformation = buildWatermarkTransformation(transformConfig.publicTransformation.watermark, watermarkText);
                    }
                } else if (transformationType === 'blur') {
                    publicTransformation = buildBlurTransformation(transformConfig.publicTransformation.blur);
                }
                const publicTransformationUrl = cloudinary.url(result.public_id, {
                    secure: true,
                    version: result.version,
                    resource_type: result.resource_type || 'image',
                    type: 'upload',
                    format: result.format,
                    transformation: publicTransformation
                });
                data.publicTransformationUrl = publicTransformationUrl;
            }
        }
    }
}
function buildUploadOptions(config, _filename, data) {
    const options = {
        resource_type: config.resourceType || 'auto'
    };
    const signedURLConfig = getSignedURLConfig(config);
    const transformConfig = getTransformationConfig(config);
    if (signedURLConfig && data && data.isPrivate !== false && !transformConfig.publicTransformation?.enabled) {
        const privateOptions = generatePrivateUploadOptions(signedURLConfig);
        Object.assign(options, privateOptions);
    }
    const folderConfig = getFolderConfig(config);
    const hasExistingPublicId = typeof data?.cloudinaryPublicId === 'string' && data.cloudinaryPublicId.length > 0;
    let folder;
    if (folderConfig.enableDynamic && data) {
        const folderField = folderConfig.fieldName || 'cloudinaryFolder';
        if (data[folderField]) {
            folder = data[folderField];
        }
        if (folder) {
            folder = folder.trim().replace(/^\/+|\/+$/g, '');
        }
    }
    if (!folder && folderConfig.path) {
        folder = folderConfig.path;
    }
    if (folder && !hasExistingPublicId) {
        options.folder = folder;
    }
    if (config.useFilename !== undefined) {
        options.use_filename = config.useFilename;
    }
    if (config.uniqueFilename !== undefined) {
        options.unique_filename = config.uniqueFilename;
    }
    let transformations = {};
    if (transformConfig.default) {
        transformations = {
            ...transformConfig.default
        };
    }
    if (transformConfig.preserveOriginal) {
        transformations = {};
    } else if (!transformConfig.publicTransformation?.enabled) {
        if (transformConfig.enablePresetSelection && data) {
            const presetField = transformConfig.presetFieldName || 'transformationPreset';
            const selectedPreset = data[presetField];
            if (selectedPreset && transformConfig.presets) {
                const preset = transformConfig.presets.find((p)=>p.name === selectedPreset);
                if (preset) {
                    transformations = {
                        ...transformations,
                        ...preset.transformations
                    };
                }
            }
        }
        if (Object.keys(transformations).length > 0) {
            options.transformation = transformations;
        }
    }
    if (hasExistingPublicId) {
        options.public_id = data.cloudinaryPublicId;
        options.invalidate = true;
        options.overwrite = true;
    }
    return options;
}
