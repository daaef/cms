import { UploadQueue } from "./uploadQueue.js";
class QueueManager {
    queues = new Map();
    getQueue(collectionSlug, config) {
        if (!this.queues.has(collectionSlug)) {
            this.queues.set(collectionSlug, new UploadQueue(config));
        }
        return this.queues.get(collectionSlug);
    }
    removeQueue(collectionSlug) {
        this.queues.delete(collectionSlug);
    }
    getAllQueues() {
        return new Map(this.queues);
    }
}
export const queueManager = new QueueManager();
