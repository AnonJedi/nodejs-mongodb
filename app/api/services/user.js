'use strict';


const bcrypt            = require('bcrypt');
const UserModel         = require('../models/user');
const StreamModel       = require('../models/stream');
const ServiceException  = require('../exceptions/service-exception');


//Function for fetch all users from db
module.exports.getAllUsers = () => (
    UserModel.find().exec()
);


//Function for fetch user from db by ids
module.exports.getUser = userId => (
    UserModel.findById(userId).exec()
);


//Function for create new user
module.exports.createUser = userData => {
    //Create promise for generate bcrypt hash password for user and return it
    const getHashPromise = new Promise((resolve, reject) => {
        bcrypt.hash(userData.password, 10, (err, hash) => {
            if (err) {
                console.log(err, `\nPassword is - ${password}`);
                reject(new ServiceException('Something wrong with password', err));
            }
            //Returning of generated hash
            resolve(hash);
        });
    });

    let newUser;

    //Start of promises chain of user creation
    return new Promise((resolve, reject) => {
        //Check existing user data
        if (!userData) {
            reject(new ServiceException('User data cannot be empty'));
        }
        resolve();
    })
        .then(() => (
            //Fetch user from db by id
            UserModel.findOne({login: userData.login}).exec()
        ))
        .then(user => {
            //Check user unique
            if (user) {
                throw new ServiceException(`User with login ${userData.login} already exists`);
            }

            //Create a new stream for user
            const newStream = new StreamModel({});
            return newStream.save();
        })
        .then(newStream => {
            //Build user model
            newUser = new UserModel({
                login: userData.login,
                firstname: userData.firstname,
                lastname: userData.lastname,
                stream_id: newStream._id
            });
            return getHashPromise;
        })
        .then(hash => {
            //Add password hash to user model and save it into db
            newUser.password = hash;
            return newUser.save();
        });

};


module.exports.createFollower = (userId, trackedUserId) => {
    let trackedUser;
    return _isDiffIds(userId, trackedUserId, 'User cannot follow to himself')
        .then(() => (
            UserModel.findById(trackedUserId).exec()
        ))
        .then(user => {
            if (!user) {
                throw new ServiceException(`User with id - "${trackedUserId}" is not found`);
            }
            trackedUser = user;
            return UserModel.findById(userId).exec();
        })
        .then(user => (
            StreamModel.findByIdAndUpdate(trackedUser.stream_id, {
                $push: {
                    followers: {
                        stream_id: user.stream_id
                    }
                }
            })
        ));
};


module.exports.removeFollower = (userId, trackedUserId) => {
    let trackedUser;
    return _isDiffIds(userId, trackedUserId, 'User cannot subscribe to himself')
        .then(() => (
            UserModel.findById(trackedUserId).exec()
        ))
        .then(user => {
            if (!user) {
                throw new ServiceException(`User with id - "${trackedUserId}" is not found`);
            }
            trackedUser = user;
            return UserModel.findById(userId).exec();
        })
        .then(user => (
            StreamModel.findByIdAndUpdate(trackedUser.stream_id, {
                $pull: {
                    followers: {
                        stream_id: user.stream_id
                    }
                }
            })
        ));
};


//Function for compare 2 ids and return promise
//if they didn't match or throw error otherwise
const _isDiffIds = (firstId, secondId, rejectMessage) => (
    new Promise((resolve, reject) => {
        if (firstId === secondId) {
            reject(new ServiceException(rejectMessage));
        }
        resolve();
    })
);


//Service for removing user by id
module.exports.removeUser = (authUserId, removedUserId) => (
    new Promise((resolve, reject) => {
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
        })
);