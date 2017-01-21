const Memcached  = require('memcached');


var docCache = new Memcached('localhost:11211', {});


export function docCacheGet(prefix, url) {
    return new Promise(function (resolve, reject) {
        docCache.get(`${prefix}.${url}`, function (err, data) {
            resolve(data);
        });
    });
}


export function docCacheSet(prefix, url, doc) {
    return new Promise(function (resolve, reject) {
        docCache.set(`${prefix}.${url}`, doc, 3600, function (err) {
            resolve();
        });
    });
}
