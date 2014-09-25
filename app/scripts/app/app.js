import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import afterRender from 'client/utils/after-render';
import FastClickInit from 'client/utils/fastclick';

// helpers
import momentCalendar from 'client/helpers/moment-calendar';
import yesno from 'client/helpers/yesno';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  /**
    * These are debugging flags, they are useful during development
    */
  LOG_ACTIVE_GENERATION: true,
  LOG_MODULE_RESOLVER: true,
  LOG_TRANSITIONS: true,
  LOG_TRANSITIONS_INTERNAL: true,
  LOG_VIEW_LOOKUPS: true,
  modulePrefix: 'client',
  Resolver: Resolver['default']
});

loadInitializers(App, 'client');
FastClickInit();

export default App;
