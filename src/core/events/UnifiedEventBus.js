import { EventEmitter } from 'events';
import { WorkerEventCategories, WorkerEvents, getEventCategory, getEventsInCategory } from './WorkerEventCategories.js';

/**
 * Unified Event Bus - Optional centralized event management
 * Provides a single point for all system events with routing, filtering, and debugging
 */
export class UnifiedEventBus extends EventEmitter {
    constructor(options = {}) {
        super();
        this.options = {
            enableDebug: false,
            enableMetrics: false,
            enableEventHistory: false,
            maxHistorySize: 1000,
            ...options
        };

        this.eventHistory = [];
        this.eventMetrics = new Map();
        this.connectedEmitters = new Set();
    }

    /**
     * Connect an existing EventEmitter to this bus
     * All events from the connected emitter will be re-emitted through the bus
     */
    connect(eventEmitter, namespace = 'default') {
        if (this.connectedEmitters.has(eventEmitter)) {
            return; // Already connected
        }

        this.connectedEmitters.add(eventEmitter);

        // Proxy all events from the connected emitter
        const originalEmit = eventEmitter.emit;
        eventEmitter.emit = (...args) => {
            const [eventName, ...eventArgs] = args;

            // Emit on the bus with namespace
            const busEventName = namespace === 'default' ? eventName : `${namespace}:${eventName}`;
            this.emit(busEventName, ...eventArgs);

            // Call original emit
            return originalEmit.apply(eventEmitter, args);
        };
    }

    /**
     * Override emit to add debugging, metrics, and history
     */
    emit(eventName, ...args) {
        const eventData = args[0] || {};
        const timestamp = Date.now();

        // Debug logging
        if (this.options.enableDebug) {
            console.log(`[EventBus] ${eventName}:`, eventData);
        }

        // Metrics tracking
        if (this.options.enableMetrics) {
            const count = this.eventMetrics.get(eventName) || 0;
            this.eventMetrics.set(eventName, count + 1);
        }

        // Event history
        if (this.options.enableEventHistory) {
            this.eventHistory.push({
                eventName,
                data: eventData,
                timestamp
            });

            // Trim history if too large
            if (this.eventHistory.length > this.options.maxHistorySize) {
                this.eventHistory.shift();
            }
        }

        return super.emit(eventName, ...args);
    }

    /**
     * Subscribe to events by category
     */
    subscribeToCategory(category, handler) {
        const categoryEvents = this._getEventsInCategory(category);
        const subscriptionIds = [];

        categoryEvents.forEach(eventName => {
            this.on(eventName, handler);
            subscriptionIds.push(eventName);
        });

        return subscriptionIds;
    }

    /**
     * Get event metrics
     */
    getMetrics() {
        return {
            totalEvents: Array.from(this.eventMetrics.values()).reduce((a, b) => a + b, 0),
            eventCounts: Object.fromEntries(this.eventMetrics),
            connectedEmitters: this.connectedEmitters.size,
            historySize: this.eventHistory.length
        };
    }

    /**
     * Get recent event history
     */
    getHistory(limit = 100) {
        return this.eventHistory.slice(-limit);
    }

    /**
     * Clear metrics and history
     */
    clear() {
        this.eventMetrics.clear();
        this.eventHistory = [];
    }

    _getEventsInCategory(category) {
        return getEventsInCategory(category);
    }

    /**
     * Subscribe to all events and route them through the bus
     * This replaces the need for individual project event emitters
     */
    subscribeToAllEvents(handler, options = {}) {
        const allEvents = Object.values(WorkerEvents);
        const subscriptions = [];

        allEvents.forEach(eventName => {
            this.on(eventName, (data) => {
                const enrichedData = {
                    ...data,
                    eventName,
                    category: getEventCategory(eventName),
                    timestamp: Date.now(),
                    busNamespace: options.namespace || 'default'
                };
                handler(enrichedData);
            });
            subscriptions.push(eventName);
        });

        return subscriptions;
    }

    /**
     * Emit worker events directly to the bus
     * Also emits through any connected emitters for backward compatibility
     */
    emitWorkerEvent(eventName, data = {}) {
        const enrichedData = {
            ...data,
            eventName,
            category: getEventCategory(eventName),
            timestamp: Date.now()
        };

        this.emit(eventName, enrichedData);

        // Also emit through connected emitters for backward compatibility
        this.connectedEmitters.forEach(emitter => {
            if (emitter !== this && typeof emitter.emit === 'function') {
                emitter.emit(eventName, enrichedData);
            }
        });

        return enrichedData;
    }

    /**
     * Factory method to create a bus connected to a Project
     */
    static createForProject(project, options = {}) {
        const bus = new UnifiedEventBus(options);
        bus.connect(project, 'project');
        return bus;
    }
}