import { globalEventBus } from './GlobalEventBus.js';

/**
 * Loop Terminator - Utility for terminating entire loop generation processes
 * 
 * This provides a comprehensive interface for stopping loop generation at any stage
 */
export class LoopTerminator {
    /**
     * Terminate a specific loop generation process
     */
    static terminateLoop(loopId, reason = 'user_requested') {
        console.log(`🛑 Terminating loop: ${loopId} (reason: ${reason})`);
        
        // Send loop termination event through global bus
        globalEventBus.emit('loop:terminate', {
            loopId,
            reason,
            timestamp: Date.now()
        });

        return true;
    }

    /**
     * Terminate all active loops
     */
    static terminateAllLoops(reason = 'user_requested') {
        console.log(`🛑 Terminating all loops (reason: ${reason})`);
        
        // Send termination event through global bus
        globalEventBus.emit('loop:terminate_all', {
            reason,
            timestamp: Date.now()
        });

        return true;
    }

    /**
     * Emergency stop - immediately terminate all loops and workers
     */
    static emergencyStopAll(reason = 'emergency') {
        console.log('🚨 EMERGENCY STOP - Terminating all loops and workers immediately');
        
        // Send emergency stop event
        globalEventBus.emit('system:emergency_stop', {
            timestamp: Date.now(),
            reason
        });

        // Also terminate all workers
        globalEventBus.emit('worker:terminate', {
            workerId: 'all',
            reason: 'emergency_stop',
            timestamp: Date.now()
        });

        return true;
    }

    /**
     * Graceful shutdown with timeout
     */
    static async gracefulShutdown(timeoutMs = 10000, reason = 'graceful_shutdown') {
        console.log(`🛑 Initiating graceful shutdown (timeout: ${timeoutMs}ms)`);
        
        // Send graceful shutdown signal
        globalEventBus.emit('system:graceful_shutdown', {
            timeoutMs,
            reason,
            timestamp: Date.now()
        });

        // Wait for processes to terminate gracefully or timeout
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                console.log(`⚠️ Graceful shutdown timeout exceeded, forcing termination`);
                this.emergencyStopAll('graceful_timeout');
                resolve(false); // Indicates forced termination
            }, timeoutMs);

            // Listen for all processes to complete
            const checkCompletion = () => {
                const status = globalEventBus.getSystemStatus();
                if (status.workers.length === 0) {
                    clearTimeout(timeout);
                    resolve(true); // Indicates successful graceful shutdown
                }
            };

            // Check periodically
            const interval = setInterval(checkCompletion, 500);
            
            // Clean up interval when done
            setTimeout(() => clearInterval(interval), timeoutMs);
        });
    }

    /**
     * Get status of active loops and workers
     */
    static getSystemStatus() {
        return globalEventBus.getSystemStatus();
    }

    /**
     * Set up automatic loop termination handling
     */
    static setupAutoTermination() {
        // Listen for loop termination requests
        globalEventBus.on('loop:terminate', (data) => {
            const { loopId, reason } = data;
            console.log(`🛑 Processing loop termination request for: ${loopId}`);
            
            // Find and terminate the specific loop
            // This would need to be implemented based on how loops are tracked
            // For now, we'll emit a worker termination for all workers associated with the loop
            globalEventBus.emit('worker:terminate', {
                workerId: 'all', // Could be more specific if we track loop-to-worker mapping
                reason: `loop_terminated:${reason}`,
                timestamp: Date.now()
            });
        });

        // Listen for terminate all loops
        globalEventBus.on('loop:terminate_all', (data) => {
            const { reason } = data;
            console.log(`🛑 Processing terminate all loops request`);
            
            globalEventBus.emit('worker:terminate', {
                workerId: 'all',
                reason: `all_loops_terminated:${reason}`,
                timestamp: Date.now()
            });
        });

        // Listen for emergency stop
        globalEventBus.on('system:emergency_stop', (data) => {
            const { reason } = data;
            console.log(`🚨 Processing emergency stop`);
            
            // Force terminate all workers immediately
            const status = globalEventBus.getSystemStatus();
            const workers = status.workers || [];
            
            workers.forEach(workerId => {
                globalEventBus.terminateWorker(workerId, `emergency_stop:${reason}`);
            });
        });

        // Listen for graceful shutdown
        globalEventBus.on('system:graceful_shutdown', (data) => {
            const { timeoutMs, reason } = data;
            console.log(`🛑 Processing graceful shutdown request`);
            
            // Send termination signal to all workers
            globalEventBus.emit('worker:terminate', {
                workerId: 'all',
                reason: `graceful_shutdown:${reason}`,
                timestamp: Date.now()
            });
        });

        console.log('🛑 Loop termination auto-handling setup complete');
    }
}

// Set up automatic termination handling when this module is imported
LoopTerminator.setupAutoTermination();

// Export convenience functions
export const terminateLoop = LoopTerminator.terminateLoop.bind(LoopTerminator);
export const terminateAllLoops = LoopTerminator.terminateAllLoops.bind(LoopTerminator);
export const emergencyStopAll = LoopTerminator.emergencyStopAll.bind(LoopTerminator);
export const gracefulShutdown = LoopTerminator.gracefulShutdown.bind(LoopTerminator);

export default LoopTerminator;