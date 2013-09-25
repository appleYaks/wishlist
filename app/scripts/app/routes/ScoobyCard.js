define([
  'ember',
  'JST/scooby_card'
],

function (Em) {
  'use strict';

  var ScoobyCardRoute = Em.Route.extend({
    actions: {
      saveMe: function () {
        var model = this.get('controller').get('model');
        model.save();
      },

      // this assumes the name hasn't been changed with the <input>,
      // to demonstrate how the `isDirty` property works
      isDirtyChecks: function () {
        var model = this.get('controller').get('model');
        var name = model.get('name');

        console.log('Saving model ' + name + '...');

        // isDirty only returns true when props defined in the model's class are changed
        console.log('Should be clean: ', !model.get('isDirty'));

        model.set('DoesNotExist', 'anything');
        console.log('Should be clean: ', !model.get('isDirty'));

        model.set('name', name.toUpperCase());
        console.log('Should be dirty: ', model.get('isDirty'));

        // return model to previous state
        model.rollback();
        console.log('Should be clean: ', !model.get('isDirty'));

        // saving the model (dirty or not) also marks it as dirty until the server responds
        model.save();
        console.log('Should be dirty: ', model.get('isDirty'));

        // only register the callback if it doesn't already exist
        if (!model.has('becameError')) {
          // called if the server returns a non-200 response,
          // or a 200 response but doesn't return the updated record with it.
          model.one('becameError', function () {
            console.log('Model error. Should still be dirty: ', model.get('isDirty'));
          });
        }

        // only register the callback if it doesn't already exist
        if (!model.has('didUpdate')) {
          // called when the server returns a 200 response with the updated record.
          model.one('didUpdate', function () {
            console.log('Model updated. Should be clean: ', !model.get('isDirty'));
          });
        }
      }
    },

    model: function (params) {
      var self = this;

      return this.store.find('person', {name: params.name}).then(function (people) {
        if (people.get('length') > 0) {
          return people.get('lastObject');
        } else {
          self.transitionTo('index');
        }
      });
    },

    serialize: function (model) {
      return { name: model.get('lowercaseName') };
    },
  });

  return ScoobyCardRoute;
});
