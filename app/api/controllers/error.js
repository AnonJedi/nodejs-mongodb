'use strict';

const presenter   = require('../presenters/presenter');


module.exports.unauthHandler = (err, req, res, next) => {
  console.log(err);
  if (err.name === 'Unauthorized') {
    res.json(presenter.fail(null, `${err.name}: ${err.message}`));
  }
  next(err);
};


module.exports.notFoundHandler = (req, res) => {
  res.json(presenter.fail(null, 'Requested method is not found'));
};