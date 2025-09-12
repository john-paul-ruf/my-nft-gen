export class PositionRegistry {
    static globalRegistry = new PositionRegistry();
    
    constructor() {
        this.positions = new Map();
        this.metadata = new Map();
    }

    register(positionClass, metadata = {}) {
        if (!positionClass) {
            throw new Error('Position class is required');
        }

        if (!positionClass._name_) {
            throw new Error('Position class must have a static _name_ property');
        }

        const name = positionClass._name_;
        
        if (this.positions.has(name)) {
            throw new Error(`Position with name '${name}' is already registered`);
        }

        this.positions.set(name, positionClass);
        this.metadata.set(name, {
            description: metadata.description || '',
            version: metadata.version || '1.0.0',
            author: metadata.author || 'unknown',
            tags: metadata.tags || [],
            ...metadata
        });

        return this;
    }

    get(name) {
        return this.positions.get(name);
    }

    has(name) {
        return this.positions.has(name);
    }

    getAllPositions() {
        return Array.from(this.positions.entries()).map(([name, positionClass]) => ({
            name,
            positionClass,
            metadata: this.metadata.get(name)
        }));
    }

    getMetadata(name) {
        return this.metadata.get(name);
    }

    unregister(name) {
        const wasRegistered = this.positions.has(name);
        this.positions.delete(name);
        this.metadata.delete(name);
        return wasRegistered;
    }

    clear() {
        this.positions.clear();
        this.metadata.clear();
    }

    size() {
        return this.positions.size;
    }

    static registerGlobal(positionClass, metadata = {}) {
        return this.globalRegistry.register(positionClass, metadata);
    }

    static getGlobal(name) {
        return this.globalRegistry.get(name);
    }

    static hasGlobal(name) {
        return this.globalRegistry.has(name);
    }

    static getAllGlobal() {
        return this.globalRegistry.getAllPositions();
    }

    static clearGlobal() {
        this.globalRegistry.clear();
    }
}