export class BufferPool {
    constructor() {
        this.pool = new Map(); // Map size to buffer arrays
        this.maxPoolSize = 20; // Increased from 10 for better reuse
        this.stats = {
            hits: 0,
            misses: 0,
            allocations: 0,
            releases: 0
        };
    }

    get(size) {
        // Round up to nearest power of 2 for better pool utilization
        const poolSize = this._roundToPowerOf2(size);
        
        if (!this.pool.has(poolSize)) {
            this.pool.set(poolSize, []);
        }
        
        const poolForSize = this.pool.get(poolSize);
        let buffer;
        
        if (poolForSize.length > 0) {
            buffer = poolForSize.pop();
            this.stats.hits++;
        } else {
            buffer = Buffer.allocUnsafe(poolSize);
            this.stats.misses++;
            this.stats.allocations++;
        }
        
        // Only return the requested size, but pool the larger buffer
        return buffer.subarray(0, size);
    }
    
    _roundToPowerOf2(size) {
        // Round up to nearest power of 2, with a minimum of 1024
        const minSize = 1024;
        if (size <= minSize) return minSize;
        
        let power = 1;
        while (power < size) {
            power <<= 1;
        }
        return power;
    }

    release(buffer) {
        if (!buffer || buffer.length === 0) return;
        
        // Get the original buffer if this is a subarray
        const originalBuffer = buffer.buffer ? Buffer.from(buffer.buffer) : buffer;
        const size = originalBuffer.length;
        
        if (!this.pool.has(size)) {
            this.pool.set(size, []);
        }
        
        const poolForSize = this.pool.get(size);
        if (poolForSize.length < this.maxPoolSize) {
            // Clear the buffer for security
            originalBuffer.fill(0);
            poolForSize.push(originalBuffer);
            this.stats.releases++;
        }
    }

    clear() {
        this.pool.clear();
    }

    getStats() {
        const poolStats = {};
        let totalPooled = 0;
        let totalMemory = 0;
        
        for (const [size, buffers] of this.pool.entries()) {
            poolStats[size] = buffers.length;
            totalPooled += buffers.length;
            totalMemory += size * buffers.length;
        }
        
        return {
            ...this.stats,
            poolStats,
            totalPooled,
            totalMemoryPooled: totalMemory,
            hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) * 100
        };
    }
}

// Global buffer pool instance
export const globalBufferPool = new BufferPool();