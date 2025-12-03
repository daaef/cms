import type { UploadQueueConfig } from '../types.js';
export interface UploadTask {
    id: string;
    filename: string;
    buffer: Buffer;
    size: number;
    options: any;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'failed';
    error?: string;
    result?: any;
    onProgress?: (progress: number) => void;
    onComplete?: (result: any) => void;
    onError?: (error: Error) => void;
}
export declare class UploadQueue {
    private queue;
    private activeUploads;
    private config;
    constructor(config?: UploadQueueConfig);
    addUpload(task: Omit<UploadTask, 'id' | 'progress' | 'status'>): Promise<string>;
    private processQueue;
    private processUpload;
    private regularUpload;
    private chunkedUpload;
    getStatus(uploadId: string): UploadTask | undefined;
    getAllStatus(): UploadTask[];
    cancelUpload(uploadId: string): boolean;
    clearCompleted(): number;
}
//# sourceMappingURL=uploadQueue.d.ts.map