'use strict';


const expect      = require('chai').expect;
const validator   = require('../../../../validators/user');


describe('User unit test', () => {
  describe('#validateCreateUserData', () => {
    it('all valid data', done => {
      const inputData = {
        login: 'test',
        password: 'test',
        firstname: 'test',
        lastname: 'test'
      };
      const parsedData = validator.validateCreateUserData(inputData);
      expect(parsedData.err).to.be.empty;
      delete parsedData.err;
      expect(parsedData).to.deep.equal(inputData);
      done();
    });

    it('empty data', done => {
      const parsedData = validator.validateCreateUserData({});
      expect(parsedData.err).to.have.all.keys('login', 'password', 'firstname', 'lastname');
      done();
    });

    it('not valid data', done => {
      const inputData = {
        login: '',
        password: '',
        firstname: '   ',
        lastname: '   '
      };
      const parsedData = validator.validateCreateUserData(inputData);
      expect(parsedData.err).to.have.all.keys('login', 'password', 'firstname', 'lastname');
      done();
    });
  })
});