import { v2 as cloudinary } from "cloudinary";
import { createHmac } from "crypto";
export function generateSignedURL(options, config) {
    const { publicId, version, resourceType = 'image', format, transformations, expiresIn = config?.expiresIn || 3600, authToken = true, attachmentFilename } = options;
    const timestamp = Math.round(Date.now() / 1000);
    const expiresAt = timestamp + expiresIn;
    const urlOptions = {
        secure: true,
        sign_url: true,
        type: 'upload',
        expires_at: expiresAt
    };
    if (version) {
        urlOptions.version = version;
    }
    if (transformations && config?.includeTransformations !== false) {
        urlOptions.transformation = transformations;
    }
    if (attachmentFilename) {
        urlOptions.attachment = attachmentFilename;
    }
    if (authToken) {
        const apiKey = cloudinary.config().api_key;
        if (!apiKey) {
            throw new Error('Cloudinary API key is required for auth tokens');
        }
        const authTokenOptions = {
            key: apiKey,
            duration: expiresIn,
            acl: `/${resourceType}/*/${publicId}`,
            start_time: timestamp
        };
        urlOptions.auth_token = generateAuthToken(authTokenOptions);
    }
    const resourceIdentifier = format ? `${publicId}.${format}` : publicId;
    return cloudinary.url(resourceIdentifier, urlOptions);
}
function generateAuthToken(options) {
    const { key, duration, acl, start_time } = options;
    const secret = cloudinary.config().api_secret;
    if (!secret) {
        throw new Error('Cloudinary API secret is required for auth tokens');
    }
    const auth = {
        timestamp: start_time,
        duration,
        acl
    };
    const authString = Object.entries(auth).map(([k, v])=>`${k}=${v}`).join('&');
    const signature = createHmac('sha256', secret).update(authString).digest('hex');
    return {
        ...auth,
        signature,
        key
    };
}
export function generatePrivateUploadOptions(config) {
    const options = {
        type: 'authenticated',
        access_mode: 'authenticated'
    };
    if (config.authTypes && config.authTypes.length > 0) {
        options.access_type = config.authTypes.join(',');
    }
    return options;
}
export function generateDownloadURL(publicId, filename, options) {
    return generateSignedURL({
        publicId,
        resourceType: options?.resourceType,
        version: options?.version,
        attachmentFilename: filename,
        expiresIn: options?.expiresIn
    });
}
export async function isAccessAllowed(req, doc, config) {
    if (config?.customAuthCheck) {
        return config.customAuthCheck(req, doc);
    }
    return true;
}
