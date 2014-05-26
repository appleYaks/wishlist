var ApplicationController = Em.Controller.extend({
  actions: {
    reloadPeople: function () {
      this.store.findAll('person');
    }
  }
});

export default ApplicationController;
