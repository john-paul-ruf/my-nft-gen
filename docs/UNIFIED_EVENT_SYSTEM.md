# Unified Event System - Single Source of Truth

## Overview

The Unified Event System provides a **single source of truth** for all events across the entire NFT generation ecosystem, including:

- **Core processing events** (my-nft-gen)
- **UI events** (nft-studio)
- **Worker thread events**
- **Cross-project communication**

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GlobalEventBus                           │
│                (Single Source of Truth)                     │
├─────────────────────────────────────────────────────────────┤
│  • Event routing & filtering                                │
│  • Cross-project communication                              │
│  • Metrics & debugging                                      │
│  • Event history & replay                                   │
└─────────────────┬───────────────┬───────────────┬───────────┘
                  │               │               │
        ┌─────────▼─────────┐ ┌───▼────────┐ ┌───▼──────────┐
        │  Project Events   │ │ UI Events  │ │Worker Events │
        │  (my-nft-gen)     │ │(nft-studio)│ │  (Threads)   │
        └───────────────────┘ └────────────┘ └──────────────┘
```

## Components

### 1. GlobalEventBus (`src/core/events/GlobalEventBus.js`)

The central event hub that unifies all event systems.

**Key Features:**
- Extends `UnifiedEventBus` with cross-project capabilities
- Automatic event routing between projects, UI, and workers
- Event filtering and transformation
- Comprehensive metrics and debugging

**Usage:**
```javascript
import { globalEventBus } from '../core/events/GlobalEventBus.js';

// Register components
globalEventBus.registerProject('my-project', projectInstance);
globalEventBus.registerUIComponent('effects-panel', componentInstance);
globalEventBus.registerWorker('worker-1', workerProcess);

// Subscribe to events
const unsubscribe = globalEventBus.subscribe('frameCompleted', (data) => {
    console.log('Frame completed:', data);
});

// Emit events
globalEventBus.emit('userAction', { action: 'deleteEffect', effectId: 123 });
```

### 2. EventBusAdapter (`src/core/events/EventBusAdapter.js`)

Compatibility layer for migrating from the old `EventBusService`.

**Purpose:**
- Provides the same API as the old `EventBusService`
- Routes all events through `GlobalEventBus`
- Enables gradual migration without breaking existing code

**Usage:**
```javascript
import EventBusService from '../core/events/EventBusAdapter.js';

// Same API as before, but now unified!
const unsubscribe = EventBusService.subscribe('effectDeleted', handler);
EventBusService.emit('effectDeleted', { effectId: 123 });
```

### 3. UnifiedWorkerEventEmitter (`src/core/events/UnifiedWorkerEventEmitter.js`)

Enhanced worker event emitter with global bus integration.

**Modes:**
- **stdout**: Traditional JSON output to stdout (for child processes)
- **direct**: Direct emission to global bus (for same-process workers)
- **hybrid**: Both stdout and direct emission

**Usage:**
```javascript
import { UnifiedWorkerEventEmitter } from '../core/events/UnifiedWorkerEventEmitter.js';

// Create worker emitter connected to global bus
const emitter = UnifiedWorkerEventEmitter.createWithGlobalBus('worker-1', globalEventBus);

// Emit events (automatically routed to global bus)
emitter.emitFrameCompleted(42, 100, 1500, '/path/to/frame.png');

// Subscribe to global events from within worker
emitter.subscribeToGlobal('pauseProcessing', () => {
    // Handle pause request from UI
});
```

## Migration Guide

### From EventBusService (nft-studio)

**Before:**
```javascript
import EventBusService from '../services/EventBusService.js';

const unsubscribe = EventBusService.subscribe('effectDeleted', handler);
EventBusService.emit('effectDeleted', data);
```

**After (Option 1 - Drop-in replacement):**
```javascript
import EventBusService from '../../../my-nft-gen/src/core/events/EventBusAdapter.js';

// Same code works! Now unified with global bus
const unsubscribe = EventBusService.subscribe('effectDeleted', handler);
EventBusService.emit('effectDeleted', data);
```

**After (Option 2 - Direct global bus):**
```javascript
import { createUIEventBus } from '../../../my-nft-gen/src/core/events/GlobalEventBus.js';

const eventBus = createUIEventBus('effects-panel');
const unsubscribe = eventBus.subscribe('effectDeleted', handler);
eventBus.emit('effectDeleted', data);
```

### From Project EventEmitter (my-nft-gen)

**Before:**
```javascript
project.on('frameCompleted', handler);
project.emit('frameCompleted', data);
```

**After:**
```javascript
// Same API still works! Now connected to global bus
project.on('frameCompleted', handler);
project.emit('frameCompleted', data);

// Plus new global capabilities
project.emitGlobal('frameCompleted', data); // Broadcast to all systems
project.subscribeToGlobal('pauseProcessing', handler); // Listen to UI events
```

## Event Categories

### Core Events (my-nft-gen)
- `frameStarted`, `frameCompleted`, `frameFailed`
- `effectStarted`, `effectCompleted`, `effectFailed`
- `primaryEffectAdded`, `primaryEffectRemoved`
- `generationStarted`, `generationCompleted`

### UI Events (nft-studio)
- `effectDeleted`, `effectAdded`, `effectModified`
- `keyframeDeleted`, `keyframeAdded`
- `secondaryEffectDeleted`, `secondaryEffectAdded`
- `userAction`, `uiStateChanged`

### Worker Events
- `worker:progress`, `worker:error`, `worker:lifecycle`
- `bufferAllocated`, `bufferFreed`
- `memoryUsage`, `timingFrame`

### Cross-System Events
- `system:pause`, `system:resume`, `system:shutdown`
- `project:switched`, `project:loaded`
- `ui:connected`, `ui:disconnected`

## Advanced Features

### Event Routing Rules

Automatically route events between systems:

```javascript
// Route all UI delete events to core processing
globalEventBus.addRoutingRule('effectDeleted', 
    (data) => data.source === 'ui',
    'projects'
);

// Route worker errors to UI for display
globalEventBus.addRoutingRule('worker:error',
    (data) => data.severity === 'high',
    'ui'
);
```

### Event Filtering

Filter events before emission:

```javascript
// Only emit progress events every 100ms
globalEventBus.addEventFilter('worker:progress', (data) => {
    const now = Date.now();
    const lastEmit = this.lastProgressEmit || 0;
    if (now - lastEmit < 100) return false;
    this.lastProgressEmit = now;
    return true;
});
```

### Cross-Project Communication

```javascript
// From nft-studio UI
eventBus.emit('pauseProcessing', { reason: 'user-request' });

// Automatically routed to my-nft-gen workers
// Workers receive the event and can pause processing
```

### Event History & Debugging

```javascript
// Get comprehensive system status
const status = globalEventBus.getSystemStatus();
console.log('Connected projects:', status.projects);
console.log('Active UI components:', status.uiComponents);
console.log('Worker processes:', status.workers);

// Get event history for debugging
const recentEvents = globalEventBus.getHistory(50);
console.log('Recent events:', recentEvents);

// Replay events for testing
globalEventBus.replayEvents(recentEvents.slice(-10));
```

## Benefits

### ✅ Single Source of Truth
- All events flow through one central system
- No more isolated event systems
- Consistent event handling across projects

### ✅ Cross-Project Communication
- UI can directly communicate with core processing
- Workers can receive commands from UI
- Real-time synchronization between systems

### ✅ Enhanced Debugging
- Centralized event history
- Comprehensive metrics
- Event replay capabilities
- System-wide event monitoring

### ✅ Backward Compatibility
- Existing code continues to work
- Gradual migration path
- No breaking changes

### ✅ Scalability
- Easy to add new event sources
- Flexible routing and filtering
- Performance monitoring built-in

## Best Practices

### 1. Use Descriptive Event Names
```javascript
// Good
eventBus.emit('effect:keyframe:deleted', { effectId, keyframeId });

// Bad
eventBus.emit('deleted', { id });
```

### 2. Include Context in Event Data
```javascript
eventBus.emit('frameCompleted', {
    frameNumber: 42,
    totalFrames: 100,
    projectId: 'my-project',
    workerId: 'worker-1',
    timestamp: Date.now()
});
```

### 3. Use Categories for Bulk Operations
```javascript
// Subscribe to all frame events
const unsubscribe = globalEventBus.subscribeToCategory('frame', handler);
```

### 4. Clean Up Subscriptions
```javascript
// Always unsubscribe when components unmount
useEffect(() => {
    const unsubscribe = eventBus.subscribe('frameCompleted', handler);
    return unsubscribe; // Cleanup
}, []);
```

### 5. Use Global Events Sparingly
```javascript
// Use project-local events for internal communication
project.emit('internalStateChanged', data);

// Use global events for cross-system communication
project.emitGlobal('processingPaused', data);
```

## Troubleshooting

### Events Not Received
1. Check if components are registered with global bus
2. Verify event names match exactly
3. Check if event filters are blocking events
4. Enable debug logging: `globalEventBus.options.enableDebug = true`

### Performance Issues
1. Check event emission frequency
2. Use event filters to reduce noise
3. Monitor metrics: `globalEventBus.getMetrics()`
4. Consider using categories instead of individual events

### Memory Leaks
1. Always unsubscribe from events
2. Check event history size: `globalEventBus.getHistory().length`
3. Clear history periodically: `globalEventBus.clear()`
4. Monitor connected emitters: `globalEventBus.connectedEmitters.size`

## Future Enhancements

- **Event persistence**: Save/load event history
- **Remote events**: WebSocket-based cross-machine communication
- **Event validation**: Schema validation for event data
- **Performance analytics**: Detailed event timing analysis
- **Visual debugging**: Event flow visualization tools