import { fabric } from 'fabric';

export class CanvasPool {
    constructor(maxPoolSize = 20) {
        this.maxPoolSize = maxPoolSize;
        this.pool = new Map();
        this.usage = new Map();
    }

    _getCanvasKey(width, height) {
        return `${width}x${height}`;
    }

    _cleanupOldCanvases() {
        if (this.pool.size <= this.maxPoolSize) {
            return;
        }

        const entries = Array.from(this.usage.entries())
            .sort(([, a], [, b]) => a.lastUsed - b.lastUsed);

        for (const [key] of entries) {
            if (this.pool.size <= this.maxPoolSize * 0.8) {
                break;
            }

            const canvases = this.pool.get(key);
            if (canvases && canvases.length > 0) {
                const canvas = canvases.pop();
                canvas.dispose?.();
                
                if (canvases.length === 0) {
                    this.pool.delete(key);
                    this.usage.delete(key);
                }
            }
        }
    }

    getCanvas(width, height) {
        const key = this._getCanvasKey(width, height);
        
        this._cleanupOldCanvases();

        let canvases = this.pool.get(key);
        if (!canvases) {
            canvases = [];
            this.pool.set(key, canvases);
            this.usage.set(key, { count: 0, lastUsed: Date.now() });
        }

        let canvas;
        if (canvases.length > 0) {
            canvas = canvases.pop();
            canvas.clear();
            canvas.backgroundColor = '#00000000';
        } else {
            canvas = new fabric.StaticCanvas(null, {
                backgroundColor: '#00000000',
                width,
                height,
            });
        }

        const usage = this.usage.get(key);
        usage.count++;
        usage.lastUsed = Date.now();

        return canvas;
    }

    returnCanvas(canvas) {
        if (!canvas || !canvas.width || !canvas.height) {
            return;
        }

        const key = this._getCanvasKey(canvas.width, canvas.height);
        
        let canvases = this.pool.get(key);
        if (!canvases) {
            canvases = [];
            this.pool.set(key, canvases);
            this.usage.set(key, { count: 0, lastUsed: Date.now() });
        }

        canvas.clear();
        canvas.backgroundColor = '#00000000';

        if (canvases.length < 5) {
            canvases.push(canvas);
        } else {
            canvas.dispose?.();
        }
    }

    clear() {
        for (const canvases of this.pool.values()) {
            for (const canvas of canvases) {
                canvas.dispose?.();
            }
        }
        this.pool.clear();
        this.usage.clear();
    }

    getStats() {
        let totalCanvases = 0;
        for (const canvases of this.pool.values()) {
            totalCanvases += canvases.length;
        }

        return {
            pooledCanvasTypes: this.pool.size,
            totalCanvases,
        };
    }
}

export const globalCanvasPool = new CanvasPool();