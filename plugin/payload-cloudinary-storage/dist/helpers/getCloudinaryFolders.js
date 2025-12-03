import { v2 as cloudinary } from "cloudinary";
let cachedFolders = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000;
async function getAllCloudinaryFolders() {
    try {
        const result = await cloudinary.api.root_folders();
        return result.folders;
    } catch (error) {
        console.error('Error fetching root folders:', error);
        throw error;
    }
}
async function getSubfolders(folderPath) {
    try {
        const result = await cloudinary.api.sub_folders(folderPath);
        return result.folders;
    } catch (error) {
        console.error(`Error fetching subfolders for ${folderPath}:`, error);
        throw error;
    }
}
async function getAllFoldersRecursively(path = '', depth = 0) {
    const allFolders = [];
    try {
        const folders = path === '' ? await getAllCloudinaryFolders() : await getSubfolders(path);
        for (const folder of folders){
            const indent = '  '.repeat(depth);
            const icon = depth > 0 ? '└─ ' : '';
            const displayName = depth > 0 ? folder.path : folder.name;
            allFolders.push({
                label: `${indent}${icon}${displayName}`,
                value: folder.path
            });
            const subfolders = await getAllFoldersRecursively(folder.path, depth + 1);
            allFolders.push(...subfolders);
        }
    } catch (error) {
        console.error(`Error fetching folders for path "${path}":`, error);
    }
    return allFolders;
}
export async function getCloudinaryFolders(useCache = true) {
    const now = Date.now();
    if (useCache && cachedFolders && now - cacheTimestamp < CACHE_DURATION) {
        return cachedFolders;
    }
    const rootFolder = {
        label: '/ (root)',
        value: ''
    };
    try {
        const folders = [
            rootFolder,
            ...await getAllFoldersRecursively()
        ];
        cachedFolders = folders;
        cacheTimestamp = now;
        return folders;
    } catch (error) {
        console.error('Error fetching Cloudinary folders:', error);
        return [
            rootFolder
        ];
    }
}
