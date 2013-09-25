/*globals define,require,describe,it,expect,should,assert,before,after,beforeEach,afterEach,sinon,has*/
/*globals visit, find, findWithAssert, fillIn, click, keyEvent, wait */
/*jshint expr:true */
define([

],

function () {
  'use strict';

  describe('IndexRoute', function() {

    beforeEach(function() {
      App.reset();
      // visit('/');
    });

    afterEach(function() {
      // App.reset();
    });

    it('should take me to a form', function() {
      visit('/').then(function () {
        findWithAssert('.content > h1');
      });
    });

    it('should not submit with an empty title', function() {
      visit('/')
      .click('.scooby').then(function() {
        findWithAssert('.single').text().should.equal('Scooby');
      });
    });

    // it("should create a post on submit without chained helpers", function() {
    //   visit('/').then(function () {
    //     // perform some sync operations
    //
    //     // return a promise (could be an async operation)
    //     return fillIn('.title', 'Test Post');
    //   }).then(function () {
    //     return .fillIn('.body', 'This is the body');
    //   }).then(function () {
    //     return .click('.submit');
    //   }).then(function () {
    //     find('.post').should.exist;
    //     find('.post-title').text().should.equal('Test Post');
    //   });
    // });

    // it("should create a post on submit with chained helpers", function() {
    //   fillIn('.title', 'Test Post')
    //   .fillIn('.body', 'This is the body')
    //   .click('.submit')
    //   .then(function() {
    //     find('.post').should.exist;
    //     find('.post-title').text().should.equal('Test Post');
    //   });
    // });

    // test("helpers can be chained to each other", function() {
    //   expect(4);

    //   currentRoute = 'index';

    //   visit('/posts').click('a:first', '#comments-link')
    //   .fillIn('.ember-text-field', "hello")
    //   .then(function() {
    //     equal(currentRoute, 'comments', "Successfully visited posts route");
    //     equal(Ember.$('.ember-text-field').val(), 'hello', "Fillin successfully works");
    //     find('.ember-text-field').one('keypress', function(e) {
    //       equal(e.keyCode, 13, "keyevent chained with correct keyCode.");
    //     });
    //   })
    //    // second arg can be 'keypress', 'keydown', or 'keyup'. next arg is keyCode
    //   .keyEvent('.ember-text-field', 'keypress', 13)
    //   .visit('/posts')
    //   // If you're performing lots of similar tests (on an element, let's say),
    //   // you can also use the final '.then()' as a sort of dummy function, that
    //   // asserts that thrown exceptions do not fire multiple times.
    //   //
    //   // See: https://github.com/emberjs/ember.js/blob/master/packages/ember-testing/tests/acceptance_test.js#L103-L112
    //   //
    //   //  !!!!!!!!!!!!!!!!!!!!! need to test this
    //   // Example:
    //   //   visit('/posts').then(function () {
    //   //     return fillIn('#blah', 'yo');
    //   //   }).then(function () {
    //   //     find('#blah').val().should.equal('yo');
    //   //     return fillIn('#blah', 'yo2');
    //   //   }).then(function () {
    //   //     find('#blah').val().should.equal('yo2');
    //   //   }).then(function () {
    //   //     // empty -- catches only one error if fillIn fails from the start,
    //   //     // rather than triggering multiple times on each failure.
    //   //   });
    //   //
    //   .then(function() {
    //     equal(currentRoute, 'posts', "Thens can also be chained to helpers");
    //   });
    // });
  });
});
