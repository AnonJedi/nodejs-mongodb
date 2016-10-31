'use strict';


var UserModel = require('../models/user'),
    StreamModel = require('../models/stream'),
    ServiceException = require('../exceptions/service-exception'),
    bcrypt = require('bcrypt');


//Function for fetch all users from db
module.exports.getAllUsers = function () {
    return UserModel.find().exec();
};


//Function for fetch user from db by ids
module.exports.getUser = function (userId) {
    return UserModel.findById(userId).exec();
};


//Function for create new user
module.exports.createUser = function (userData) {
    //Create promise for generate bcrypt hash password for user and return it
    var getHashPromise = new Promise(function (resolve, reject) {
        bcrypt.hash(userData.password, 10, function (err, hash) {
            if (err) {
                console.log(err, `\nPassword is - ${password}`);
                reject(new ServiceException('Something wrong with password', err));
            }
            //Returning of generated hash
            resolve(hash);
        })
    });

    var newUser;

    //Start of promises chain of user creation
    return new Promise(function (resolve, reject) {
        //Check existing user data
        if (!userData) {
            reject(new ServiceException('User data cannot be empty'));
        }
        resolve();
    })
        .then(function () {
            //Fetch user from db by id
            return UserModel.findOne({login: userData.login}).exec();
        })
        .then(function (user) {
            //Check user unique
            if (user) {
                throw new ServiceException(`User with login ${userData.login} already exists`);
            }

            //Create a new stream for user
            var newStream = new StreamModel({});
            return newStream.save();
        })
        .then(function (newStream) {
            //Build user model
            newUser = new UserModel({
                login: userData.login,
                firstname: userData.firstname,
                lastname: userData.lastname,
                stream_id: newStream._id
            });
            return getHashPromise;
        })
        .then(function (hash) {
            //Add password hash to user model and save it into db
            newUser.password = hash;
            return newUser.save();
        })

};


module.exports.createFollower = function (userId, trackedUserId) {
    var trackedUser;
    return _isDiffIds(userId, trackedUserId, 'User cannot follow to himself')
        .then(function () {
            return UserModel.findById(trackedUserId).exec();
        })
        .then(function (user) {
            if (!user) {
                throw new ServiceException(`User with id - "${trackedUserId}" is not found`);
            }
            trackedUser = user;
            return UserModel.findById(userId).exec();
        })
        .then(function (user) {
            return StreamModel.findByIdAndUpdate(trackedUser.stream_id, {
                $push: {
                    followers: {
                        stream_id: user.stream_id
                    }
                }
            });
        })
};


module.exports.removeFollower = function (userId, trackedUserId) {
    var trackedUser;
    return _isDiffIds(userId, trackedUserId, 'User cannot subscribe to himself')
        .then(function () {
            return UserModel.findById(trackedUserId).exec();
        })
        .then(function (user) {
            if (!user) {
                throw new ServiceException(`User with id - "${trackedUserId}" is not found`);
            }
            trackedUser = user;
            return UserModel.findById(userId).exec();
        })
        .then(function (user) {
            return StreamModel.findByIdAndUpdate(trackedUser.stream_id, {
                $pull: {
                    followers: {
                        stream_id: user.stream_id
                    }
                }
            });
        })
};


//Function for compare 2 ids and return promise
//if they didn't match or throw error otherwise
function _isDiffIds(firstId, secondId, rejectMessage) {
    return new Promise(function (resolve, reject) {
        if (firstId === secondId) {
            reject(new ServiceException(rejectMessage));
        }
        resolve();
    });
}


//Service for removing user by id
module.exports.removeUser = function (authUserId, removedUserId) {
    return new Promise(function (resolve, reject) {
        //Check if authorized user id and removing user id is match.
        //Authorized user can remove only himself
        if (authUserId != removedUserId) {
            reject(new ServiceException('Authorized user cannot remove another user'));
        }
        //Continue if ids are match
        resolve();
    })
        .then(function () {
            UserModel.findById(removedUserId).remove();
        });
};