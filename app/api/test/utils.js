'use strict';

var mongoose = require('mongoose');


// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';

let dbUrl = `mongodb://${process.env.DATABASE_USER}:${process.env.MONGODB_PASS}@localhost:27017/test`;


beforeEach(done => {

  const clearDB = () => {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(() => {});
    }
    return done();
  };


  if (mongoose.connection.readyState === 0) {
    mongoose.connect(dbUrl, err => {
      if (err) {
        throw err;
      }
      return clearDB();
    });
  } else {
    return clearDB();
  }
});


afterEach(done => {
  mongoose.disconnect();
  return done();
});