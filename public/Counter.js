export default class Counter {
    constructor(label, storageKey = null, base = 0) {
        this.base = base;
        this.label = label;
        this.count = 0;
        this.listeners = [];

        this.storageKey = storageKey;
        if (storageKey) {
            const saved = localStorage.getItem(storageKey);
            if (saved !== null) this.count = Number(saved);
        }
    }
    async loadFromFile(file, success) {
        try {
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();

            this.label = result.label ?? this.label;
            let b=result.base*1;
            if (typeof b !== "number") {
                throw new Error("Invalid base value");
            }
            this.count = Number(b) || 0;
            this.base=b;
            if (success) {
                success.call(this);
            } else {
                this.save();
                this.notify();
            }
        } catch (err) {
            console.error("loadFromFile error:", err);
            throw err;
        }
    }

    increment() {
        this.count++;
        this.save();
        this.notify();
    }

    reset() {
        this.count = 0;
        this.save();
        this.notify();
    }
    toBase(){
        this.count=this.base;
        this.save();
        this.notify();
    }
    onChange(cb) {
        this.listeners.push(cb);
    }
    offChange(cb) {
        this.listeners = this.listeners.filter(l => l !== cb);
    }

    notify() {
        this.listeners.forEach(cb => cb(this));
    }

    save() {
        if (this.storageKey) {
            localStorage.setItem(this.storageKey, this.count);
        }
    }

    getCount() {
        return this.count;
    }
}
