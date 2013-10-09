/*globals define,require,describe,it,expect,should,assert,before,after,beforeEach,afterEach,sinon,has*/
/*globals visit, find, findWithAssert, fillIn, click, keyEvent, wait */
/*globals Ember,App */
/*jshint expr:true,camelcase:false */

// all require() and define() calls are
// relative to your dev app directory
define([
  'ember',
  'jquery',
],

function(Em, $) {
  describe('just checking', function() {

    it('works for jQuery', function() {
      var el = $('<div></div>');
      el.text('require.js up and running');

      expect(el.text()).to.equal('require.js up and running');
    });

    it('works for Ember', function() {
      expect(Em.isArray([1,2,3])).to.be.ok;
    });
  });

  return;
});
