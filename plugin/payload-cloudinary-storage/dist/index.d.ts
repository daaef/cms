import type { CloudinaryStorageOptions } from './types.js';
import type { Config } from 'payload';
export declare const cloudinaryStorage: (options: CloudinaryStorageOptions) => (config: Config) => Config;
export type { CloudinaryStorageOptions, CloudinaryCollectionConfig, TransformationPreset, SignedURLConfig, FolderConfig } from './types.js';
export { getTransformationUrl, commonPresets } from './helpers/transformations.js';
export { generateSignedURL, generateDownloadURL, isAccessAllowed } from './helpers/signedURLs.js';
export { getCloudinaryFolders } from './helpers/getCloudinaryFolders.js';
export { fetchSignedURL, fetchSignedURLs, useSignedURL, requiresSignedURL, getImageURL, createPrivateImageComponent } from './helpers/clientHelpers.js';
export { getSignedURL, getSignedURLs, applyTransformationsToUrl, getImageURL as getServerImageURL, getPrivateImageURL, getPublicPreviewURL, getPremiumImageURL } from './helpers/serverHelpers.js';
//# sourceMappingURL=index.d.ts.map