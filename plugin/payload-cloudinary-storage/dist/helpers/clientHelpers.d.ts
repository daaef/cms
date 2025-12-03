interface ReactLike {
    useState: <T>(initial: T | (() => T)) => [T, (value: T) => void];
    useEffect: (effect: () => void | (() => void), deps?: any[]) => void;
}
/**
 * Client-side helper to fetch a signed URL for a private image
 * @param collection - The collection slug (e.g., 'media', 'documents')
 * @param docId - The document ID
 * @param options - Optional configuration
 * @returns Promise resolving to the signed Cloudinary URL
 */
export declare function fetchSignedURL(collection: string, docId: string, options?: {
    /** Custom API base URL (defaults to current origin) */
    baseUrl?: string;
    /** Include credentials in the request (defaults to 'same-origin') */
    credentials?: RequestCredentials;
    /** Additional headers to include */
    headers?: Record<string, string>;
    /** JWT token for authentication (if not using cookies) */
    token?: string;
    /** Cloudinary transformations to apply */
    transformations?: Record<string, any>;
}): Promise<string>;
/**
 * Batch fetch multiple signed URLs for private images
 * @param collection - The collection slug
 * @param docIds - Array of document IDs
 * @param options - Optional configuration
 * @returns Promise resolving to a map of docId to signed URL
 */
export declare function fetchSignedURLs(collection: string, docIds: string[], options?: {
    baseUrl?: string;
    credentials?: RequestCredentials;
    headers?: Record<string, string>;
    token?: string;
    /** Cloudinary transformations to apply to all URLs */
    transformations?: Record<string, any>;
}): Promise<Record<string, string>>;
/**
 * React hook for fetching a signed URL with automatic refetch before expiry
 * Note: This hook requires React to be available in the global scope
 *
 * @example
 * ```tsx
 * import { useSignedURL } from 'payload-storage-cloudinary'
 *
 * function MyComponent({ doc }) {
 *   const { url, loading, error } = useSignedURL('media', doc.id)
 *   // ...
 * }
 * ```
 */
export declare function useSignedURL(collection: string, docId: string | null | undefined, options?: {
    /** Refetch buffer in seconds before URL expires (default: 300 = 5 minutes) */
    refetchBuffer?: number;
    /** Other fetch options */
    fetchOptions?: Parameters<typeof fetchSignedURL>[2];
    /** React instance (optional, defaults to window.React) */
    react?: ReactLike;
    /** Cloudinary transformations to apply */
    transformations?: Record<string, any>;
}): {
    url: string | null;
    loading: boolean;
    error: Error | null;
};
/**
 * Helper to determine if a document requires a signed URL
 */
export declare function requiresSignedURL(doc: any): boolean;
/**
 * Get the appropriate image URL (signed or regular)
 * @param doc - The document object
 * @param collection - The collection slug
 * @param options - Fetch options
 * @returns Promise resolving to the appropriate URL
 */
export declare function getImageURL(doc: any, collection: string, options?: Parameters<typeof fetchSignedURL>[2]): Promise<string>;
/**
 * Creates a PrivateImage React component
 * A one-stop shop for handling private images with all their URLs
 *
 * @example
 * ```tsx
 * import React from 'react'
 * import { createPrivateImageComponent } from 'payload-storage-cloudinary/client'
 *
 * const PrivateImage = createPrivateImageComponent(React)
 *
 * // Use in your app
 * <PrivateImage doc={doc} collection="media" />
 * ```
 */
export declare function createPrivateImageComponent(React: any): ({ doc, collection, alt, className, fallback, includeTransformations, includePublicPreview, showViewButton, viewButtonText, viewButtonClassName }: {
    doc: any;
    collection: string;
    alt?: string;
    className?: string;
    fallback?: any;
    /** Use the document's transformedUrl instead of url */
    includeTransformations?: boolean;
    /** Show public preview for private files */
    includePublicPreview?: boolean;
    /** Show view button on public preview */
    showViewButton?: boolean;
    /** Text for the view button */
    viewButtonText?: string;
    /** Custom class for view button */
    viewButtonClassName?: string;
}) => any;
/**
 * Creates a PremiumImage React component
 * Handles authentication flow with automatic fallback to public preview
 *
 * @example
 * ```tsx
 * const PremiumImage = createPremiumImageComponent(React)
 *
 * <PremiumImage
 *   doc={doc}
 *   collection="media"
 *   isAuthenticated={!!user}
 * />
 * ```
 */
export declare function createPremiumImageComponent(React: any): ({ doc, collection, isAuthenticated, alt, className, fallback, includeTransformations, loadingComponent, errorComponent, unauthorizedComponent, unauthorizedMessage, showUpgradePrompt, onUpgradeClick }: {
    doc: any;
    collection: string;
    /** Whether the user is authenticated */
    isAuthenticated?: boolean;
    alt?: string;
    className?: string;
    fallback?: any;
    /** Use transformed URLs when available */
    includeTransformations?: boolean;
    /** Custom loading component */
    loadingComponent?: any;
    /** Custom error component */
    errorComponent?: any;
    /** Custom unauthorized component */
    unauthorizedComponent?: any;
    /** Message for unauthorized users */
    unauthorizedMessage?: string;
    /** Show upgrade prompt on preview */
    showUpgradePrompt?: boolean;
    /** Callback when upgrade is clicked */
    onUpgradeClick?: () => void;
}) => any;
export {};
//# sourceMappingURL=clientHelpers.d.ts.map