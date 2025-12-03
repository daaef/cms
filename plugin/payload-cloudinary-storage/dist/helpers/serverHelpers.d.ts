/**
 * Server-side helpers for generating signed URLs
 * These functions can be used in server components, API routes, and Node.js environments
 */
import type { Payload } from 'payload';
export interface ServerSignedURLOptions {
    /** The Payload instance */
    payload: Payload;
    /** The collection slug */
    collection: string;
    /** The document ID */
    docId: string;
    /** Optional user for access control */
    user?: any;
    /** Cloudinary transformations to apply */
    transformations?: Record<string, any>;
    /** Plugin options (from your cloudinaryStorage config) */
    pluginOptions?: any;
}
/**
 * Server-side function to generate a signed URL with transformations
 * Use this in server components, API routes, or Node.js environments
 */
export declare function getSignedURL({ payload, collection, docId, user, transformations, pluginOptions, }: ServerSignedURLOptions): Promise<string | null>;
/**
 * Batch generate signed URLs on the server
 */
export declare function getSignedURLs({ payload, collection, docIds, user, transformations, pluginOptions, }: Omit<ServerSignedURLOptions, 'docId'> & {
    docIds: string[];
}): Promise<Record<string, string | null>>;
/**
 * Apply transformations to a Cloudinary URL
 * Works with both authenticated and public URLs
 */
export declare function applyTransformationsToUrl(url: string, transformations: Record<string, any>): string;
/**
 * Check if a document requires a signed URL
 * Helper for server-side rendering decisions
 */
export declare function requiresSignedURL(doc: any): boolean;
/**
 * Server-side helper to get the appropriate image URL
 * Handles both public and private files with optional transformations
 */
export declare function getImageURL(doc: any, options?: {
    payload?: Payload;
    collection?: string;
    user?: any;
    transformations?: Record<string, any>;
    pluginOptions?: any;
}): Promise<string | null>;
/**
 * Server-side helper to get the appropriate private image URL
 * Mirrors the client-side PrivateImage component logic
 */
export declare function getPrivateImageURL(doc: any, options: {
    payload: Payload;
    collection: string;
    user?: any;
    includeTransformations?: boolean;
    pluginOptions?: any;
}): Promise<string | null>;
/**
 * Server-side helper to get public preview URL
 */
export declare function getPublicPreviewURL(doc: any, includeTransformations?: boolean): string | null;
/**
 * Server-side helper for premium image logic
 * Returns appropriate URL based on authentication status
 */
export declare function getPremiumImageURL(doc: any, options: {
    payload: Payload;
    collection: string;
    user?: any;
    isAuthenticated: boolean;
    includeTransformations?: boolean;
    pluginOptions?: any;
}): Promise<{
    url: string | null;
    isPreview: boolean;
    requiresAuth: boolean;
}>;
//# sourceMappingURL=serverHelpers.d.ts.map