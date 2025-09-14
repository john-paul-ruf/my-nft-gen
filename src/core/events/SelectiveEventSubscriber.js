import { WorkerEventCategories, getEventsInCategory, getEventCategory } from './WorkerEventCategories.js';
import { ProjectEvents } from '../../app/Project.js';

/**
 * Selective Event Subscriber that allows subscribing to specific event categories
 * or individual events from the Project's EventEmitter
 */
export class SelectiveEventSubscriber {
    constructor(project) {
        this.project = project;
        this.subscriptions = new Map();
        this.categorySubscriptions = new Map();
        this.isActive = true;
    }

    /**
     * Subscribe to a specific event category
     * @param {string} category - Category from WorkerEventCategories
     * @param {Function} callback - Callback function to handle events
     * @param {Object} options - Subscription options
     * @returns {string} Subscription ID for later unsubscription
     */
    subscribeToCategory(category, callback, options = {}) {
        const subscriptionId = `category_${category}_${Date.now()}_${Math.random()}`;

        if (!Object.values(WorkerEventCategories).includes(category)) {
            throw new Error(`Invalid category: ${category}`);
        }

        const eventsInCategory = getEventsInCategory(category);
        const handlers = new Map();

        // Create handlers for each event in the category
        eventsInCategory.forEach(eventName => {
            const handler = (data) => {
                if (this.isActive && this.categorySubscriptions.has(subscriptionId)) {
                    const enrichedData = {
                        ...data,
                        eventName,
                        category,
                        subscriptionId
                    };

                    if (this._shouldEmitEvent(enrichedData, options)) {
                        callback(enrichedData);
                    }
                }
            };

            handlers.set(eventName, handler);
            this.project.on(eventName, handler);
        });

        this.categorySubscriptions.set(subscriptionId, {
            category,
            callback,
            options,
            handlers,
            createdAt: Date.now()
        });

        return subscriptionId;
    }

    /**
     * Subscribe to specific events
     * @param {string|string[]} events - Event name(s) from ProjectEvents
     * @param {Function} callback - Callback function to handle events
     * @param {Object} options - Subscription options
     * @returns {string} Subscription ID for later unsubscription
     */
    subscribeToEvents(events, callback, options = {}) {
        const subscriptionId = `events_${Date.now()}_${Math.random()}`;
        const eventList = Array.isArray(events) ? events : [events];
        const handlers = new Map();

        eventList.forEach(eventName => {
            if (!Object.values(ProjectEvents).includes(eventName)) {
                throw new Error(`Invalid event: ${eventName}`);
            }

            const handler = (data) => {
                if (this.isActive && this.subscriptions.has(subscriptionId)) {
                    const enrichedData = {
                        ...data,
                        eventName,
                        category: getEventCategory(eventName),
                        subscriptionId
                    };

                    if (this._shouldEmitEvent(enrichedData, options)) {
                        callback(enrichedData);
                    }
                }
            };

            handlers.set(eventName, handler);
            this.project.on(eventName, handler);
        });

        this.subscriptions.set(subscriptionId, {
            events: eventList,
            callback,
            options,
            handlers,
            createdAt: Date.now()
        });

        return subscriptionId;
    }

    /**
     * Subscribe to multiple categories with a single callback
     * @param {string[]} categories - Array of categories
     * @param {Function} callback - Callback function
     * @param {Object} options - Subscription options
     * @returns {string[]} Array of subscription IDs
     */
    subscribeToCategories(categories, callback, options = {}) {
        return categories.map(category =>
            this.subscribeToCategory(category, callback, options)
        );
    }

    /**
     * Unsubscribe from a specific subscription
     * @param {string} subscriptionId - The subscription ID to remove
     */
    unsubscribe(subscriptionId) {
        // Check category subscriptions
        if (this.categorySubscriptions.has(subscriptionId)) {
            const subscription = this.categorySubscriptions.get(subscriptionId);
            subscription.handlers.forEach((handler, eventName) => {
                this.project.off(eventName, handler);
            });
            this.categorySubscriptions.delete(subscriptionId);
            return true;
        }

        // Check individual event subscriptions
        if (this.subscriptions.has(subscriptionId)) {
            const subscription = this.subscriptions.get(subscriptionId);
            subscription.handlers.forEach((handler, eventName) => {
                this.project.off(eventName, handler);
            });
            this.subscriptions.delete(subscriptionId);
            return true;
        }

        return false;
    }

    /**
     * Unsubscribe from all subscriptions
     */
    unsubscribeAll() {
        [...this.categorySubscriptions.keys()].forEach(id => this.unsubscribe(id));
        [...this.subscriptions.keys()].forEach(id => this.unsubscribe(id));
    }

    /**
     * Pause all subscriptions (events won't be emitted)
     */
    pause() {
        this.isActive = false;
    }

    /**
     * Resume all subscriptions
     */
    resume() {
        this.isActive = true;
    }

    /**
     * Get information about active subscriptions
     */
    getSubscriptionInfo() {
        return {
            categorySubscriptions: Array.from(this.categorySubscriptions.entries()).map(([id, sub]) => ({
                id,
                category: sub.category,
                eventCount: sub.handlers.size,
                createdAt: sub.createdAt,
                options: sub.options
            })),
            eventSubscriptions: Array.from(this.subscriptions.entries()).map(([id, sub]) => ({
                id,
                events: sub.events,
                createdAt: sub.createdAt,
                options: sub.options
            })),
            isActive: this.isActive,
            totalSubscriptions: this.categorySubscriptions.size + this.subscriptions.size
        };
    }

    /**
     * Internal method to determine if an event should be emitted based on options
     * @private
     */
    _shouldEmitEvent(data, options) {
        // Rate limiting
        if (options.rateLimit && options.rateLimit > 0) {
            const now = Date.now();
            const key = `${data.subscriptionId}_${data.eventName}`;

            if (!this._lastEmitted) this._lastEmitted = new Map();

            const lastEmitted = this._lastEmitted.get(key) || 0;
            if (now - lastEmitted < options.rateLimit) {
                return false;
            }

            this._lastEmitted.set(key, now);
        }

        // Frame number filtering
        if (options.frameFilter && data.frameNumber !== undefined) {
            if (options.frameFilter.only && !options.frameFilter.only.includes(data.frameNumber)) {
                return false;
            }
            if (options.frameFilter.skip && options.frameFilter.skip.includes(data.frameNumber)) {
                return false;
            }
            if (options.frameFilter.modulo && data.frameNumber % options.frameFilter.modulo !== 0) {
                return false;
            }
        }

        // Worker ID filtering
        if (options.workerFilter && data.workerId) {
            if (options.workerFilter.only && !options.workerFilter.only.includes(data.workerId)) {
                return false;
            }
            if (options.workerFilter.skip && options.workerFilter.skip.includes(data.workerId)) {
                return false;
            }
        }

        return true;
    }
}