import { v2 as cloudinary } from "cloudinary";
export class UploadQueue {
    queue = [];
    activeUploads = new Map();
    config;
    constructor(config = {}){
        this.config = {
            enabled: config.enabled ?? true,
            maxConcurrentUploads: config.maxConcurrentUploads ?? 3,
            chunkSize: config.chunkSize ?? 20,
            enableChunkedUploads: config.enableChunkedUploads ?? true,
            largeFileThreshold: config.largeFileThreshold ?? 100
        };
    }
    async addUpload(task) {
        const id = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const uploadTask = {
            ...task,
            id,
            progress: 0,
            status: 'pending'
        };
        this.queue.push(uploadTask);
        this.processQueue();
        return id;
    }
    async processQueue() {
        while(this.queue.length > 0 && this.activeUploads.size < this.config.maxConcurrentUploads){
            const task = this.queue.shift();
            if (!task) continue;
            task.status = 'uploading';
            this.activeUploads.set(task.id, task);
            this.processUpload(task).catch((error)=>{
                task.status = 'failed';
                task.error = error.message;
                task.onError?.(error);
                this.activeUploads.delete(task.id);
                this.processQueue();
            });
        }
    }
    async processUpload(task) {
        try {
            const isLargeFile = task.size > this.config.largeFileThreshold * 1024 * 1024;
            if (isLargeFile && this.config.enableChunkedUploads) {
                await this.chunkedUpload(task);
            } else {
                await this.regularUpload(task);
            }
            task.status = 'completed';
            task.progress = 100;
            task.onProgress?.(100);
            task.onComplete?.(task.result);
        } finally{
            this.activeUploads.delete(task.id);
            this.processQueue();
        }
    }
    async regularUpload(task) {
        return new Promise((resolve, reject)=>{
            const uploadStream = cloudinary.uploader.upload_stream(task.options, (error, result)=>{
                if (error) {
                    reject(error);
                } else {
                    task.result = result;
                    resolve();
                }
            });
            let uploaded = 0;
            const totalSize = task.buffer.length;
            uploadStream.on('pipe', ()=>{
                task.onProgress?.(0);
            });
            uploadStream.on('data', (chunk)=>{
                uploaded += chunk.length;
                const progress = Math.round(uploaded / totalSize * 100);
                task.progress = progress;
                task.onProgress?.(progress);
            });
            uploadStream.end(task.buffer);
        });
    }
    async chunkedUpload(task) {
        const { Readable } = await import("stream");
        return new Promise((resolve, reject)=>{
            const bufferStream = new Readable();
            bufferStream.push(task.buffer);
            bufferStream.push(null);
            const uploadStream = cloudinary.uploader.upload_large_stream({
                ...task.options,
                chunk_size: this.config.chunkSize * 1024 * 1024
            }, (error, result)=>{
                if (error) {
                    const errorMsg = error.message || 'Unknown error';
                    if (errorMsg.includes('413') || errorMsg.includes('File size too large')) {
                        reject(new Error('File too large for your Cloudinary plan. Consider upgrading for larger file support.'));
                    } else {
                        reject(error);
                    }
                } else {
                    task.result = result;
                    resolve();
                }
            });
            let uploaded = 0;
            const totalSize = task.buffer.length;
            uploadStream.on('pipe', ()=>{
                task.onProgress?.(0);
            });
            uploadStream.on('data', (chunk)=>{
                uploaded += chunk.length;
                const progress = Math.min(Math.round(uploaded / totalSize * 90), 90);
                task.progress = progress;
                task.onProgress?.(progress);
            });
            uploadStream.on('finish', ()=>{
                task.progress = 100;
                task.onProgress?.(100);
            });
            bufferStream.pipe(uploadStream);
        });
    }
    getStatus(uploadId) {
        return this.activeUploads.get(uploadId) || this.queue.find((task)=>task.id === uploadId);
    }
    getAllStatus() {
        return [
            ...this.queue,
            ...Array.from(this.activeUploads.values())
        ];
    }
    cancelUpload(uploadId) {
        const queueIndex = this.queue.findIndex((task)=>task.id === uploadId);
        if (queueIndex !== -1) {
            this.queue.splice(queueIndex, 1);
            return true;
        }
        return false;
    }
    clearCompleted() {
        return 0;
    }
}
