const test = require("ava");
const cache = require("./index");


test("keys test", t => {
    cache.clear();
    cache.put("key1", "val1");
    cache.put("key2", "val2");
    cache.put("key3", "val3");

    const keys = cache.keys();

    if(keys.length != 3) {
        t.fail();
    }
    
    if (!keys.includes("key1") || !keys.includes("key2") || !keys.includes("key3")) {
        t.fail();
    }

    t.pass();
});


test("undefined or null keys", t => {
    cache.clear();

    t.throws(() => {
        cache.put(null, "value");
    });

    t.throws(() => {
        cache.put(undefined, "value");
    });

    t.pass();
});

test("time input test", t => {
    cache.clear();
    
    t.throws(() => cache.put("key", "value", -1));
    t.throws(() => cache.put("key", "value", () => {}));
    t.throws(() => cache.put("key", "value", {}));

    t.pass();
});


test("timeoutCallback input test", t => {
    cache.clear();

    t.throws(() => cache.put("key", "value", 1, 1));
    t.throws(() => cache.put("key", "value", 1, 1.2));
    t.throws(() => cache.put("key", "value", 1, {}));
    t.pass();
});

test("get - increase misses", t => {
    cache.clear();

    cache.get("not-found-key");


    if (cache.misses() !== 1) {
        t.fail();
    }
    
    if (cache.hits() !== 0) {
        t.fail();
    }
    t.pass();
});

test("get - increase hits", t => {
    cache.clear();
    cache.put("key", "value");

    const record = cache.get("key");
    console.log("record=", record);
    if (cache.hits() !== 1) {
        t.fail();
    }

    if (cache.misses() !== 0) {
        t.fail();
    }
    
    if (record !== "value") {
        t.fail();
    }
    t.pass();
});

test("remove test", t => {
    cache.clear();

    cache.put("key", "value");

    let value = cache.remove("key");

    if (!value) {
        t.fail();
    }

    cache.remove("key");

    value = cache.remove("key");

    if (value) {
        t.fail();
    }
    
    t.pass();
});


test("export to json test", t => {
    cache.clear();

    const keyValuePairs = {
        key1 :"value1",
        key2 : 1,
        key3 : 1.2,
        key4 : { },
        key5: NaN
    };

    for (const kv of Object.entries(keyValuePairs)) {
        cache.put(kv[0], kv[1]);
    }

    const json = cache.exportJson();
    const object = JSON.parse(json);


    const keys = Object.keys(keyValuePairs);
    for (const key of Object.keys(object)) {
        if (!keys.includes(key)) {
            t.fail();
        }
    }

    t.pass();
});