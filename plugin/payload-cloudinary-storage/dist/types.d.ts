import type { Config } from 'payload';
import type { ConfigOptions } from 'cloudinary';
export interface TransformationPreset {
    name: string;
    label: string;
    transformations: Record<string, any>;
    description?: string;
    category?: 'size' | 'effect' | 'optimization' | 'social' | 'aspect-ratio';
}
export interface FolderConfig {
    path?: string;
    enableDynamic?: boolean;
    fieldName?: string;
    skipFieldCreation?: boolean;
}
export interface TransformationConfig {
    default?: Record<string, any>;
    presets?: TransformationPreset[];
    enablePresetSelection?: boolean;
    presetFieldName?: string;
    preserveOriginal?: boolean;
    publicTransformation?: {
        enabled?: boolean;
        fieldName?: string;
        typeFieldName?: string;
        watermark?: {
            textFieldName?: string;
            defaultText?: string;
            imageId?: string;
            style?: {
                fontFamily?: string;
                fontSize?: number;
                fontWeight?: string;
                letterSpacing?: number;
                color?: string;
                opacity?: number;
                angle?: number;
                position?: string;
            };
        };
        blur?: {
            effect?: string;
            quality?: number;
            width?: number;
            height?: number;
        };
    };
}
export interface UploadQueueConfig {
    enabled?: boolean;
    maxConcurrentUploads?: number;
    chunkSize?: number;
    enableChunkedUploads?: boolean;
    largeFileThreshold?: number;
}
export interface SignedURLConfig {
    enabled: boolean;
    expiresIn?: number;
    authTypes?: Array<'upload' | 'authenticated'>;
    includeTransformations?: boolean;
    /**
     * Custom authentication check for signed URLs.
     * This runs AFTER Payload's collection-level access control.
     * The document has already passed read access checks when this is called.
     * Use this for additional business logic beyond standard access control.
     * @param req - The request object with user information
     * @param doc - The document that passed Payload's access control
     * @returns Whether to allow generating a signed URL
     */
    customAuthCheck?: (req: any, doc: any) => boolean | Promise<boolean>;
}
export interface CloudinaryCollectionConfig {
    useFilename?: boolean;
    uniqueFilename?: boolean;
    resourceType?: 'image' | 'video' | 'raw' | 'auto';
    folder?: FolderConfig | string;
    transformations?: TransformationConfig | Record<string, any>;
    uploadQueue?: UploadQueueConfig;
    privateFiles?: boolean | SignedURLConfig;
    deleteFromCloudinary?: boolean;
    enableDynamicFolders?: boolean;
    folderField?: string;
    signedURLs?: SignedURLConfig;
}
export interface CloudinaryStorageOptions {
    cloudConfig: ConfigOptions;
    collections: {
        [collectionSlug: string]: boolean | CloudinaryCollectionConfig;
    };
}
export type CloudinaryStoragePlugin = (options: CloudinaryStorageOptions) => (config: Config) => Config;
//# sourceMappingURL=types.d.ts.map