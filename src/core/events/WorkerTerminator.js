import { globalEventBus } from './GlobalEventBus.js';

/**
 * Worker Terminator - Utility for gracefully terminating workers
 * 
 * This provides a simple interface for terminating workers through the global event bus
 */
export class WorkerTerminator {
    /**
     * Terminate a specific worker by ID
     */
    static terminateWorker(workerId, reason = 'user_requested') {
        console.log(`🛑 Terminating worker: ${workerId} (reason: ${reason})`);
        
        // Send termination event through global bus
        globalEventBus.emit('worker:terminate', {
            workerId,
            reason,
            timestamp: Date.now()
        });

        // Also use the direct termination method
        globalEventBus.terminateWorker(workerId, reason);
        
        return true;
    }

    /**
     * Terminate all active workers
     */
    static terminateAllWorkers(reason = 'user_requested') {
        console.log(`🛑 Terminating all workers (reason: ${reason})`);
        
        // Send termination event through global bus
        globalEventBus.emit('worker:terminate', {
            workerId: 'all',
            reason,
            timestamp: Date.now()
        });

        // Also use the direct termination method
        globalEventBus.terminateWorker('all', reason);
        
        return true;
    }

    /**
     * Get list of active workers
     */
    static getActiveWorkers() {
        const status = globalEventBus.getSystemStatus();
        return status.workers || [];
    }

    /**
     * Check if a specific worker is active
     */
    static isWorkerActive(workerId) {
        const activeWorkers = this.getActiveWorkers();
        return activeWorkers.includes(workerId);
    }

    /**
     * Terminate workers with a timeout (force kill if they don't respond)
     */
    static async terminateWorkerWithTimeout(workerId, timeoutMs = 5000, reason = 'user_requested') {
        console.log(`🛑 Terminating worker with timeout: ${workerId} (${timeoutMs}ms)`);
        
        // Start graceful termination
        this.terminateWorker(workerId, reason);
        
        // Set up timeout for force termination
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                console.log(`⚠️ Worker ${workerId} did not terminate gracefully, forcing termination`);
                
                // Force termination through global bus
                globalEventBus.emit('worker:force_terminate', {
                    workerId,
                    reason: 'timeout_exceeded',
                    originalReason: reason,
                    timestamp: Date.now()
                });
                
                resolve(false); // Indicates forced termination
            }, timeoutMs);

            // Listen for successful termination
            const unsubscribe = globalEventBus.subscribe('worker:terminated', (data) => {
                if (data.workerId === workerId) {
                    clearTimeout(timeout);
                    unsubscribe();
                    resolve(true); // Indicates graceful termination
                }
            });
        });
    }

    /**
     * Emergency stop - immediately terminate all workers
     */
    static emergencyStop() {
        console.log('🚨 EMERGENCY STOP - Terminating all workers immediately');
        
        globalEventBus.emit('worker:emergency_stop', {
            timestamp: Date.now(),
            reason: 'emergency_stop'
        });

        // Force terminate all workers immediately
        const status = globalEventBus.getSystemStatus();
        const workers = status.workers || [];
        
        workers.forEach(workerId => {
            globalEventBus.terminateWorker(workerId, 'emergency_stop');
        });

        return workers.length;
    }
}

// Export convenience functions
export const terminateWorker = WorkerTerminator.terminateWorker.bind(WorkerTerminator);
export const terminateAllWorkers = WorkerTerminator.terminateAllWorkers.bind(WorkerTerminator);
export const emergencyStop = WorkerTerminator.emergencyStop.bind(WorkerTerminator);

export default WorkerTerminator;