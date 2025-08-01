export class BufferPool {
    constructor(maxPoolSize = 50, maxBufferSize = 50 * 1024 * 1024) {
        this.maxPoolSize = maxPoolSize;
        this.maxBufferSize = maxBufferSize;
        this.pool = new Map();
        this.usage = new Map();
        this.totalMemoryUsage = 0;
    }

    _getBufferKey(width, height, channels = 4) {
        return `${width}x${height}x${channels}`;
    }

    _getBufferSize(width, height, channels = 4) {
        return width * height * channels;
    }

    _cleanupOldBuffers() {
        if (this.pool.size <= this.maxPoolSize && this.totalMemoryUsage <= this.maxBufferSize) {
            return;
        }

        const entries = Array.from(this.usage.entries())
            .sort(([, a], [, b]) => a.lastUsed - b.lastUsed);

        for (const [key] of entries) {
            if (this.pool.size <= this.maxPoolSize * 0.8 && this.totalMemoryUsage <= this.maxBufferSize * 0.8) {
                break;
            }

            const buffers = this.pool.get(key);
            if (buffers && buffers.length > 0) {
                const buffer = buffers.pop();
                this.totalMemoryUsage -= buffer.length;
                
                if (buffers.length === 0) {
                    this.pool.delete(key);
                    this.usage.delete(key);
                }
            }
        }
    }

    getBuffer(width, height, channels = 4) {
        const key = this._getBufferKey(width, height, channels);
        const bufferSize = this._getBufferSize(width, height, channels);
        
        this._cleanupOldBuffers();

        let buffers = this.pool.get(key);
        if (!buffers) {
            buffers = [];
            this.pool.set(key, buffers);
            this.usage.set(key, { count: 0, lastUsed: Date.now() });
        }

        let buffer;
        if (buffers.length > 0) {
            buffer = buffers.pop();
            buffer.fill(0);
        } else {
            buffer = Buffer.alloc(bufferSize);
            this.totalMemoryUsage += bufferSize;
        }

        const usage = this.usage.get(key);
        usage.count++;
        usage.lastUsed = Date.now();

        return buffer;
    }

    returnBuffer(buffer, width, height, channels = 4) {
        if (!buffer || buffer.length === 0) {
            return;
        }

        const key = this._getBufferKey(width, height, channels);
        const expectedSize = this._getBufferSize(width, height, channels);

        if (buffer.length !== expectedSize) {
            return;
        }

        let buffers = this.pool.get(key);
        if (!buffers) {
            buffers = [];
            this.pool.set(key, buffers);
            this.usage.set(key, { count: 0, lastUsed: Date.now() });
        }

        if (buffers.length < 10) {
            buffers.push(buffer);
        } else {
            this.totalMemoryUsage -= buffer.length;
        }
    }

    clear() {
        this.pool.clear();
        this.usage.clear();
        this.totalMemoryUsage = 0;
    }

    getStats() {
        let totalBuffers = 0;
        for (const buffers of this.pool.values()) {
            totalBuffers += buffers.length;
        }

        return {
            pooledBufferTypes: this.pool.size,
            totalBuffers,
            totalMemoryUsage: this.totalMemoryUsage,
            memoryUsageMB: Math.round(this.totalMemoryUsage / (1024 * 1024) * 100) / 100,
        };
    }
}

export const globalBufferPool = new BufferPool();