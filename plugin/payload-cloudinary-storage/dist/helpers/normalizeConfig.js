export function normalizeCollectionConfig(config) {
    const normalized = {
        ...config
    };
    if (typeof config.folder === 'string' || config.enableDynamicFolders || config.folderField) {
        const folderConfig = {};
        if (typeof config.folder === 'string') {
            folderConfig.path = config.folder;
        } else if (typeof config.folder === 'object') {
            Object.assign(folderConfig, config.folder);
        }
        if (config.enableDynamicFolders !== undefined) {
            folderConfig.enableDynamic = config.enableDynamicFolders;
        }
        if (config.folderField !== undefined) {
            folderConfig.fieldName = config.folderField;
        }
        normalized.folder = folderConfig;
    }
    if (config.transformations) {
        const transformConfig = {};
        if (config.transformations && typeof config.transformations === 'object' && !('default' in config.transformations)) {
            transformConfig.default = config.transformations;
        } else if (config.transformations && typeof config.transformations === 'object') {
            Object.assign(transformConfig, config.transformations);
        }
        normalized.transformations = transformConfig;
    }
    if (config.signedURLs) {
        normalized.privateFiles = config.signedURLs;
        delete normalized.signedURLs;
    } else if (config.privateFiles === true) {
        normalized.privateFiles = {
            enabled: true,
            expiresIn: 3600
        };
    }
    return normalized;
}
export function getFolderConfig(config) {
    if (typeof config.folder === 'string') {
        return {
            path: config.folder
        };
    }
    return config.folder || {};
}
export function getTransformationConfig(config) {
    if (config.transformations && typeof config.transformations === 'object' && !('default' in config.transformations)) {
        return {
            default: config.transformations
        };
    }
    return config.transformations || {};
}
export function getSignedURLConfig(config) {
    if (config.privateFiles && typeof config.privateFiles === 'object') {
        return config.privateFiles;
    }
    return undefined;
}
