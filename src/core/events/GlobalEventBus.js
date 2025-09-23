import { UnifiedEventBus } from './UnifiedEventBus.js';
import { WorkerEventCategories, WorkerEvents } from './WorkerEventCategories.js';

/**
 * Global Event Bus - Single Source of Truth for All Application Events
 * 
 * This is the centralized event system that unifies:
 * - UI events (from nft-studio)
 * - Core processing events (from my-nft-gen)
 * - Worker thread events
 * - Cross-project communication
 */
export class GlobalEventBus extends UnifiedEventBus {
    constructor(options = {}) {
        super({
            enableDebug: true,
            enableMetrics: true,
            enableEventHistory: true,
            maxHistorySize: 2000,
            ...options
        });

        // Cross-project communication
        this.projectInstances = new Map();
        this.uiComponents = new Set();
        this.workerProcesses = new Map();
        
        // Event routing configuration
        this.routingRules = new Map();
        this.eventFilters = new Map();
        
        // Set up automatic worker kill handling
        this._setupWorkerKillHandling();
        
        console.log('🌐 GlobalEventBus: Initialized as single source of truth');
    }

    /**
     * Register a project instance with the global bus
     */
    registerProject(projectId, project) {
        this.projectInstances.set(projectId, project);
        
        // Connect the project's event bus to the global bus
        this.connect(project.eventBus || project, `project:${projectId}`);
        
        console.log(`🌐 GlobalEventBus: Registered project '${projectId}'`);
        return this;
    }

    /**
     * Register a UI component with the global bus
     */
    registerUIComponent(componentId, component) {
        this.uiComponents.add({ id: componentId, component });
        console.log(`🌐 GlobalEventBus: Registered UI component '${componentId}'`);
        return this;
    }

    /**
     * Register a worker process with the global bus
     */
    registerWorker(workerId, workerProcess) {
        this.workerProcesses.set(workerId, workerProcess);
        
        // Set up worker event parsing if it's a child process
        if (workerProcess && workerProcess.stdout) {
            this._setupWorkerEventParsing(workerId, workerProcess);
        }
        
        console.log(`🌐 GlobalEventBus: Registered worker '${workerId}'`);
        return this;
    }

    /**
     * UI-compatible subscription method (matches EventBusService API)
     */
    subscribe(eventType, handler, options = {}) {
        const subscription = {
            id: Math.random().toString(36).substr(2, 9),
            component: options.component || 'unknown',
            unsubscribe: null
        };

        // Use the underlying EventEmitter 'on' method
        this.on(eventType, handler);
        
        // Create unsubscribe function
        subscription.unsubscribe = () => {
            this.off(eventType, handler);
            console.log(`🌐 GlobalEventBus: ${subscription.component} unsubscribed from '${eventType}'`);
        };

        console.log(`🌐 GlobalEventBus: ${subscription.component} subscribed to '${eventType}'`);
        return subscription.unsubscribe;
    }

    /**
     * Enhanced emit with routing and filtering
     */
    emit(eventName, ...args) {
        const eventData = args[0] || {};
        
        // Apply routing rules
        if (this.routingRules.has(eventName)) {
            const rules = this.routingRules.get(eventName);
            rules.forEach(rule => {
                if (rule.condition(eventData)) {
                    this._routeEvent(rule.target, eventName, ...args);
                }
            });
        }

        // Apply filters
        if (this.eventFilters.has(eventName)) {
            const filters = this.eventFilters.get(eventName);
            const shouldEmit = filters.every(filter => filter(eventData));
            if (!shouldEmit) {
                return false;
            }
        }

        // Emit to all connected systems
        return super.emit(eventName, ...args);
    }

    /**
     * Broadcast event to all registered projects
     */
    broadcastToProjects(eventName, data) {
        this.projectInstances.forEach((project, projectId) => {
            try {
                if (project.emit) {
                    project.emit(eventName, { ...data, sourceProject: projectId });
                }
            } catch (error) {
                console.error(`🌐 GlobalEventBus: Error broadcasting to project '${projectId}':`, error);
            }
        });
    }

    /**
     * Broadcast event to all registered UI components
     */
    broadcastToUI(eventName, data) {
        this.uiComponents.forEach(({ id, component }) => {
            try {
                if (component.handleEvent) {
                    component.handleEvent(eventName, data);
                } else if (component.emit) {
                    component.emit(eventName, data);
                }
            } catch (error) {
                console.error(`🌐 GlobalEventBus: Error broadcasting to UI component '${id}':`, error);
            }
        });
    }

    /**
     * Send event to specific worker
     */
    sendToWorker(workerId, eventName, data) {
        const worker = this.workerProcesses.get(workerId);
        if (worker && worker.send) {
            worker.send({
                type: 'EVENT',
                eventName,
                data,
                timestamp: Date.now()
            });
        }
    }

    /**
     * Kill a specific worker process
     */
    killWorker(workerId, signal = 'SIGTERM') {
        const worker = this.workerProcesses.get(workerId);
        
        if (!worker) {
            this.emit('workerKillFailed', {
                workerId,
                error: 'Worker not found',
                timestamp: Date.now()
            });
            return false;
        }

        try {
            // Emit kill requested event
            this.emit('workerKillRequested', {
                workerId,
                signal,
                timestamp: Date.now()
            });

            // Kill the process
            if (worker.kill) {
                worker.kill(signal);
            } else if (worker.terminate) {
                // For worker threads
                worker.terminate();
            } else {
                throw new Error('Worker does not support kill or terminate');
            }

            // Remove from registry
            this.workerProcesses.delete(workerId);

            // Emit success event
            this.emit('workerKilled', {
                workerId,
                signal,
                timestamp: Date.now()
            });

            console.log(`🌐 GlobalEventBus: Killed worker '${workerId}' with signal '${signal}'`);
            return true;

        } catch (error) {
            this.emit('workerKillFailed', {
                workerId,
                signal,
                error: error.message,
                timestamp: Date.now()
            });
            
            console.error(`🌐 GlobalEventBus: Failed to kill worker '${workerId}':`, error);
            return false;
        }
    }

    /**
     * Kill all worker processes
     */
    killAllWorkers(signal = 'SIGTERM') {
        const results = [];
        const workerIds = Array.from(this.workerProcesses.keys());
        
        for (const workerId of workerIds) {
            results.push({
                workerId,
                success: this.killWorker(workerId, signal)
            });
        }

        return results;
    }

    /**
     * Add routing rule for automatic event forwarding
     */
    addRoutingRule(eventName, condition, target) {
        if (!this.routingRules.has(eventName)) {
            this.routingRules.set(eventName, []);
        }
        this.routingRules.get(eventName).push({ condition, target });
    }

    /**
     * Add event filter
     */
    addEventFilter(eventName, filterFunction) {
        if (!this.eventFilters.has(eventName)) {
            this.eventFilters.set(eventName, []);
        }
        this.eventFilters.get(eventName).push(filterFunction);
    }

    /**
     * Get comprehensive system status
     */
    getSystemStatus() {
        return {
            ...this.getMetrics(),
            projects: Array.from(this.projectInstances.keys()),
            uiComponents: Array.from(this.uiComponents).map(c => c.id),
            workers: Array.from(this.workerProcesses.keys()),
            routingRules: this.routingRules.size,
            eventFilters: this.eventFilters.size,
            connectedEmitters: this.connectedEmitters.size
        };
    }

    /**
     * Create project-specific event bus that's connected to global bus
     */
    createProjectBus(projectId, options = {}) {
        const projectBus = new UnifiedEventBus(options);
        
        // Connect project bus to global bus
        this.connect(projectBus, `project:${projectId}`);
        
        // Add project-specific methods
        projectBus.emitGlobal = (eventName, data) => {
            this.emit(eventName, { ...data, sourceProject: projectId });
        };
        
        projectBus.subscribeToGlobal = (eventName, handler) => {
            return this.subscribe(eventName, handler, { component: `project:${projectId}` });
        };

        return projectBus;
    }

    /**
     * Create UI-compatible event bus adapter
     */
    createUIAdapter(componentId) {
        return {
            subscribe: (eventType, handler, options = {}) => {
                return this.subscribe(eventType, handler, { 
                    ...options, 
                    component: componentId 
                });
            },
            emit: (eventType, payload, context = {}) => {
                return this.emit(eventType, payload, {
                    ...context,
                    source: componentId,
                    component: componentId
                });
            },
            getEventHistory: (eventType) => this.getHistory().filter(e => 
                !eventType || e.eventName === eventType
            ),
            clear: () => this.clear()
        };
    }

    // Private methods
    _setupWorkerEventParsing(workerId, workerProcess) {
        workerProcess.stdout.on('data', (data) => {
            const lines = data.toString().split('\n').filter(line => line.trim());
            
            lines.forEach(line => {
                try {
                    const event = JSON.parse(line);
                    if (event.type === 'WORKER_EVENT') {
                        // Re-emit worker event through global bus
                        this.emit(event.eventName, {
                            ...event.data,
                            workerId: event.workerId,
                            workerTimestamp: event.timestamp,
                            globalTimestamp: Date.now()
                        });
                    }
                } catch (error) {
                    // Not a JSON event, ignore
                }
            });
        });
    }

    _routeEvent(target, eventName, ...args) {
        switch (target) {
            case 'projects':
                this.broadcastToProjects(eventName, args[0]);
                break;
            case 'ui':
                this.broadcastToUI(eventName, args[0]);
                break;
            case 'workers':
                this.workerProcesses.forEach((worker, workerId) => {
                    this.sendToWorker(workerId, eventName, args[0]);
                });
                break;
            default:
                if (target.startsWith('project:')) {
                    const projectId = target.substring(8);
                    const project = this.projectInstances.get(projectId);
                    if (project && project.emit) {
                        project.emit(eventName, ...args);
                    }
                } else if (target.startsWith('worker:')) {
                    const workerId = target.substring(7);
                    this.sendToWorker(workerId, eventName, args[0]);
                }
                break;
        }
    }

    /**
     * Set up automatic handling of worker kill requests
     */
    _setupWorkerKillHandling() {
        // Listen for kill requests from UI or other components
        this.on('killWorker', (data) => {
            const { workerId, signal = 'SIGTERM' } = data;
            this.killWorker(workerId, signal);
        });

        this.on('killAllWorkers', (data) => {
            const { signal = 'SIGTERM' } = data || {};
            this.killAllWorkers(signal);
        });

        // Listen for process termination events to clean up registry
        this.on('workerTerminated', (data) => {
            const { workerId } = data;
            if (workerId && this.workerProcesses.has(workerId)) {
                this.workerProcesses.delete(workerId);
                console.log(`🌐 GlobalEventBus: Cleaned up terminated worker '${workerId}'`);
            }
        });
    }
}

// Export singleton instance
export const globalEventBus = new GlobalEventBus();

// Export factory functions for different contexts
export const createProjectEventBus = (projectId, options) => 
    globalEventBus.createProjectBus(projectId, options);

export const createUIEventBus = (componentId) => 
    globalEventBus.createUIAdapter(componentId);

// Export for direct access
export default globalEventBus;