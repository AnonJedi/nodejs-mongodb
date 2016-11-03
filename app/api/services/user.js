'use strict';


const bcrypt            = require('bcrypt');
const UserModel         = require('../models/user');
const StreamModel       = require('../models/stream');
const ServiceException  = require('../exceptions/service-exception');


/**
 * Function for fetch all users from db
 * @returns {Promise.<Object>} - return users list
 */
module.exports.getAllUsers = () => (
  UserModel.find().exec()
);

/**
 * Function for fetch user from db by id
 * @param userId - id of requested user, mongoose type ObjectId
 * @returns {Promise.<Object>} - return user with current id
 */
module.exports.getUser = userId => (
  UserModel.findById(userId).exec()
);


/**
 * Function for create new user
 * @param login - String
 * @param password - String
 * @param firstname - String
 * @param lastname - String
 * @returns {Promise.<Object>} - return new user
 */
module.exports.createUser = (login, password, firstname, lastname) => {
  //Create promise for generate bcrypt hash password for user and return it
  const getHashPromise = new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.log(err, `\nPassword is - ${password}`);
        reject(new ServiceException('Something wrong with password', err));
      }
      //Returning of generated hash
      resolve(hash);
    });
  });

  let newUser;

  //Fetch user from db by id
  return UserModel.findOne({login: login}).exec()
    .then(user => {
      //Check user unique
      if (user) {
        throw new ServiceException(`User with login ${login} already exists`);
      }

      //Create a new stream for user
      const newStream = new StreamModel({});
      return newStream.save();
    })
    .then(newStream => {
      //Build user model
      newUser = new UserModel({
        login: login,
        firstname: firstname,
        lastname: lastname,
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


/**
 * Function for creation followers
 * @param userId - id tracking user, mongoose type ObjectId
 * @param trackedUserId - id of tracked user, mongoose type ObjectId
 * @returns {Promise.<>}
 */
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


/**
 * Function for remove followers
 * @param userId - id tracking user, mongoose type ObjectId
 * @param trackedUserId - id of tracked user, mongoose type ObjectId
 * @returns {Promise.<>}
 */
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


/**
 * Function for compare 2 ids and return promise
 * if they didn't match or throw error otherwise
 * @param firstId
 * @param secondId
 * @param rejectMessage
 * @private
 */
const _isDiffIds = (firstId, secondId, rejectMessage) => (
  new Promise((resolve, reject) => {
    if (firstId === secondId) {
      reject(new ServiceException(rejectMessage));
    }
    resolve();
  })
);


/**
 * Function for remove user by id
 * @param userId - id of deleting user, mongoose type ObjectId
 */
//Service for removing user by id
module.exports.removeUser = (userId) => (
  UserModel.remove({_id: userId})
);