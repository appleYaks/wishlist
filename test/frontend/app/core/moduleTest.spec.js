/*globals define,require,describe,it,expect,should,assert,before,after,beforeEach,afterEach,sinon,has*/
/*globals visit, find, findWithAssert, fillIn, click, keyEvent, wait */
/*globals Ember,App */
/*jshint expr:true,camelcase:false */
define([  // this will give us the normal return value for the module
  'core/moduleTest'
],

function(moduleTest) {
  'use strict';

  /*
   * External Tests:
   *   tests using only the normal return value from the module itself
   */
  describe('moduleTest external tests', function() {
    it('should return a function', function() {
      var input = 'parameter';

      expect(moduleTest).to.be.a('function');
      expect(moduleTest(input)).to.be.an('object');
    });

    it('should check nonexistence of internal properties', function () {
      expect(moduleTest).to.not.have.property('internalFunction');
    });

    it('should test async function with done', function (done) {
      var options = {};
      options.success = sinon.spy();

      var instance = moduleTest();
      expect(instance).to.have.property('asyncOperation');

      instance.asyncOperation(options).then(function (num) {
        // be aware that `should` does NOT work in Internet Explorer
        options.success.should.have.been.calledOnce;

        // an alternative to using `should`
        // expect(options.success).to.have.been.calledOnce;

        num.should.equal(42);
        done();
      });
    });

    // pending test -- illustrating a test you may want to flesh out later
    it('should test something else');
  });

  /*
   * Internal Tests:
   *   tests using the internal functions and properties of the module
   */
  describe('moduleTest internal tests', function () {
    // placeholder variable for when we require() the module in a different context
    var moduleTest;

    // this is run once, before any tests in this suite take place
    before(function (done) {
      // set internalTest environment so that the
      // moduleTest module returns internal functions for testing
      has.add('internalTest', function () {
        return true;
      }, true);

      // remove the module from the requirejs cache so that we
      // can require() it again with the internalTest environment set
      require.undef('core/moduleTest');

      require(['core/moduleTest'], function (module) {
        moduleTest = module;
        done();
      });
    });

    it('should return moduleTest object', function() {
      expect(moduleTest).to.be.an('object');
    });

    it('should test the existence of returned internal values', function () {
      expect(moduleTest).to.have.property('init');
      expect(moduleTest).to.have.property('asyncOperation');
      expect(moduleTest).to.have.property('internalFunction');
    });

    it('should test internalFunction with no args', function () {
      var result = moduleTest.internalFunction();
      expect(result).to.equal(0);
    });

    it('should test internalFunction with one argument', function () {
      var result = moduleTest.internalFunction({ test: 'data'});
      expect(result).to.equal(1);
    });
  });
});
