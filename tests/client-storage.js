/*global describe, it, before, after, afterEach, beforeEach */
/*jshint unused:false */
(function (window) {

"use strict";

require('js-ext/js-ext.js');

var chai = require('chai'),
    expect = chai.expect,
    should = chai.should(),
    ClientStorage = require('../storage.js'),
    NAMESPACE = 'test';

chai.use(require('chai-as-promised'));


describe('clientStorage.set', function () {

    after(function(done) {
        var db = new ClientStorage(NAMESPACE);
        db.deleteStorage().finally(function() {
            done();
        });
    });

    it('Saving record', function () {
        var db = new ClientStorage(NAMESPACE);
        return db.set('president1', {name: 'Barack', lastName: 'Obama', 'birth': 1961}).should.be.fulfilled;
    });

});

describe('clientStorage.get and check overwrite', function () {

    before(function(done) {
        var db, hash = [], prevErrorHandler;
        // NOTE: db.set() double unique index will cause an error caught by Mocha, even if it was handled
        // by the promise. Therefore we temporarely suppress mocha's general errorhandling and reset it afterwards:
        prevErrorHandler = window.onerror;
        window.onerror = function(){return true;};
        db = new ClientStorage(NAMESPACE);
        hash.push(db.set('president1', {name: 'Barack', lastName: 'Obama', 'birth': 1961}));
        hash.push(db.set('president2', {name: 'John F.', lastName: 'Kennedy', 'birth': 1917}));
        hash.push(db.set('president2', {name: 'John F.', lastName: 'Kennedy another', 'birth': 1917}));
        hash.push(db.set('president3', {name: 'Bill', lastName: 'Clinton', 'birth': 1946}));
        window.Promise.finishAll(hash).finally(function() {
            window.onerror = prevErrorHandler;
            done();
        });
    });

    after(function(done) {
        var db = new ClientStorage(NAMESPACE);
        db.deleteStorage().finally(function() {
            done();
        });
    });

    it('Get record', function () {
        var db = new ClientStorage(NAMESPACE);
        return db.get('president1').should.become({name: 'Barack', lastName: 'Obama', 'birth': 1961});
    });

    it('Get overwritten record', function () {
        var db = new ClientStorage(NAMESPACE);
db.get('president2').then(function(obj) {
    console.warn(obj);
});
        return db.get('president2').should.become({name: 'John F.', lastName: 'Kennedy another', 'birth': 1917});
    });

    it('Get undefined key', function () {
        var db = new ClientStorage(NAMESPACE);
        return db.get('presidentX').should.become(undefined);
    });

    it('Read size', function () {
        var db = new ClientStorage(NAMESPACE);
        return db.size().should.become(3);
    });

});

describe('clientStorage.delete', function () {

    beforeEach(function(done) {
        var db = new ClientStorage(NAMESPACE),
            hash = [];
        hash.push(db.set('president1', {name: 'Barack', lastName: 'Obama', 'birth': 1961}));
        hash.push(db.set('president2', {name: 'John F.', lastName: 'Kennedy', 'birth': 1917}));
        hash.push(db.set('president3', {name: 'John F.', lastName: 'Kennedy another', 'birth': 1917}));
        hash.push(db.set('president4', {name: 'Bill', lastName: 'Clinton', 'birth': 1946}));
        window.Promise.finishAll(hash).finally(function() {
            done();
        });
    });

    afterEach(function(done) {
        var db = new ClientStorage(NAMESPACE);
        db.deleteStorage().finally(function() {
            done();
        });
    });

    it('delete one valid item check size', function () {
        var db = new ClientStorage(NAMESPACE);
        return db.delete('president2').then(function() {
            return db.size().should.become(3);
        });
    });

    it('delete one valid item check item', function () {
        var db = new ClientStorage(NAMESPACE);
        return db.delete('president3').then(function() {
            return db.get('president3').should.become(undefined);
        });
    });

    it('delete one valid item that is not present', function () {
        var db = new ClientStorage(NAMESPACE);
        return db.delete('presidentX').then(function() {
            return db.size().should.become(4);
        });
    });

});

describe('Other methods', function () {

    beforeEach(function(done) {
        var db = new ClientStorage(NAMESPACE),
            hash = [];
        hash.push(db.set('president1', {name: 'Barack', lastName: 'Obama', 'birth': 1961}));
        hash.push(db.set('president2', {name: 'John F.', lastName: 'Kennedy', 'birth': 1917}));
        hash.push(db.set('president3', {name: 'John F.', lastName: 'Kennedy another', 'birth': 1917}));
        hash.push(db.set('president4', {name: 'Bill', lastName: 'Clinton', 'birth': 1946}));
        window.Promise.finishAll(hash).finally(function() {
            done();
        });
    });

    afterEach(function(done) {
        var db = new ClientStorage(NAMESPACE);
        db.deleteStorage().finally(function() {
            done();
        });
    });

    it('clear', function () {
        var db = new ClientStorage(NAMESPACE);
        return db.clear().finally(function() {
            return db.size().should.become(0);
        });
    });

    it('each', function (done) {
        var db = new ClientStorage(NAMESPACE),
            years = 0;
        db.each(function(record) {
            years += record.birth;
        }).finally(function() {
            expect(years).to.be.equal(7741);
            done();
        }).catch(function(err) {
            done(err);
        });
    });

    it('some', function (done) {
        var db = new ClientStorage(NAMESPACE),
            years = 0;
        db.some(function(record) {
            years += record.birth;
            return (record.birth===1917);
        }).finally(function(record) {
            expect(years).to.be.equal(3878);
            done();
        }).catch(function(err) {
            done(err);
        });
    });

    it('has when true', function () {
        var db = new ClientStorage(NAMESPACE);
        return db.has('president1').should.become(true);
    });

    it('has when false', function () {
        var db = new ClientStorage(NAMESPACE);
        return db.has('presidentX').should.become(false);
    });

    it('contains when true', function () {
        var db = new ClientStorage(NAMESPACE);
        return db.contains({name: 'Bill', lastName: 'Clinton', 'birth': 1946}).should.become(true);
    });

    it('contains when false', function () {
        var db = new ClientStorage(NAMESPACE);
        return db.has({name: 'Bill', lastName: 'Clinton', 'birth': 1900}).should.become(false);
    });

    it('size', function () {
        var db = new ClientStorage(NAMESPACE);
        return db.size().should.become(4);
    });

});

}(global.window || require('node-win')));