export async function fetchSignedURL(collection, docId, options) {
    const baseUrl = options?.baseUrl || '';
    let url = `${baseUrl}/api/${collection}/signed-url/${docId}`;
    if (options?.transformations) {
        const params = new URLSearchParams();
        params.set('transformations', JSON.stringify(options.transformations));
        url += `?${params.toString()}`;
    }
    const headers = {
        'Content-Type': 'application/json',
        ...options?.headers || {}
    };
    if (options?.token) {
        headers['Authorization'] = `JWT ${options.token}`;
    }
    const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: options?.credentials || 'same-origin'
    });
    if (!response.ok) {
        const errorData = await response.json().catch(()=>({
                message: 'Failed to fetch signed URL'
            }));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch signed URL`);
    }
    const data = await response.json();
    return data.url;
}
export async function fetchSignedURLs(collection, docIds, options) {
    const baseUrl = options?.baseUrl || '';
    const url = `${baseUrl}/api/${collection}/signed-urls`;
    const headers = {
        'Content-Type': 'application/json',
        ...options?.headers || {}
    };
    if (options?.token) {
        headers['Authorization'] = `JWT ${options.token}`;
    }
    const response = await fetch(url, {
        method: 'POST',
        headers,
        credentials: options?.credentials || 'same-origin',
        body: JSON.stringify({
            ids: docIds,
            transformations: options?.transformations
        })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(()=>({
                message: 'Failed to fetch signed URLs'
            }));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch signed URLs`);
    }
    const data = await response.json();
    const urlMap = {};
    if (data.results) {
        data.results.forEach((result)=>{
            if (result.url && !result.error) {
                urlMap[result.id] = result.url;
            }
        });
    }
    return urlMap;
}
export function useSignedURL(collection, docId, options) {
    if (typeof window === 'undefined') {
        return {
            url: null,
            loading: true,
            error: null
        };
    }
    const React = options?.react || window.React;
    if (!React) {
        throw new Error('React is not available. Please ensure React is loaded or pass it via options.react');
    }
    const [url, setUrl] = React.useState(null);
    const [loading, setLoading] = React.useState(!!docId);
    const [error, setError] = React.useState(null);
    React.useEffect(()=>{
        if (!docId) {
            setUrl(null);
            setLoading(false);
            return;
        }
        let timeoutId;
        const fetchUrl = async ()=>{
            setLoading(true);
            setError(null);
            try {
                const signedUrl = await fetchSignedURL(collection, docId, {
                    ...options?.fetchOptions,
                    transformations: options?.transformations
                });
                setUrl(signedUrl);
                const refetchBuffer = (options?.refetchBuffer || 300) * 1000;
                const expiryTime = 3600 * 1000;
                const refetchDelay = Math.max(expiryTime - refetchBuffer, 60000);
                timeoutId = setTimeout(fetchUrl, refetchDelay);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch signed URL'));
                setUrl(null);
            } finally{
                setLoading(false);
            }
        };
        fetchUrl();
        return ()=>{
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [
        collection,
        docId
    ]);
    return {
        url,
        loading,
        error
    };
}
export function requiresSignedURL(doc) {
    return doc?.requiresSignedURL === true || doc?.isPrivate === true;
}
function extractTransformationsFromUrl(url) {
    if (!url) return undefined;
    const match = url.match(/\/upload\/([^\/]+)\/v\d+/);
    if (!match || !match[1]) return undefined;
    const transformString = match[1];
    const transformations = {};
    const parts = transformString.split(',');
    for (const part of parts){
        if (part === 'f_auto') {
            transformations.fetch_format = 'auto';
            continue;
        }
        if (part === 'q_auto') {
            transformations.quality = 'auto';
            continue;
        }
        if (part.startsWith('q_auto:')) {
            transformations.quality = part.replace('q_', '');
            continue;
        }
        if (part.startsWith('e_') && part.includes(':')) {
            transformations.effect = part.replace('e_', '');
            continue;
        }
        const underscoreIndex = part.indexOf('_');
        if (underscoreIndex === -1) continue;
        const key = part.substring(0, underscoreIndex);
        const value = part.substring(underscoreIndex + 1);
        if (key && value) {
            switch(key){
                case 'w':
                    transformations.width = isNaN(Number(value)) ? value : Number(value);
                    break;
                case 'h':
                    transformations.height = isNaN(Number(value)) ? value : Number(value);
                    break;
                case 'c':
                    transformations.crop = value;
                    break;
                case 'q':
                    transformations.quality = value;
                    break;
                case 'f':
                    transformations.fetch_format = value;
                    break;
                case 'g':
                    transformations.gravity = value;
                    break;
                case 'dpr':
                    transformations.dpr = value;
                    break;
                case 'e':
                    transformations.effect = value;
                    break;
                case 'r':
                    transformations.radius = value;
                    break;
                case 'a':
                    transformations.angle = value;
                    break;
                case 'o':
                    transformations.opacity = value;
                    break;
                case 'bo':
                    transformations.border = value;
                    break;
                case 'b':
                    transformations.background = value;
                    break;
                case 'l':
                    transformations.overlay = value;
                    break;
                case 'u':
                    transformations.underlay = value;
                    break;
                default:
                    transformations[key] = value;
            }
        }
    }
    return Object.keys(transformations).length > 0 ? transformations : undefined;
}
export async function getImageURL(doc, collection, options) {
    if (requiresSignedURL(doc)) {
        return fetchSignedURL(collection, doc.id, options);
    }
    const baseUrl = doc.url || doc.cloudinaryUrl || '';
    if (options?.transformations && baseUrl) {
        const urlParts = baseUrl.split('/upload/');
        if (urlParts.length === 2) {
            const transformString = Object.entries(options.transformations).map(([key, value])=>`${key}_${value}`).join(',');
            return `${urlParts[0]}/upload/${transformString}/${urlParts[1]}`;
        }
    }
    return baseUrl;
}
export function createPrivateImageComponent(React) {
    return function PrivateImage({ doc, collection, alt, className, fallback, includeTransformations = false, includePublicPreview = true, showViewButton = true, viewButtonText = 'View Full Image', viewButtonClassName = 'absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white' }) {
        if (!doc) {
            return null;
        }
        const [showPrivate, setShowPrivate] = React.useState(false);
        const needsSignedUrl = requiresSignedURL(doc);
        if (!needsSignedUrl) {
            const publicUrl = includeTransformations && doc?.transformedUrl ? doc.transformedUrl : doc?.url || doc?.cloudinaryUrl;
            return React.createElement('img', {
                src: publicUrl,
                alt: alt || doc?.alt || '',
                className: className,
                width: doc?.width,
                height: doc?.height
            });
        }
        let transformations;
        if (includeTransformations && doc?.transformedUrl) {
            transformations = extractTransformationsFromUrl(doc.transformedUrl);
        }
        const { url: signedUrl, loading, error } = useSignedURL(collection, showPrivate ? doc?.id : null, {
            react: React,
            transformations
        });
        const privateUrl = signedUrl;
        const publicPreviewUrl = includeTransformations && doc?.previewUrl ? doc.previewUrl : doc?.publicTransformationURL || doc?.thumbnailURL;
        if (!showPrivate && includePublicPreview && publicPreviewUrl) {
            return React.createElement('div', {
                className: 'relative'
            }, [
                React.createElement('img', {
                    key: 'preview',
                    src: publicPreviewUrl,
                    alt: alt || doc?.alt || '',
                    className: className,
                    width: doc?.width,
                    height: doc?.height
                }),
                showViewButton && React.createElement('button', {
                    key: 'button',
                    onClick: ()=>setShowPrivate(true),
                    className: viewButtonClassName,
                    children: viewButtonText
                })
            ]);
        }
        if (loading && showPrivate) {
            return fallback || React.createElement('div', {
                className
            }, 'Loading...');
        }
        if (error && showPrivate) {
            return React.createElement('div', {
                className
            }, `Error: ${error.message}`);
        }
        if (!privateUrl && showPrivate) {
            return React.createElement('div', {
                className
            }, 'Image not available');
        }
        if (showPrivate && privateUrl) {
            return React.createElement('img', {
                src: privateUrl,
                alt: alt || doc?.alt || '',
                className: className,
                width: doc?.width,
                height: doc?.height
            });
        }
        return null;
    };
}
export function createPremiumImageComponent(React) {
    return function PremiumImage({ doc, collection, isAuthenticated = false, alt, className, fallback, includeTransformations = true, loadingComponent, errorComponent, unauthorizedComponent, unauthorizedMessage = 'Please log in to view full quality', showUpgradePrompt = true, onUpgradeClick }) {
        if (!doc) {
            return null;
        }
        const needsSignedUrl = requiresSignedURL(doc);
        if (!needsSignedUrl) {
            const url = includeTransformations && doc?.transformedUrl ? doc.transformedUrl : doc?.url || doc?.cloudinaryUrl;
            return React.createElement('img', {
                src: url,
                alt: alt || doc?.alt || '',
                className: className,
                width: doc?.width,
                height: doc?.height
            });
        }
        if (!isAuthenticated) {
            const previewUrl = includeTransformations && doc?.previewUrl ? doc.previewUrl : doc?.publicTransformationURL || doc?.thumbnailURL;
            if (previewUrl) {
                return React.createElement('div', {
                    className: 'relative'
                }, [
                    React.createElement('img', {
                        key: 'preview',
                        src: previewUrl,
                        alt: alt || doc?.alt || '',
                        className: className,
                        width: doc?.width,
                        height: doc?.height
                    }),
                    showUpgradePrompt && React.createElement('div', {
                        key: 'overlay',
                        className: 'absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'
                    }, unauthorizedComponent || React.createElement('div', {
                        className: 'text-center text-white p-4'
                    }, [
                        React.createElement('p', {
                            key: 'message',
                            className: 'mb-2'
                        }, unauthorizedMessage),
                        onUpgradeClick && React.createElement('button', {
                            key: 'button',
                            onClick: onUpgradeClick,
                            className: 'px-4 py-2 bg-white text-black rounded hover:bg-gray-100'
                        }, 'Upgrade to Premium')
                    ]))
                ]);
            }
            return unauthorizedComponent || React.createElement('div', {
                className: className || 'bg-gray-200 flex items-center justify-center p-8'
            }, unauthorizedMessage);
        }
        let transformations;
        if (includeTransformations && doc?.transformedUrl) {
            transformations = extractTransformationsFromUrl(doc.transformedUrl);
        }
        const { url: signedUrl, loading, error } = useSignedURL(collection, doc?.id, {
            react: React,
            transformations
        });
        if (loading) {
            return loadingComponent || fallback || React.createElement('div', {
                className
            }, 'Loading premium content...');
        }
        if (error) {
            return errorComponent || React.createElement('div', {
                className
            }, `Error: ${error.message}`);
        }
        const finalUrl = signedUrl;
        if (!finalUrl) {
            return React.createElement('div', {
                className
            }, 'Image not available');
        }
        return React.createElement('img', {
            src: finalUrl,
            alt: alt || doc?.alt || '',
            className: className,
            width: doc?.width,
            height: doc?.height
        });
    };
}
