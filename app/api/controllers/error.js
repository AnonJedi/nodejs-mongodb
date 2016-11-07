'use strict';

const presenter   = require('../presenters/presenter');


//Passport haven't unauthorized handler (((
module.exports.unauthHandler = (err, req, res, next) => {
  if (err.name === 'Unauthorized') {
    res.json(presenter.fail(null, `${err.name}: ${err.message}`));
  }
  next(err);
};


module.exports.notFoundHandler = (req, res) => {
  res.json(presenter.fail(null, 'Requested method is not found'));
};