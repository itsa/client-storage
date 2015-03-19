"use strict";

var Classes = require('js-ext/extra/classes.js'),
    DB = require('client-db'),
    EMPTY_NS = '_global',

    ClientStorage = Classes.createClass(function(namespace, localstorage) {
        ((typeof namespace==='string') && (namespace.length>0)) || (namespace=EMPTY_NS);
        this.db = new DB(namespace, localstorage);
    }, {
        each: function(fn, context) {
            return this.db.each(fn, context);
        },
        some: function(fn, context) {
            return this.db.each(fn, context);
        },
        clear: function() {
            return this.db.clear();
        },
        has: function(key) {
            return this.db.has();
        },
        contains: function(obj) {

        },
        get: function(key) {
            return this.db.getRecord(key);
        },
        set: function(key, obj) {
            return this.db.save(key, obj);
        },
        size: function() {
            return this.db.size();
        },
        'delete': function(key) {
            return this.db['delete'](key);
        },
        destroy: function() {
            this.db.destroy();
        }
    });

module.exports = ClientStorage;