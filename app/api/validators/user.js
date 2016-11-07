'use strict';

const commonValidator = require('./common');


module.exports.validateCreateUserData = data => {
  const parsedData = {
    err: {}
  };

  const fields = ['login', 'password', 'firstname', 'lastname'];

  fields.forEach(field => {
    if (!data[field] || !data[field].trim()) {
      parsedData.err[field] = `${field} is required`;
    }
    parsedData[field] = data[field];
  });

  return parsedData;
};


module.exports.validateDeleteUserData = data => {
  const parsedData = {
    err: {}
  };

  if (data.authorizedUserId != data.userId) {
    parsedData.err.authorizedUserId = 'User cannot remove another users';
  }
  if (!commonValidator.validateObjectId(data.userId)) {
    parsedData.err.userId = `User id '${data.userId}' is not valid`;
  }

  parsedData.userId = data.userId;

  return parsedData;
};


module.exports.validateFollowData = data => {
  const parsedData = {
    err: {}
  };

  if (data.authorizedUserId != data.userId) {
    parsedData.err.authorizedUserId = 'User cannot subscribe as another user';
  }
  if (!commonValidator.validateObjectId(data.userId)) {
    parsedData.err.userId = `User id '${data.userId}' is not valid`;
  }
  parsedData.userId = data.userId;

  if (data.userId != data.trackedUserId) {
    parsedData.err.trackedUserId = 'User cannot subscribe to himself';
  }
  if (!commonValidator.validateObjectId(data.trackedUserId)) {
    parsedData.err.trackedUserId = `User id '${data.trackedUserId}' is not valid`;
  }
  parsedData.trackedUserId = data.trackedUserId;

  return parsedData;
};
