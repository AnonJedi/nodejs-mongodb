'use strict';


var utils               = require('./utils'),
    userService         = require('../services/user'),
    expect              = require('chai').expect,
    streamModel         = require('../models/stream'),
    bcrypt              = require('bcrypt'),
    ServiceException    = require('../exceptions/service-exception');


describe('User: service', function () {
    var userData = {
        login: 'test',
        password: 'test',
        firstname: 'test',
        lastname: 'test'
    };

    describe('#createUser()', function () {
        it('creation of user and his stream with valid data', function (done) {
            var expectedUser, createdUser;
            userService.createUser(userData)
                .then(function (dbUser) {
                    createdUser = dbUser;
                    return new Promise(function (resolve) {
                        createdUser.verifyPassword(userData.password, function (err, isMatch) {
                            if (err) {
                                return done(err);
                            }

                            // Password did not match
                            if (!isMatch) {
                                return done('Passwords did not match');
                            }
                            // Success
                            expectedUser = Object.assign(userData, {
                                stream_id: createdUser.stream_id,
                                _id: createdUser._id,
                                password: createdUser.password,
                                __v: createdUser.__v
                            });
                            resolve();
                        })
                    });
                })
                .then(function () {
                    expect(createdUser.toJSON()).to.deep.equals(expectedUser);
                    return streamModel.findById(createdUser.stream_id).exec();
                })
                .then(function (stream) {
                    expect(stream).to.exist;
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });

        it('creation of user without data', function (done) {
            userService.createUser(null)
                .catch(function (err) {
                    expect(err).to.be.instanceOf(ServiceException);
                    done();
                });
        });
    });
});