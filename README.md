# cache

> A simple in-memory cache for Node.js

## Install

```bash
npm install @aprodan/cache
```

## Usage

```js
const cache = require('@aprodan/cache');

cache.put('key', 'value');

const val = cache.get('key')

console.log('val=', val); // => val='value'
```

## API

### get(key)

* Retrieves a value for a given key
* If there is not existing an record for the given key, there will be returned null.

### put(key, value, time = null, timeoutCallback = null)

* Stores a value in the cache
* If time is passed, then it will be stored temporarly for that given amount of time (seconds)
* An optional timeout callback function could be provided, that will run after the entry has expired

### keys()

* Returns keys that are stored in cache.

### remove(key)

* Removes the record stored at the given key.

### clear()

* Removes all the records stored in the cache, and resets it.

### size()

* Returns current number of records stored in the cache.

### hits()

* Returns total number of cache hits.

### misses()

* Returns total number of cache misses.

### exportJson()

* Returns a JSON string representing all the cache data.