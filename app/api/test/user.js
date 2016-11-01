'use strict';


const expect              = require('chai').expect;
const bcrypt              = require('bcrypt');
const mongoose            = require('mongoose');
const request             = require('request');
const userService         = require('../services/user');
const streamModel         = require('../models/stream');
const ServiceException    = require('../exceptions/service-exception');


describe('Integration user tests', () => {
    const userData = {
        login: 'test',
        password: 'test',
        firstname: 'test',
        lastname: 'test'
    };

    beforeEach(done => {
        const clearDB = () => {
            for (let i in mongoose.connection.collections) {
                mongoose.connection.collections[i].remove(() => {});
            }
        };

        if (mongoose.connection.readyState === 0) {
            mongoose.connect(dbUrl, err => {
                if (err) {
                    throw err;
                }
                clearDB();
            });
        } else {
            clearDB();
        }

        return done();
    });

    afterEach(function (done) {
        mongoose.disconnect();
        return done();
    });


    describe('#createUser()', () => {
        it('creation of user and his stream with valid data', done => {
            let expectedUser, createdUser;
            userService.createUser(userData)
                .then((dbUser) => {
                    createdUser = dbUser;
                    return new Promise(resolve => {
                        createdUser.verifyPassword(userData.password, (err, isMatch) => {
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
                .then(() => {
                    expect(createdUser.toJSON()).to.deep.equals(expectedUser);
                    return streamModel.findById(createdUser.stream_id).exec();
                })
                .then(stream => {
                    expect(stream).to.exist;
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });

        it('creation of user without data', function (done) {
            userService.createUser(null)
                .catch(err => {
                    expect(err).to.be.instanceOf(ServiceException);
                    done();
                });
        });
    });
});