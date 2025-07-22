// plugin-repo/EffectRepo.js
import fs   from 'fs';
import path from 'path';
import { EffectRegistry } from '../src/core/layer/EffectRegistry.js';

/**
 * Manages registration of effect plugins from local dirs and external packages.
 */
export class EffectRepo {
    static _instance = null;

    /**
     * @param {{ pluginDirs?: string[], packageNames?: string[] }} options
     */
    constructor(options = {}) {
        if (EffectRepo._instance) {
            return EffectRepo._instance;
        }
        // Local plugin directories (relative to project root)
        this.pluginDirs    = options.pluginDirs   || [path.resolve(process.cwd(), 'src/plugins')];
        // NPM package names exporting effect plugins
        this.packageNames  = options.packageNames || [];
        EffectRepo._instance = this;
    }

    /** @returns {EffectRepo} */
    static get instance() {
        if (!this._instance) this._instance = new EffectRepo();
        return this._instance;
    }

    /**
     * Add a local directory to scan for plugins.
     * @param {string} dirPath
     */
    addPluginDir(dirPath) {
        this.pluginDirs.push(path.resolve(process.cwd(), dirPath));
    }

    /**
     * Add an NPM package name to load plugins from.
     * @param {string} packageName
     */
    addPackage(packageName) {
        this.packageNames.push(packageName);
    }

    /**
     * Scan local dirs and external packages, dynamically import,
     * and register all effect classes with the EffectRegistry.
     */
    async registerAll() {
        // 1) Local directories
        for (const dir of this.pluginDirs) {
            let files;
            try {
                files = await fs.promises.readdir(dir);
            } catch {
                continue; // skip missing dirs
            }
            for (const file of files.filter(f => f.endsWith('.js'))) {
                const modulePath = path.join(dir, file);
                const pluginModule = await import(modulePath);
                if (typeof pluginModule.register === 'function') {
                    pluginModule.register(EffectRegistry.instance);
                } else if (pluginModule.default) {
                    const EffectClass = pluginModule.default;
                    const key = EffectClass._name_ || EffectClass.name;
                    EffectRegistry.instance.register(key, EffectClass);
                }
            }
        }

        // 2) NPM packages
        for (const pkgName of this.packageNames) {
            let pkgModule;
            try {
                pkgModule = await import(pkgName);
            } catch {
                continue; // skip missing packages
            }
            if (typeof pkgModule.register === 'function') {
                pkgModule.register(EffectRegistry.instance);
            } else if (pkgModule.default) {
                const exported = pkgModule.default;
                if (Array.isArray(exported)) {
                    for (const cls of exported) {
                        const key = cls._name_ || cls.name;
                        EffectRegistry.instance.register(key, cls);
                    }
                } else if (typeof exported === 'function') {
                    const key = exported._name_ || exported.name;
                    EffectRegistry.instance.register(key, exported);
                }
            }
        }
    }

    /**
     * Lookup an effect class by name.
     * @param {string} name
     * @returns {typeof BaseEffect|undefined}
     */
    get(name) {
        return EffectRegistry.instance.get(name);
    }
}
