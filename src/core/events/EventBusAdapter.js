import { globalEventBus } from './GlobalEventBus.js';

/**
 * EventBusAdapter - Compatibility layer for migrating from EventBusService
 * 
 * This adapter provides the same API as the old EventBusService but routes
 * everything through the new GlobalEventBus for unified event management.
 */
export class EventBusAdapter {
    constructor(componentId = 'legacy-component') {
        this.componentId = componentId;
        this.listeners = new Map();
        this.eventHistory = [];
        this.isLoggingEnabled = true;

        // Register with global bus
        globalEventBus.registerUIComponent(componentId, this);
        
        console.log(`📡 EventBusAdapter: Created for '${componentId}' - routing to GlobalEventBus`);
    }

    /**
     * Subscribe to events (EventBusService compatible API)
     */
    subscribe(eventType, handler, options = {}) {
        const subscription = {
            handler,
            id: Math.random().toString(36).substr(2, 9),
            once: options.once || false,
            component: options.component || this.componentId
        };

        // Store subscription for compatibility
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, new Set());
        }
        this.listeners.get(eventType).add(subscription);

        // Create wrapper handler for global bus
        const globalHandler = (payload, event) => {
            try {
                // Add to local history for compatibility
                this.eventHistory.push({
                    type: eventType,
                    payload,
                    timestamp: Date.now(),
                    id: Math.random().toString(36).substr(2, 9),
                    context: {
                        source: event?.context?.source || 'unknown',
                        component: subscription.component
                    }
                });

                // Keep history manageable
                if (this.eventHistory.length > 1000) {
                    this.eventHistory = this.eventHistory.slice(-500);
                }

                if (this.isLoggingEnabled) {
                    console.log(`📡 EventBusAdapter[${this.componentId}]: Received '${eventType}'`, {
                        payload,
                        listenersCount: this.listeners.get(eventType)?.size || 0
                    });
                }

                // Call original handler
                handler(payload, event);

                // Remove one-time subscriptions
                if (subscription.once) {
                    this.listeners.get(eventType)?.delete(subscription);
                    globalEventBus.off(eventType, globalHandler);
                }
            } catch (error) {
                console.error(`📡 EventBusAdapter[${this.componentId}]: Error in handler for '${eventType}':`, error);
            }
        };

        // Subscribe to global bus
        globalEventBus.on(eventType, globalHandler);

        if (this.isLoggingEnabled) {
            console.log(`📡 EventBusAdapter[${this.componentId}]: Subscribed to '${eventType}'`);
        }

        // Return unsubscribe function (EventBusService compatible)
        return () => {
            this.listeners.get(eventType)?.delete(subscription);
            globalEventBus.off(eventType, globalHandler);
            if (this.isLoggingEnabled) {
                console.log(`📡 EventBusAdapter[${this.componentId}]: Unsubscribed from '${eventType}'`);
            }
        };
    }

    /**
     * Emit events (EventBusService compatible API)
     */
    emit(eventType, payload, context = {}) {
        const enrichedContext = {
            source: this.componentId,
            component: this.componentId,
            ...context
        };

        if (this.isLoggingEnabled) {
            console.log(`📡 EventBusAdapter[${this.componentId}]: Emitting '${eventType}'`, {
                payload,
                context: enrichedContext
            });
        }

        // Emit through global bus
        return globalEventBus.emit(eventType, payload, enrichedContext);
    }

    /**
     * Get event history (EventBusService compatible API)
     */
    getEventHistory(eventType = null) {
        if (eventType) {
            return this.eventHistory.filter(event => event.type === eventType);
        }
        return [...this.eventHistory];
    }

    /**
     * Replay events (EventBusService compatible API)
     */
    replayEvents(events) {
        console.log(`📡 EventBusAdapter[${this.componentId}]: Replaying events`, events);
        events.forEach(event => {
            this.emit(event.type, event.payload, { ...event.context, isReplay: true });
        });
    }

    /**
     * Clear subscriptions (EventBusService compatible API)
     */
    clear() {
        this.listeners.clear();
        this.eventHistory = [];
        console.log(`📡 EventBusAdapter[${this.componentId}]: Cleared all subscriptions and history`);
    }

    /**
     * Get subscription stats (EventBusService compatible API)
     */
    getStats() {
        const stats = {};
        this.listeners.forEach((subscribers, eventType) => {
            stats[eventType] = subscribers.size;
        });
        return stats;
    }

    /**
     * Enable/disable logging (EventBusService compatible API)
     */
    setLogging(enabled) {
        this.isLoggingEnabled = enabled;
        console.log(`📡 EventBusAdapter[${this.componentId}]: Logging ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Handle events from global bus (for UI component registration)
     */
    handleEvent(eventName, data) {
        // This method is called when the global bus broadcasts to UI components
        // We don't need to do anything here since we're already subscribed through the normal flow
    }

    /**
     * Get access to the global event bus for advanced features
     */
    getGlobalBus() {
        return globalEventBus;
    }

    /**
     * Subscribe to global events that might not be routed to this component
     */
    subscribeToGlobal(eventType, handler, options = {}) {
        return globalEventBus.subscribe(eventType, handler, {
            ...options,
            component: `${this.componentId}:global`
        });
    }

    /**
     * Emit to global bus (bypassing local routing)
     */
    emitGlobal(eventType, payload, context = {}) {
        return globalEventBus.emit(eventType, payload, {
            ...context,
            source: `${this.componentId}:global`,
            component: this.componentId
        });
    }
}

/**
 * Factory function to create EventBusService-compatible instances
 */
export function createEventBusService(componentId) {
    return new EventBusAdapter(componentId);
}

/**
 * Drop-in replacement for the old EventBusService singleton
 * This maintains the same API but routes through GlobalEventBus
 */
export default new EventBusAdapter('default-service');