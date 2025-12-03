/**
 * Signed URL Helper Functions
 *
 * SECURITY MODEL:
 * 1. Access control is primarily handled by Payload's collection-level access control
 * 2. When endpoints call req.payload.findByID() or req.payload.find() with the req object,
 *    Payload automatically enforces read access based on the collection's access control config
 * 3. The isAccessAllowed() function is for ADDITIONAL checks beyond Payload's access control
 * 4. Documents that reach isAccessAllowed() have already passed Payload's access checks
 */
import type { SignedURLConfig } from '../types.js';
export interface SignedURLOptions {
    publicId: string;
    version?: number;
    resourceType?: string;
    format?: string;
    transformations?: Record<string, any>;
    expiresIn?: number;
    authToken?: boolean;
    attachmentFilename?: string;
}
export declare function generateSignedURL(options: SignedURLOptions, config?: SignedURLConfig): string;
export declare function generatePrivateUploadOptions(config: SignedURLConfig): Record<string, any>;
export declare function generateDownloadURL(publicId: string, filename: string, options?: {
    expiresIn?: number;
    resourceType?: string;
    version?: number;
}): string;
export declare function isAccessAllowed(req: any, doc: any, config?: SignedURLConfig): Promise<boolean>;
//# sourceMappingURL=signedURLs.d.ts.map