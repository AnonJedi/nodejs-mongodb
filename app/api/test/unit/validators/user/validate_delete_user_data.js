'use strict';


const expect      = require('chai').expect;
const validator   = require('../../../../validators/user').validateDeleteUserData;


describe('User unit test', () => {
  describe('#validateDeleteUserData', () => {
    it('all valid data', done => {
      const inputData = {
        authorizedUserId: qwerty12,
        userId: qwerty12
      };
      const parsedData = validator(inputData);
      expect(parsedData.err).to.be.empty;
    })
  })
});