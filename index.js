class Cache {
    constructor() {
        this._cache = Object.create({});
        this._hitCount = 0;
        this._missCount = 0;
        this._size = 0;
    }

    keys() {
        return Object.keys(this._cache);
    }
    
    get(key) {
        if(this._cache.hasOwnProperty(key)) {
            const record = this._cache[key];
            if(isNaN(record.expire) || record.expire >= Date.now()) {
                this._hitCount++;
                return record.value;
            } else {
                this._missCount++;
                this._size--;
                delete this._cache[key];
            }
        } else {
            this._missCount++; 
        }
        return null;
    }

    put(key, value, time = null, timeoutCallback = null) {
        if (key === null || key === undefined) {
            throw new Error("Key must not be a null or undefined value.");
        }

        if (time !== null && typeof time !== "number") {
            throw new Error("Time must be a number.");
        }

        if (time !== null && typeof time === "number" && time <= 0 ) {
            throw new Error("Time must be a positive number.");
        }

        if(timeoutCallback != null && typeof timeoutCallback !== "function") {
            throw new Error("Timecallback must be a function.");
        }

        if (this._cache.hasOwnProperty(key)) {
            clearTimeout(this._cache[key].timeout);
        }

        const record = {
            value: value,
            expire: Date.now() + time
        };

        if (!isNaN(record.expire)) {
            const self = this;
            record.timeout = setTimeout(() => {
                self.remove(key);
                if (timeoutCallback) {
                    timeoutCallback(key, value);
                }
            }, time);
        }
    
        this._cache[key] = record;
        this._size++;

        return record;
    }
    
    remove(key) {
        let canDelete = true;
        const record = this._cache[key];

        if(record) {
            clearTimeout(record.timeout);
            if(!isNaN(record.expire) && record.expire < Date.now()) {
                canDelete = false;
            }
        } else {
            canDelete = false;
        }
        
        if (canDelete) {
            delete this._cache[key];
            this._size--;
        }
        
        return canDelete;
    }

    clear() {
        for(const key of Object.keys(this._cache)) {
            clearTimeout(this._cache[key].timeout);
            delete this._cache[key];
        }
        this._cache = Object.create({});
        this._size = 0;
        this._hitCount = 0;
        this._missCount = 0;
    }

    size() {
        return this._size;
    }

    hits() {
        return this._hitCount;
    }

    misses() {
        return this._missCount;
    }


    exportJson() {
        const jsonObj = {};

        for(const key of this.keys()) {
            const record = this._cache[key];
            jsonObj[key] = {
                value: record.value,
                expire: record.expire || "NaN"
            };
        }

        return JSON.stringify(jsonObj);
    }
}

module.exports = new Cache();
module.exports.Cache = Cache;