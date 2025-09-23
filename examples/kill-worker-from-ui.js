/**
 * Example: How to Kill Worker Processes from nft-studio UI
 * 
 * This example shows how to send kill commands from the nft-studio UI
 * to terminate worker processes running in my-nft-gen.
 */

// Option 1: Using the EventBusAdapter (Drop-in replacement)
import EventBusService from '../src/core/events/EventBusAdapter.js';

class NFTStudioComponent {
    constructor() {
        this.eventBus = EventBusService;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for worker status updates
        this.eventBus.subscribe('workerStarted', (data) => {
            console.log('Worker started:', data.workerId);
            this.updateUI('Worker started', data.workerId);
        });

        this.eventBus.subscribe('workerKilled', (data) => {
            console.log('Worker killed:', data.workerId);
            this.updateUI('Worker terminated', data.workerId);
        });

        this.eventBus.subscribe('workerKillFailed', (data) => {
            console.error('Failed to kill worker:', data.workerId, data.error);
            this.updateUI('Kill failed', data.workerId, data.error);
        });
    }

    // Method to kill a specific worker
    killWorker(workerId, signal = 'SIGTERM') {
        console.log(`Requesting to kill worker: ${workerId}`);
        
        // Send kill command through the unified event system
        this.eventBus.emit('killWorker', {
            workerId,
            signal,
            requestedBy: 'nft-studio-ui',
            timestamp: Date.now()
        });
    }

    // Method to kill all workers
    killAllWorkers(signal = 'SIGTERM') {
        console.log('Requesting to kill all workers');
        
        this.eventBus.emit('killAllWorkers', {
            signal,
            requestedBy: 'nft-studio-ui',
            timestamp: Date.now()
        });
    }

    // Method to stop a specific generation process
    stopGeneration(processId) {
        // This could be mapped to a specific worker ID
        const workerId = `generation-${processId}`;
        this.killWorker(workerId);
    }

    updateUI(status, workerId, error = null) {
        // Update your UI here
        const statusElement = document.getElementById('worker-status');
        if (statusElement) {
            statusElement.textContent = `${status}: ${workerId}`;
            if (error) {
                statusElement.textContent += ` (Error: ${error})`;
            }
        }
    }
}

// Option 2: Using the Global Event Bus directly
import { globalEventBus } from '../src/core/events/GlobalEventBus.js';

class DirectGlobalBusComponent {
    constructor() {
        this.eventBus = globalEventBus;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Subscribe to worker events
        this.eventBus.subscribe('workerStarted', (data) => {
            console.log('Worker started:', data);
        });

        this.eventBus.subscribe('workerKilled', (data) => {
            console.log('Worker killed successfully:', data);
        });

        this.eventBus.subscribe('workerKillFailed', (data) => {
            console.error('Worker kill failed:', data);
        });
    }

    // Kill worker using direct method
    killWorkerDirect(workerId, signal = 'SIGTERM') {
        return this.eventBus.killWorker(workerId, signal);
    }

    // Kill worker using event emission
    killWorkerViaEvent(workerId, signal = 'SIGTERM') {
        this.eventBus.emit('killWorker', { workerId, signal });
    }

    // Get list of active workers
    getActiveWorkers() {
        const status = this.eventBus.getSystemStatus();
        return status.workers;
    }
}

// Option 3: React Component Example
import React, { useState, useEffect } from 'react';
import { createUIEventBus } from '../src/core/events/GlobalEventBus.js';

function WorkerControlPanel() {
    const [workers, setWorkers] = useState([]);
    const [eventBus] = useState(() => createUIEventBus('worker-control-panel'));

    useEffect(() => {
        // Subscribe to worker events
        const unsubscribeStarted = eventBus.subscribe('workerStarted', (data) => {
            setWorkers(prev => [...prev, data.workerId]);
        });

        const unsubscribeKilled = eventBus.subscribe('workerKilled', (data) => {
            setWorkers(prev => prev.filter(id => id !== data.workerId));
        });

        return () => {
            unsubscribeStarted();
            unsubscribeKilled();
        };
    }, [eventBus]);

    const handleKillWorker = (workerId) => {
        eventBus.emit('killWorker', {
            workerId,
            signal: 'SIGTERM',
            requestedBy: 'react-control-panel'
        });
    };

    const handleKillAllWorkers = () => {
        eventBus.emit('killAllWorkers', {
            signal: 'SIGTERM',
            requestedBy: 'react-control-panel'
        });
    };

    return (
        <div>
            <h3>Active Workers</h3>
            {workers.map(workerId => (
                <div key={workerId}>
                    <span>{workerId}</span>
                    <button onClick={() => handleKillWorker(workerId)}>
                        Kill Worker
                    </button>
                </div>
            ))}
            <button onClick={handleKillAllWorkers}>
                Kill All Workers
            </button>
        </div>
    );
}

// Usage Examples:

// 1. Kill a specific worker when user clicks "Stop Generation"
const nftStudio = new NFTStudioComponent();
// nftStudio.killWorker('random-loop-generator-1');

// 2. Kill all workers when user clicks "Stop All"
// nftStudio.killAllWorkers();

// 3. Stop a specific generation process
// nftStudio.stopGeneration('abc123');

export { NFTStudioComponent, DirectGlobalBusComponent, WorkerControlPanel };