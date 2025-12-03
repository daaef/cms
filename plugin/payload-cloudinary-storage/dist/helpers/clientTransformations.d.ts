/**
 * Client-safe transformation utilities
 * These functions build Cloudinary URLs without importing the cloudinary package
 */
import type { TransformationPreset } from '../types.js';
export interface TransformOptions {
    publicId: string;
    version?: number;
    presetName?: string;
    presets?: TransformationPreset[];
    customTransformations?: Record<string, any>;
    cloudName?: string;
}
/**
 * Build a Cloudinary URL without using the cloudinary package
 * Safe for use in client components
 */
export declare function getTransformationUrl(options: TransformOptions): string;
export declare const commonPresets: TransformationPreset[];
//# sourceMappingURL=clientTransformations.d.ts.map