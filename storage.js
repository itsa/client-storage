/**
 * Creating floating Panel-nodes which can be shown and hidden.
 *
 *
 * <i>Copyright (c) 2014 ITSA - https://github.com/itsa</i>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 *
 * @module client-storage
 * @class Storage
 * @since 0.0.1
*/

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
        /**
         * Performs a function to all the records of the storage
         *
         * @method each
         * @param fn {Function}
         * @param context {Object}
         * @return {Promise} Returnvalue of the fulfilled promise is undefined
         * @since 0.0.1
         */
        each: function(fn, context) {
            var wrapperFn = function(item) {
                return fn.call(this, item.v);
            };
            return this.db.each(TABLE_NAME, wrapperFn, context);
        },
        /**
         * Performs a function to some the records of the storage.
         * If the invoked function returns a trutthy value, the loop ends.
         *
         * @method some
         * @param fn {Function}
         * @param context {Object}
         * @return {Promise} Returnvalue of the fulfilled promise is undefined
         * @since 0.0.1
         */
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
        /**
         * Empties the table.
         *
         * @method clear
         * @return {Promise} Returnvalue of the fulfilled promise is undefined
         * @since 0.0.1
         */
        clear: function() {
            return this.db.clear(TABLE_NAME);
        },
        /**
         * Checks whether a table has a matched record, specified by `key`
         *
         * @method has
         * @param key {String}
         * @return {Promise} Returnvalue of the fulfilled promise is a boolean specifying whether the table has a matched record
         * @since 0.0.1
         */
        has: function(key) {
            return this.db.has(TABLE_NAME, KEY_NAME, key);
        },
        /**
         * Checks whether a table has a containes a specified record, not by reference, by by checking its property-values
         *
         * @method contains
         * @param obj {Object}
         * @return {Promise} Returnvalue of the fulfilled promise is a boolean specifying whether the table has a matched record
         * @since 0.0.1
         */
        contains: function(obj) {
            return this.some(function(item) {
                return item.sameValue(obj);
            }).then(function(record) {
                return !!record;
            });
        },
        /**
         * Reads one record, specified by its `key`.
         *
         * @method get
         * @param key {String}
         * @return {Promise} Returnvalue of the fulfilled promise is an Object (record)
         * @since 0.0.1
         */
        get: function(key) {
            return this.db.read(TABLE_NAME, KEY_NAME, key).then(
                function(returnObject) {
                    if (returnObject) {
                        return returnObject.v;
                    }
                }
            );
        },
        /**
         * Saves a record. Returns an undefined promise when ready.
         *
         * @method set
         * @param key {String}
         * @param obj {Object}
         * @return {Promise} Returnvalue of the fulfilled promise is undefined
         * @since 0.0.1
         */
        set: function(key, obj) {
            var saveObject = {};
            saveObject[KEY_NAME] = key;
            saveObject[VALUE_NAME] = obj;
            return this.db.save(TABLE_NAME, saveObject, true);
        },
        /**
         * Gets the number of records
         *
         * @method size
         * @return {Promise} Returnvalue of the fulfilled promise is a number
         * @since 0.0.1
         */
        size: function() {
            return this.db.size(TABLE_NAME);
        },
        /**
         * Deletes a from the the storgae, specified by `key`
         *
         * @method delete
         * @param key {String}
         * @return {Promise} Returnvalue of the fulfilled promise is an AObject of record that has been deleted
         * @since 0.0.1
         */
        'delete': function(key) {
            return this.db['delete'](TABLE_NAME, KEY_NAME, key);
        },
        /**
         * Deletes a storage from the client
         *
         * @method deleteStorage
         * @return {Promise} Returnvalue of the fulfilled promise is undefined
         * @since 0.0.1
         */
        deleteStorage: function() {
            return this.db.deleteDatabase();
        }
    });

    module.exports = ClientStorage;


}(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this));