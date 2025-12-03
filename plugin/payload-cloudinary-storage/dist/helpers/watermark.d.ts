import type { TransformationConfig } from '../types.js';
export declare function buildBlurTransformation(blurConfig?: NonNullable<TransformationConfig['publicTransformation']>['blur']): Record<string, any>;
export declare function buildWatermarkTransformation(watermarkConfig: NonNullable<TransformationConfig['publicTransformation']>['watermark'], watermarkText?: string): any[];
export declare function buildImageWatermarkTransformation(watermarkConfig: NonNullable<TransformationConfig['publicTransformation']>['watermark']): any[];
//# sourceMappingURL=watermark.d.ts.map