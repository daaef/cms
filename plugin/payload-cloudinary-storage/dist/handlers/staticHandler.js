export const createStaticHandler = (options)=>async (_req, { params, doc })=>{
        try {
            const { filename } = params;
            const data = doc;
            if (data?.cloudinaryUrl) {
                return new Response(null, {
                    status: 302,
                    headers: {
                        Location: data.cloudinaryUrl
                    }
                });
            }
            const resourceType = data?.cloudinaryResourceType || 'image';
            const publicId = data?.cloudinaryPublicId || filename;
            const version = data?.cloudinaryVersion;
            const versionPath = version ? `v${version}/` : '';
            const cloudinaryUrl = `https://res.cloudinary.com/${options.cloudConfig.cloud_name}/${resourceType}/upload/${versionPath}${publicId}`;
            return new Response(null, {
                status: 302,
                headers: {
                    Location: cloudinaryUrl
                }
            });
        } catch (error) {
            return new Response('Not found', {
                status: 404
            });
        }
    };
