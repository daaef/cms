import { UploadQueue } from './uploadQueue.js';
import type { UploadQueueConfig } from '../types.js';
declare class QueueManager {
    private queues;
    getQueue(collectionSlug: string, config?: UploadQueueConfig): UploadQueue;
    removeQueue(collectionSlug: string): void;
    getAllQueues(): Map<string, UploadQueue>;
}
export declare const queueManager: QueueManager;
export {};
//# sourceMappingURL=queueManager.d.ts.map