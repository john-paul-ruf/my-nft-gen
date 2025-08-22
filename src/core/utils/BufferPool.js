export class BufferPool {
    constructor() {
        this.pool = new Map(); // Map size to buffer arrays
        this.maxPoolSize = 10; // Maximum buffers per size
    }

    get(size) {
        if (!this.pool.has(size)) {
            this.pool.set(size, []);
        }
        
        const poolForSize = this.pool.get(size);
        return poolForSize.pop() || Buffer.allocUnsafe(size);
    }

    release(buffer) {
        if (!buffer || buffer.length === 0) return;
        
        const size = buffer.length;
        if (!this.pool.has(size)) {
            this.pool.set(size, []);
        }
        
        const poolForSize = this.pool.get(size);
        if (poolForSize.length < this.maxPoolSize) {
            poolForSize.push(buffer);
        }
    }

    clear() {
        this.pool.clear();
    }

    getStats() {
        const stats = {};
        for (const [size, buffers] of this.pool.entries()) {
            stats[size] = buffers.length;
        }
        return stats;
    }
}

// Global buffer pool instance
export const globalBufferPool = new BufferPool();