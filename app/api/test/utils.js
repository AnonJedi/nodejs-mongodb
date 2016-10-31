'use strict';


// var dbUrl = `mongodb://${process.env.DATABASE_USER}:${process.env.MONGODB_PASS}@localhost:27017/test`;
var dbUrl = 'mongodb://bb-user:bestpassword@localhost:27017/test';
var mongoose = require('mongoose');


mongoose.Promise = global.Promise;

process.env.NODE_ENV = 'test';

beforeEach(function (done) {


    function clearDB() {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(function() {});
        }
        return done();
    }


    if (mongoose.connection.readyState === 0) {
        mongoose.connect(dbUrl, function (err) {
            if (err) {
                throw err;
            }
            return clearDB();
        });
    } else {
        return clearDB();
    }
});


afterEach(function (done) {
    mongoose.disconnect();
    return done();
});