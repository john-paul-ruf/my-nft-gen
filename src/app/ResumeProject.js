import {execFile} from "child_process";
import {RequestNewWorkerThread} from "../core/worker-threads/RequestNewWorkerThread.js";
import {SelectiveEventSubscriber} from "../core/events/SelectiveEventSubscriber.js";
import {WorkerEventCategories} from "../core/events/WorkerEventCategories.js";

export const ResumeProject = async (filename, eventSubscriptionOptions = {}) => {
    const {
        project,
        eventCategories = [],
        specificEvents = [],
        eventCallback,
        subscriptionOptions = {}
    } = eventSubscriptionOptions;

    if (project && eventCallback) {
        const subscriber = new SelectiveEventSubscriber(project);

        const subscriptionIds = [];

        if (eventCategories.length > 0) {
            const categoryIds = subscriber.subscribeToCategories(
                eventCategories,
                eventCallback,
                subscriptionOptions
            );
            subscriptionIds.push(...categoryIds);
        }

        if (specificEvents.length > 0) {
            const eventId = subscriber.subscribeToEvents(
                specificEvents,
                eventCallback,
                subscriptionOptions
            );
            subscriptionIds.push(eventId);
        }

        if (subscriptionIds.length === 0 && (eventCategories.length === 0 && specificEvents.length === 0)) {
            subscriber.subscribeToCategory(
                WorkerEventCategories.PROGRESS,
                eventCallback,
                subscriptionOptions
            );
        }

        const cleanup = () => {
            subscriber.unsubscribeAll();
        };

        process.on('exit', cleanup);
        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);

        // Start the worker thread with the project as event emitter
        await RequestNewWorkerThread(filename, project);

        return {
            subscriber,
            subscriptionIds,
            cleanup
        };
    }

    await RequestNewWorkerThread(filename);

    return null;
};