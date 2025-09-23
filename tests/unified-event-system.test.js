import { globalEventBus, createProjectEventBus, createUIEventBus } from '../src/core/events/GlobalEventBus.js';
import { EventBusAdapter } from '../src/core/events/EventBusAdapter.js';
import { UnifiedWorkerEventEmitter } from '../src/core/events/UnifiedWorkerEventEmitter.js';

describe('Unified Event System', () => {
    beforeEach(() => {
        // Clear global bus before each test
        globalEventBus.clear();
        globalEventBus.projectInstances.clear();
        globalEventBus.uiComponents.clear();
        globalEventBus.workerProcesses.clear();
    });

    describe('GlobalEventBus', () => {
        test('should emit and receive events', (done) => {
            const testData = { message: 'test event' };
            
            globalEventBus.subscribe('testEvent', (data) => {
                expect(data).toEqual(testData);
                done();
            });

            globalEventBus.emit('testEvent', testData);
        });

        test('should register and communicate with projects', (done) => {
            const mockProject = {
                emit: jest.fn(),
                eventBus: {
                    emit: jest.fn()
                }
            };

            globalEventBus.registerProject('test-project', mockProject);
            
            // Verify project was registered
            expect(globalEventBus.projectInstances.has('test-project')).toBe(true);
            
            // Test broadcasting to projects
            globalEventBus.broadcastToProjects('testEvent', { data: 'test' });
            
            setTimeout(() => {
                expect(mockProject.emit).toHaveBeenCalledWith('testEvent', 
                    expect.objectContaining({ 
                        data: 'test',
                        sourceProject: 'test-project'
                    })
                );
                done();
            }, 10);
        });

        test('should register and communicate with UI components', (done) => {
            const mockComponent = {
                handleEvent: jest.fn()
            };

            globalEventBus.registerUIComponent('test-ui', mockComponent);
            
            // Verify component was registered
            expect(Array.from(globalEventBus.uiComponents).some(c => c.id === 'test-ui')).toBe(true);
            
            // Test broadcasting to UI
            globalEventBus.broadcastToUI('testEvent', { data: 'test' });
            
            setTimeout(() => {
                expect(mockComponent.handleEvent).toHaveBeenCalledWith('testEvent', { data: 'test' });
                done();
            }, 10);
        });

        test('should track event history and metrics', () => {
            globalEventBus.emit('testEvent1', { data: 1 });
            globalEventBus.emit('testEvent2', { data: 2 });
            globalEventBus.emit('testEvent1', { data: 3 });

            const metrics = globalEventBus.getMetrics();
            expect(metrics.totalEvents).toBe(3);
            expect(metrics.eventCounts.testEvent1).toBe(2);
            expect(metrics.eventCounts.testEvent2).toBe(1);

            const history = globalEventBus.getHistory();
            expect(history.length).toBe(3);
            expect(history[0].eventName).toBe('testEvent1');
            expect(history[1].eventName).toBe('testEvent2');
            expect(history[2].eventName).toBe('testEvent1');
        });
    });

    describe('Project Event Bus Integration', () => {
        test('should create project-specific event bus connected to global', (done) => {
            const projectBus = createProjectEventBus('test-project');
            
            // Subscribe to global bus
            globalEventBus.subscribe('projectEvent', (data) => {
                expect(data.message).toBe('from project');
                expect(data.sourceProject).toBe('test-project');
                done();
            });

            // Emit from project bus - should reach global bus
            projectBus.emitGlobal('projectEvent', { message: 'from project' });
        });

        test('should allow project to subscribe to global events', (done) => {
            const projectBus = createProjectEventBus('test-project');
            
            // Project subscribes to global events
            projectBus.subscribeToGlobal('globalEvent', (data) => {
                expect(data.message).toBe('from global');
                done();
            });

            // Emit from global bus
            globalEventBus.emit('globalEvent', { message: 'from global' });
        });
    });

    describe('UI Event Bus Integration', () => {
        test('should create UI-compatible event bus', (done) => {
            const uiBus = createUIEventBus('test-component');
            
            // Subscribe to event
            const unsubscribe = uiBus.subscribe('uiEvent', (data) => {
                expect(data.message).toBe('from ui');
                done();
            });

            // Emit event
            uiBus.emit('uiEvent', { message: 'from ui' });
        });

        test('should provide EventBusService-compatible API', (done) => {
            const adapter = new EventBusAdapter('test-adapter');
            
            // Use EventBusService-style API
            const unsubscribe = adapter.subscribe('adapterEvent', (payload, event) => {
                expect(payload.message).toBe('adapter test');
                expect(event.context.component).toBe('test-adapter');
                done();
            });

            adapter.emit('adapterEvent', { message: 'adapter test' });
        });
    });

    describe('Worker Event Integration', () => {
        test('should create worker emitter with global bus integration', () => {
            const workerEmitter = UnifiedWorkerEventEmitter.createWithGlobalBus('test-worker', globalEventBus);
            
            expect(workerEmitter.workerId).toBe('test-worker');
            expect(workerEmitter.options.mode).toBe('direct');
            expect(workerEmitter.options.globalBus).toBe(globalEventBus);
        });

        test('should emit worker events to global bus', (done) => {
            const workerEmitter = UnifiedWorkerEventEmitter.createWithGlobalBus('test-worker', globalEventBus);
            
            // Subscribe to worker events on global bus
            globalEventBus.subscribe('frameCompleted', (data) => {
                expect(data.frameNumber).toBe(42);
                expect(data.workerId).toBe('test-worker');
                expect(data.workerEvent).toBe(true);
                done();
            });

            // Emit frame completed event
            workerEmitter.emitFrameCompleted(42, 100, 1500, '/path/to/frame.png');
        });

        test('should allow worker to subscribe to global events', (done) => {
            const workerEmitter = UnifiedWorkerEventEmitter.createWithGlobalBus('test-worker', globalEventBus);
            
            // Worker subscribes to global events
            workerEmitter.subscribeToGlobal('pauseProcessing', (data) => {
                expect(data.reason).toBe('user-request');
                done();
            });

            // Emit pause event from global bus
            globalEventBus.emit('pauseProcessing', { reason: 'user-request' });
        });
    });

    describe('Cross-System Communication', () => {
        test('should enable UI to communicate with workers', (done) => {
            // Set up UI component
            const uiBus = createUIEventBus('effects-panel');
            
            // Set up worker
            const workerEmitter = UnifiedWorkerEventEmitter.createWithGlobalBus('frame-worker', globalEventBus);
            
            // Worker subscribes to UI commands
            workerEmitter.subscribeToGlobal('pauseProcessing', (data) => {
                expect(data.source).toBe('effects-panel');
                expect(data.reason).toBe('user-clicked-pause');
                done();
            });

            // UI emits pause command
            uiBus.emit('pauseProcessing', { 
                reason: 'user-clicked-pause',
                source: 'effects-panel'
            });
        });

        test('should enable workers to update UI', (done) => {
            // Set up UI component
            const uiBus = createUIEventBus('progress-bar');
            
            // Set up worker
            const workerEmitter = UnifiedWorkerEventEmitter.createWithGlobalBus('frame-worker', globalEventBus);
            
            // UI subscribes to worker progress
            uiBus.subscribe('worker:progress', (data) => {
                expect(data.workerId).toBe('frame-worker');
                expect(data.progress).toBe(0.42);
                done();
            });

            // Worker emits progress
            workerEmitter.emitFrameCompleted(42, 100, 1500, '/path/to/frame.png');
        });
    });

    describe('Event Routing and Filtering', () => {
        test('should route events based on rules', (done) => {
            const mockProject = { emit: jest.fn() };
            globalEventBus.registerProject('target-project', mockProject);

            // Add routing rule
            globalEventBus.addRoutingRule('routedEvent', 
                (data) => data.shouldRoute === true,
                'project:target-project'
            );

            // Emit event that should be routed
            globalEventBus.emit('routedEvent', { shouldRoute: true, message: 'routed' });

            setTimeout(() => {
                expect(mockProject.emit).toHaveBeenCalledWith('routedEvent', 
                    expect.objectContaining({ shouldRoute: true, message: 'routed' })
                );
                done();
            }, 10);
        });

        test('should filter events based on filters', () => {
            let eventReceived = false;
            
            // Add filter that blocks all events
            globalEventBus.addEventFilter('filteredEvent', () => false);
            
            // Subscribe to event
            globalEventBus.subscribe('filteredEvent', () => {
                eventReceived = true;
            });

            // Emit event - should be filtered out
            globalEventBus.emit('filteredEvent', { data: 'test' });

            // Event should not have been received
            expect(eventReceived).toBe(false);
        });
    });

    describe('System Status and Debugging', () => {
        test('should provide comprehensive system status', () => {
            // Register components
            globalEventBus.registerProject('project-1', { emit: jest.fn() });
            globalEventBus.registerUIComponent('ui-1', { handleEvent: jest.fn() });
            globalEventBus.registerWorker('worker-1', { send: jest.fn() });

            // Emit some events
            globalEventBus.emit('event1', {});
            globalEventBus.emit('event2', {});

            const status = globalEventBus.getSystemStatus();
            
            expect(status.projects).toContain('project-1');
            expect(status.uiComponents).toContain('ui-1');
            expect(status.workers).toContain('worker-1');
            expect(status.totalEvents).toBe(2);
            expect(status.historySize).toBe(2);
        });
    });
});