import type { CloudinaryCollectionConfig, FolderConfig, TransformationConfig, SignedURLConfig } from '../types.js';
/**
 * Normalizes the collection configuration to handle both legacy and new formats
 */
export declare function normalizeCollectionConfig(config: CloudinaryCollectionConfig): CloudinaryCollectionConfig;
/**
 * Helper to get folder configuration
 */
export declare function getFolderConfig(config: CloudinaryCollectionConfig): FolderConfig;
/**
 * Helper to get transformation configuration
 */
export declare function getTransformationConfig(config: CloudinaryCollectionConfig): TransformationConfig;
/**
 * Helper to get signed URL configuration
 */
export declare function getSignedURLConfig(config: CloudinaryCollectionConfig): SignedURLConfig | undefined;
//# sourceMappingURL=normalizeConfig.d.ts.map