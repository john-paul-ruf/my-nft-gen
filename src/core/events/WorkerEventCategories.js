export const WorkerEventCategories = {
    // Frame processing events
    FRAME: 'frame',
    // Effect processing events
    EFFECT: 'effect',
    // File I/O operations
    FILE_IO: 'fileIo',
    // Performance and timing
    PERFORMANCE: 'performance',
    // Memory and resource usage
    RESOURCE: 'resource',
    // Error and warning events
    ERROR: 'error',
    // Worker lifecycle events
    LIFECYCLE: 'lifecycle',
    // Progress and status updates
    PROGRESS: 'progress',
    // Video rendering events
    VIDEO: 'video'
};

export const WorkerEvents = {
    // Frame events
    FRAME_STARTED: 'frameStarted',
    FRAME_COMPLETED: 'frameCompleted',
    FRAME_FAILED: 'frameFailed',
    FRAME_SKIPPED: 'frameSkipped',

    // Effect events
    EFFECT_STARTED: 'effectStarted',
    EFFECT_COMPLETED: 'effectCompleted',
    EFFECT_FAILED: 'effectFailed',
    SECONDARY_EFFECT_APPLIED: 'secondaryEffectApplied',

    // File I/O events
    FILE_READ: 'fileRead',
    FILE_WRITE_STARTED: 'fileWriteStarted',
    FILE_WRITE_COMPLETED: 'fileWriteCompleted',
    FILE_DELETE: 'fileDelete',

    // Performance events
    TIMING_FRAME: 'timingFrame',
    TIMING_EFFECT: 'timingEffect',
    MEMORY_USAGE: 'memoryUsage',

    // Resource events
    BUFFER_ALLOCATED: 'bufferAllocated',
    BUFFER_FREED: 'bufferFreed',
    CANVAS_CREATED: 'canvasCreated',
    CANVAS_DESTROYED: 'canvasDestroyed',

    // Error events
    WORKER_ERROR: 'workerError',
    WORKER_WARNING: 'workerWarning',
    FATAL_ERROR: 'fatalError',

    // Lifecycle events
    WORKER_STARTED: 'workerStarted',
    WORKER_COMPLETED: 'workerCompleted',
    WORKER_TERMINATED: 'workerTerminated',
    
    // Process control events
    WORKER_KILL_REQUESTED: 'workerKillRequested',
    WORKER_KILLED: 'workerKilled',
    WORKER_KILL_FAILED: 'workerKillFailed',

    // Progress events
    BATCH_PROGRESS: 'batchProgress',
    OVERALL_PROGRESS: 'overallProgress',

    // Video rendering events
    MP4_RENDER_STARTED: 'mp4RenderStarted',
    MP4_RENDER_PROGRESS: 'mp4RenderProgress',
    MP4_RENDER_COMPLETED: 'mp4RenderCompleted',
    MP4_RENDER_FAILED: 'mp4RenderFailed'
};

// Map events to their categories
export const EventCategoryMap = {
    [WorkerEvents.FRAME_STARTED]: WorkerEventCategories.FRAME,
    [WorkerEvents.FRAME_COMPLETED]: WorkerEventCategories.FRAME,
    [WorkerEvents.FRAME_FAILED]: WorkerEventCategories.FRAME,
    [WorkerEvents.FRAME_SKIPPED]: WorkerEventCategories.FRAME,

    [WorkerEvents.EFFECT_STARTED]: WorkerEventCategories.EFFECT,
    [WorkerEvents.EFFECT_COMPLETED]: WorkerEventCategories.EFFECT,
    [WorkerEvents.EFFECT_FAILED]: WorkerEventCategories.EFFECT,
    [WorkerEvents.SECONDARY_EFFECT_APPLIED]: WorkerEventCategories.EFFECT,

    [WorkerEvents.FILE_READ]: WorkerEventCategories.FILE_IO,
    [WorkerEvents.FILE_WRITE_STARTED]: WorkerEventCategories.FILE_IO,
    [WorkerEvents.FILE_WRITE_COMPLETED]: WorkerEventCategories.FILE_IO,
    [WorkerEvents.FILE_DELETE]: WorkerEventCategories.FILE_IO,

    [WorkerEvents.TIMING_FRAME]: WorkerEventCategories.PERFORMANCE,
    [WorkerEvents.TIMING_EFFECT]: WorkerEventCategories.PERFORMANCE,
    [WorkerEvents.MEMORY_USAGE]: WorkerEventCategories.PERFORMANCE,

    [WorkerEvents.BUFFER_ALLOCATED]: WorkerEventCategories.RESOURCE,
    [WorkerEvents.BUFFER_FREED]: WorkerEventCategories.RESOURCE,
    [WorkerEvents.CANVAS_CREATED]: WorkerEventCategories.RESOURCE,
    [WorkerEvents.CANVAS_DESTROYED]: WorkerEventCategories.RESOURCE,

    [WorkerEvents.WORKER_ERROR]: WorkerEventCategories.ERROR,
    [WorkerEvents.WORKER_WARNING]: WorkerEventCategories.ERROR,
    [WorkerEvents.FATAL_ERROR]: WorkerEventCategories.ERROR,

    [WorkerEvents.WORKER_STARTED]: WorkerEventCategories.LIFECYCLE,
    [WorkerEvents.WORKER_COMPLETED]: WorkerEventCategories.LIFECYCLE,
    [WorkerEvents.WORKER_TERMINATED]: WorkerEventCategories.LIFECYCLE,
    [WorkerEvents.WORKER_KILL_REQUESTED]: WorkerEventCategories.LIFECYCLE,
    [WorkerEvents.WORKER_KILLED]: WorkerEventCategories.LIFECYCLE,
    [WorkerEvents.WORKER_KILL_FAILED]: WorkerEventCategories.LIFECYCLE,

    [WorkerEvents.BATCH_PROGRESS]: WorkerEventCategories.PROGRESS,
    [WorkerEvents.OVERALL_PROGRESS]: WorkerEventCategories.PROGRESS,

    [WorkerEvents.MP4_RENDER_STARTED]: WorkerEventCategories.VIDEO,
    [WorkerEvents.MP4_RENDER_PROGRESS]: WorkerEventCategories.VIDEO,
    [WorkerEvents.MP4_RENDER_COMPLETED]: WorkerEventCategories.VIDEO,
    [WorkerEvents.MP4_RENDER_FAILED]: WorkerEventCategories.VIDEO
};

/**
 * Get the category for a given event
 * @param {string} eventName - The event name
 * @returns {string|null} The category or null if not found
 */
export function getEventCategory(eventName) {
    return EventCategoryMap[eventName] || null;
}

/**
 * Get all events for a given category
 * @param {string} category - The category to filter by
 * @returns {string[]} Array of event names in that category
 */
export function getEventsInCategory(category) {
    return Object.entries(EventCategoryMap)
        .filter(([_, eventCategory]) => eventCategory === category)
        .map(([eventName]) => eventName);
}