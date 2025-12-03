import type { TransformationPreset } from '../types.js';
export interface TransformOptions {
    publicId: string;
    version?: number;
    presetName?: string;
    presets?: TransformationPreset[];
    customTransformations?: Record<string, any>;
}
export declare function getTransformationUrl(options: TransformOptions): string;
export declare const commonPresets: TransformationPreset[];
//# sourceMappingURL=transformations.d.ts.map