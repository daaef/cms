export function buildBlurTransformation(blurConfig) {
    return {
        effect: blurConfig?.effect || 'blur:2000',
        quality: blurConfig?.quality || 30,
        width: blurConfig?.width || 600,
        height: blurConfig?.height || 600,
        crop: 'limit'
    };
}
export function buildWatermarkTransformation(watermarkConfig, watermarkText) {
    if (!watermarkConfig) {
        return [];
    }
    const text = watermarkText || watermarkConfig.defaultText || 'WATERMARK';
    const style = watermarkConfig.style || {};
    const transformations = [
        {
            crop: 'scale',
            width: 800
        },
        {
            color: style.color || 'rgb:808080',
            overlay: {
                font_family: style.fontFamily || 'Verdana',
                font_size: style.fontSize || 50,
                font_weight: style.fontWeight || 'bold',
                letter_spacing: style.letterSpacing || 15,
                text: text
            },
            angle: style.angle !== undefined ? style.angle : -45,
            opacity: style.opacity !== undefined ? style.opacity : 50,
            effect: 'anti_removal',
            flags: [
                'layer_apply',
                'tiled'
            ],
            gravity: style.position || 'center'
        }
    ];
    return transformations;
}
export function buildImageWatermarkTransformation(watermarkConfig) {
    if (!watermarkConfig || !watermarkConfig.imageId) {
        return [];
    }
    const style = watermarkConfig.style || {};
    const transformations = [
        {
            overlay: watermarkConfig.imageId,
            gravity: style.position || 'south_east',
            opacity: style.opacity !== undefined ? style.opacity : 50,
            width: 200,
            flags: [
                'layer_apply'
            ]
        }
    ];
    return transformations;
}
