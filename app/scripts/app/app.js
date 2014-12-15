import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import afterRender from 'client/utils/after-render';
import FastClickInit from 'client/utils/fastclick';

// helpers
import momentCalendar from 'client/helpers/moment-calendar';
import deDasherize from 'client/helpers/de-dasherize';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  /**
    * These are debugging flags, they are useful during development
    */
  LOG_ACTIVE_GENERATION: false,
  LOG_RESOLVER: false,
  LOG_MODULE_RESOLVER: false,
  LOG_TRANSITIONS: false,
  LOG_TRANSITIONS_INTERNAL: false,
  LOG_VIEW_LOOKUPS: false,
  modulePrefix: 'client',
  Resolver: Resolver['default']
});

loadInitializers(App, 'client');
FastClickInit();

export default App;
