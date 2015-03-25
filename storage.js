(function (window) {

    "use strict";

    var Classes = require('js-ext/extra/classes.js'),
        createHashMap = require('js-ext/extra/hashmap.js').createMap,
        DB = require('client-db'),
        GLOBAL_DATABASE = '_globalStorage_',
        TABLE_NAME = 't',
        KEY_NAME = 'k',
        VALUE_NAME = 'v',
        EMPTY_NS = GLOBAL_DATABASE,
        TABLE_DEF = [
            {
                name: TABLE_NAME,
                uniqueIndexes: [KEY_NAME]
            }
        ],
        ClientStorage;

    window._ITSAmodules || Object.protectedProp(window, '_ITSAmodules', createHashMap());
/*jshint boss:true */
    if (ClientStorage=window._ITSAmodules.ClientStorage) {
/*jshint boss:false */
        module.exports = ClientStorage; // LocalStorage was already created
    }


    ClientStorage = Classes.createClass(function(namespace) {
        ((typeof namespace==='string') && (namespace.length>0)) || (namespace=EMPTY_NS);
        this.db = new DB(namespace, 1, TABLE_DEF);
    }, {
        each: function(fn, context) {
            var wrapperFn = function(item) {
                return fn.call(this, item.v);
            };
            return this.db.each(TABLE_NAME, wrapperFn, context);
        },
        some: function(fn, context) {
            var wrapperFn = function(item) {
                return fn.call(this, item.v);
            };
            return this.db.some(TABLE_NAME, wrapperFn, context).then(
                function(record) {
                    if (record) {
                        return record.v;
                    }
                }
            );
        },
        clear: function() {
            return this.db.clear(TABLE_NAME);
        },
        has: function(key) {
            return this.db.has(TABLE_NAME, KEY_NAME, key);
        },
        contains: function(obj) {
            return this.some(function(item) {
                return item.sameValue(obj);
            }).then(function(record) {
                return !!record;
            });
        },
        get: function(key) {
            return this.db.read(TABLE_NAME, KEY_NAME, key).then(
                function(returnObject) {
                    if (returnObject) {
                        return returnObject.v;
                    }
                }
            );
        },
        set: function(key, obj) {
            var saveObject = {};
            saveObject[KEY_NAME] = key;
            saveObject[VALUE_NAME] = obj;
            return this.db.save(TABLE_NAME, saveObject, true);
        },
        size: function() {
            return this.db.size(TABLE_NAME);
        },
        'delete': function(key) {
            return this.db['delete'](TABLE_NAME, KEY_NAME, key);
        },
        deleteStorage: function() {
            return this.db.deleteDatabase();
        }
    });

    module.exports = ClientStorage;


}(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this));