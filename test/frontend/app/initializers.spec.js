/*globals define,require,describe,it,expect,should,assert,before,after,beforeEach,afterEach,sinon,has*/
/*globals visit, find, findWithAssert, fillIn, click, keyEvent, wait */
/*globals Ember,App */
/*jshint expr:true,camelcase:false */
define([
  'json3',
  'jquery'
],

function (JSON, $) {
  'use strict';

  describe('App Initializers', function() {
    beforeEach(function() {
      Ember.run(function () {
        App.reset();
        // prevent routes from being triggered -- not necessary for these tests
        App.deferReadiness();
      });
    });

    afterEach(function() {

    });

    it('should give undefined for an unregistered Transform', function () {
      var doesNotExist = App.__container__.lookup('transform:doesNotExist');
      expect(doesNotExist).to.equal(undefined);
    });

    it('should register the FieldsTransform', function() {
      var fields = App.__container__.lookup('transform:fields');
      fields.should.exist;
    });

    it('should push preloaded data into the store', function() {
      var store;
      var data = {
        group: [{
          id: 0,
          title: 'test group',
          items: [],
          fields: {}
        }]
      };

      // attach GroupModel preload data
      $('<meta/>')
        .attr('name', 'preload-groups')
        .attr('content', JSON.stringify(data))
        .appendTo('head');


      // the effects of reset and deferReadiness will happen together,
      // sometime after the run function is called, since behind the scenes
      // their effects are placed on a queue.
      //
      // because of this, checking container variables, like 'store:main',
      // will reflect values before reset(), even if placed below the reset call.
      Ember.run(function () {
        App.reset();
        // prevent routes from being triggered -- not necessary for this test
        App.deferReadiness();

        // this references the to-be-deleted container (and store within)
        store = App.__container__.lookup('store:main');

        store.all('group').get('length').should.equal(0);
      });

      // this references the newly-generated container (and store within)
      store = App.__container__.lookup('store:main');

      var groupModels = store.all('group');
      groupModels.get('length').should.equal(1);
      groupModels.objectAt(0).get('title').should.equal(data.group[0].title);
    });
  });
});
