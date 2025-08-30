/**
 * Canvas pool for reusing canvas objects to reduce garbage collection overhead
 */
export class CanvasPool {
    constructor(maxSize = 20) {
        this.pool = [];
        this.maxSize = maxSize;
    }

    getCanvas(width, height, Factory) {
        // Look for a suitable canvas in the pool
        const index = this.pool.findIndex(item => 
            item.width === width && 
            item.height === height && 
            item.factory === Factory
        );

        if (index !== -1) {
            const canvas = this.pool.splice(index, 1)[0];
            return canvas.canvas;
        }

        // No suitable canvas found, create new one
        return Factory.getNewCanvas(width, height);
    }

    releaseCanvas(canvas, width, height, Factory) {
        if (this.pool.length < this.maxSize) {
            this.pool.push({
                canvas,
                width,
                height,
                factory: Factory
            });
        }
    }

    clear() {
        this.pool = [];
    }
}

// Global canvas pool instance
export const globalCanvasPool = new CanvasPool();