import ActivatableControllerMixin from 'client/mixins/activatable-controller';
import validateItem from 'client/validators/item';

var ItemEditController = Em.ObjectController.extend(ActivatableControllerMixin, {
  // set by the route; `model` is based off of `canonicalModel`
  canonicalModel: null,

  validationErrors: null,

  setComplete: function () {
    var model = this.get('model'),
        complete;

    // this observer fires even when this controller is not part of the active route.
    // this is because route controllers are singletons and persist.
    // since changing routes destroys the temp model we used for editing, we must
    // avoid accessing or mutating it until we know it's fresh (on entering the route).
    // this function also fires when the canonicalModel is first set (and === null).
    if (model === null || model.isDestroyed) {
      return;
    }

    complete = this.get('canonicalModel.complete');
    model.set('complete', complete);
  }.observes('canonicalModel.complete'),

  actions: {
    cancel: function () {
      this.transitionToRoute('items');
    },

    save: function () {
      var self = this,
          // needed because Ember.TextField does not convert input to numbers
          item = this.get('model').numberize(),
          validationErrors = validateItem(item);

      this.set('validationErrors', validationErrors);

      if (validationErrors.length) {
        return;
      }

      this.api.edit('items', item).then(function (data) {
        var id = Ember.get(data, 'id');

        self.store.load('items', data);

        self.transitionToRoute('item.index', self.store.find('items', id));
      }).catch(function () {
        alert('Sorry, something went wrong saving your edited item! Please try again later.');
      });
    },
  }
});

export default ItemEditController;
