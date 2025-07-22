export class EffectRegistry {
    static _instance = null;

    constructor() {
        if (EffectRegistry._instance) {
            return EffectRegistry._instance;
        }
        this._map = new Map();
        EffectRegistry._instance = this;
    }

    /** @returns {EffectRegistry} */
    static get instance() {
        return EffectRegistry._instance || new EffectRegistry();
    }

    /**
     * Register an effect class under a key.
     * @param {string} name
     * @param {typeof BaseEffect} effectClass
     */
    register(name, effectClass) {
        this._map.set(name, effectClass);
    }

    /**
     * Get a registered effect class by name.
     * @param {string} name
     * @returns {typeof BaseEffect|undefined}
     */
    get(name) {
        return this._map.get(name);
    }
}
