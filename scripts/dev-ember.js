define("client/app",
  ["ember/resolver","ember/load-initializers","client/utils/after-render","client/utils/fastclick","client/helpers/moment-calendar","client/helpers/de-dasherize","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __exports__) {
    "use strict";
    var Resolver = __dependency1__["default"];
    var loadInitializers = __dependency2__["default"];
    var afterRender = __dependency3__["default"];
    var FastClickInit = __dependency4__["default"];

    // helpers
    var momentCalendar = __dependency5__["default"];
    var deDasherize = __dependency6__["default"];

    Ember.MODEL_FACTORY_INJECTIONS = true;

    var App = Ember.Application.extend({
      /**
        * These are debugging flags, they are useful during development
        */
      modulePrefix: 'client',
      Resolver: Resolver['default']
    });

    loadInitializers(App, 'client');
    FastClickInit();

    __exports__["default"] = App;
  });
define("client/components/action-checkbox",
  ["exports"],
  function(__exports__) {
    "use strict";
    var ActionCheckbox = Ember.Checkbox.extend({
      transmitAction: function () {
        Ember.run.schedule('sync', this, function () {
          var action = this.get('action'),
          model = this.get('model');

          if (action && model) {
            this.get('controller').send(action, model);
          }
        });
      }.observes('checked')
    });

    __exports__["default"] = ActionCheckbox;
  });
define("client/components/datetime-picker",
  ["exports"],
  function(__exports__) {
    "use strict";
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

    var years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038];

    var hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    var minutes = ['00', '05', 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

    var AMPM = ['AM', 'PM'];

    var DateTimePicker = Ember.Component.extend({
      init: function () {
        // preset selected datetime based on model
        var date = this.get('date'),
            year = moment(date).year(),
            day = moment(date).date(),
            month = moment(date).month(),
            hour = moment(date).hour(),
            minute = moment(date).minute(),
            // index for AMPM array
            ampm = hour < 12 ? 0 : 1,
            days;

        if (year < years[0] || year > years[years.length-1]) {
          year = years[0];
        }

        if (month < 0 || month > 11) {
          month = 0;
        }

        // need to set month and year before clamping the day
        this.set('selectedMonth', months[month]);
        this.set('selectedYear', year);
        // get days based on month and year
        this.getDays();
        days = this.get('days');

        if (day < 1 || day > days[days.length-1]) {
          day = 1;
        }

        this.set('selectedDay', day);

        // 0 means 12 AM
        if (hour === 0) {
          hour = 12;
        }

        if (hour < 0 || hour > 12) {
          hour = Math.abs(hour) % 12;
        }

        if (minute < 0) {
          minute = 0;
        }

        if (minute > 55) {
          minute = 55;
        }

        // clamp to 5-minute intervals, lower-bound
        minute = minute - minute % 5;

        this.set('selectedHour', hour);
        this.set('selectedMinute', minutes[minute/5]);
        this.set('selectedAMPM', AMPM[ampm]);

        if (this.get('triggerActionOnStart') === 'true') {
          this.publish();
        }

        // TODO: remove after testing
        this.set('momentDate', moment(date).format('LLL'));

        this._super();
      },

      hours: hours,
      minutes: minutes,
      ampm: AMPM,
      years: years,
      months: months,
      days: days,

      // vary days to choose from based on month/year
      getDays: function () {
        var month = this.get('selectedMonth'),
            wasSet = false,
            newDays;

        if (['Apr', 'Jun', 'Sep', 'Nov'].indexOf(month) !== -1) {
          newDays = days.slice(0, 30);
          wasSet = true;
        }

        if (month === 'Feb') {
          if (this.get('selectedYear') % 4 === 0) {
            newDays = days.slice(0, 29);
          } else {
            newDays = days.slice(0, 28);
          }

          wasSet = true;
        }

        if (!wasSet) {
          newDays = days;
        }

        if (this.get('selectedDay') > newDays.length) {
          this.set('selectedDay', newDays.length);
        }

        this.set('days', newDays);
      }.observes('selectedMonth', 'selectedYear'),

      composeDate: function () {
        var year = this.get('selectedYear'),
            month = this.get('selectedMonth'),
            day = this.get('selectedDay'),
            hour = this.get('selectedHour'),
            minute = this.get('selectedMinute'),
            ampm = this.get('selectedAMPM'),
            ISOdate;

        // compose date from its components.
        // i guess it's kinda slow, but the use of +=
        // should speed it up a bit over regular concatting
        ISOdate = month;
        ISOdate += ' ';
        ISOdate += day;
        ISOdate += ', ';
        ISOdate += year;
        ISOdate += ' ';
        ISOdate += hour;
        ISOdate += ':';
        ISOdate += minute;
        ISOdate += ' ';
        ISOdate += ampm;

        // moment will only give us the format with the local hour offset at the end
        ISOdate = moment(ISOdate, 'MMM DD, YYYY hh:mm a').format();

        // I like the unified format of having 'Z' at the end to signify UTC
        ISOdate = (new Date(ISOdate)).toISOString();

        return ISOdate;
      },

      selectWasChanged: function () {
        // observes is synchronous--this makes sure the call to `publish` fires once
        Ember.run.once(this, 'publish');
      }.observes('selectedYear', 'selectedMonth', 'selectedDay', 'selectedHour', 'selectedMinute', 'selectedAMPM'),

      publish: function () {
        this.sendAction('action', this.composeDate(), this.get('data'));
      },
    });

    __exports__["default"] = DateTimePicker;
  });
define("client/components/edit-metadata",
  ["exports"],
  function(__exports__) {
    "use strict";
    var stringType  = { type: 'String', string: true };
    var numberType  = { type: 'Number', number: true };
    var booleanType = { type: 'Boolean', bool: true };
    var dateType    = { type: 'Date', date: true };

    var EditMetadataComponent = Ember.Component.extend({
      classNames: ['edit-metadata'],

      fieldKeyTypes: [
        stringType,
        numberType,
        booleanType,
        dateType
      ],

      selectedKeyType: null,
      newFieldKey: null,
      newFieldValue: null,

      resetFieldValue: function () {
        this.set('newFieldValue', null);
      }.observes('selectedKeyType'),

      actions: {
        fieldDateChanged: function (date, fieldKey) {
          var fields = this.get('fields'),
              field;

          if (!fieldKey) {
            throw Error('field did not have a key when changing date!');
          }

          field = fields.findBy('key', fieldKey);

          if (!field) {
            throw Error('a field by the name "' + fieldKey + '" did not exist when changing date!');
          }

          Ember.set(field, 'val', date);
        },

        newFieldDateChanged: function (date) {
          this.set('newFieldValue', date);
        },

        addField: function () {
          var key = this.get('newFieldKey'),
              val = this.get('newFieldValue'),
              type = this.get('selectedKeyType'),
              fields = this.get('fields'),
              errors = [];

          // clear out old errors
          this.set('errors', errors);

          // use defaults
          if (val === null || typeof val === 'undefined') {
            if (type.bool) {
              val = document.getElementById('newFieldValue').checked;
            } else if (!type.date) {
              val = document.getElementById('newFieldValue').getAttribute('placeholder');
            }
          }

          if (type.number) {
            val = parseInt(val, 10);
          }

          if (!key) {
            errors.push('Sorry, I can\'t add a field with no name.');
          } else {
            key = key.replace(/\s+/g, '-');
          }

          if (key && fields.findBy('key', key)) {
            errors.push('Sorry, a field already exists with that name. Please try again.');
          }

          if (!/^[a-zA-Z][0-9a-zA-Z-]*$/.test(key)) {
            errors.push('The name given needs to start with a letter, and afterwords be only letters, numbers, or dashes.');
          }

          if (type.number && isNaN(val)) {
            errors.push('What you entered as a number is actually not a number.');
          }

          if (type.bool && val !== true && val !== false) {
            errors.push('I don\'t know how you broke it, but the checkbox needs to be either checked or unchecked!');
          }

          if (type.date && !moment(val).isValid()) {
            errors.push('That does not appear to be a valid date.');
          }

          if (errors.length) {
            return;
          }

          // everything checked out! add to fields array
          fields.addObject({
            key: key,
            val: val,
            type: type.type
          });

          this.set('newFieldKey', null);

          // keep date from becoming corrupted.
          // the user probably wants to start
          // from where they left off anyway.
          if (!type.date) {
            this.set('newFieldValue', null);
          }
        },
      }
    });

    __exports__["default"] = EditMetadataComponent;
  });
define("client/controllers/group/edit",
  ["exports"],
  function(__exports__) {
    "use strict";
    var GroupEditController = Em.ObjectController.extend({
      actions: {
        cancel: function () {
          this.get('model').destroy();
          this.transitionToRoute('groups');
        },

        save: function () {
          var self = this,
              group = this.get('model');

          this.api.edit('groups', group).then(function (data) {
            var id = Ember.get(data, 'id');

            self.store.load('groups', data);
            self.send('refresh');

            self.transitionToRoute('group.index', self.store.find('groups', id));
          }).catch(function () {
            alert('Sorry, something went wrong saving your edited group! Please try again later.');
          });
        },
      }
    });

    __exports__["default"] = GroupEditController;
  });
define("client/controllers/group/index",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.ObjectController.extend();
  });
define("client/controllers/groups",
  ["client/mixins/sortable-controller","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var SortableControllerMixin = __dependency1__["default"];

    var GroupsController = Em.ArrayController.extend(SortableControllerMixin, {
      needs: ['application', 'group/index',  'group/edit', 'items'],

      // user-controlled sort order
      sortedTitleAsc: Ember.computed.equal('userSorted', 'title-asc'),

      actions: {
        sortByTitle: function () {
          var direction = this.get('userSorted') === 'title-asc' ? false : true;
          this.set('sortProperties', ['title']);
          this.set('sortAscending', direction);
        },

        delete: function (group) {
          var self = this;

          if(!confirm('Are you sure you want to delete ' + Ember.get(group, 'title') + '? This will also delete all its dependent items!')) {
            return;
          }

          this.api.deleteModel('groups', group).then(function () {
            var id = Ember.get(group, 'id'),
                routeName = self.get('controllers.application').get('currentRouteName');

            // if we just deleted a group we were editing or viewing
            if (routeName.indexOf('group.index') !== -1 && self.get('controllers.group/index').get('model.id') === id) {
              self.transitionToRoute('groups');
            }
            if (routeName.indexOf('group.edit') !== -1 && self.get('controllers.group/edit').get('model.id') === id) {
              self.transitionToRoute('groups');
            }

            // if we just deleted the group whose items we were looking at, we must transition away
            if (routeName.indexOf('item') !== -1 && self.get('controllers.items').get('GroupId') === id) {
              self.transitionToRoute('groups');
            }

            self.store.deleteModels('groups', group);
            self.store.seekAndDestroy('items', 'GroupId', id);
            // refresh the `groups` route to remove the model from the list.
            // even if we're on a sub-route, the action will bubble up.
            self.send('refresh');
          }).catch(function () {
            alert('Sorry, something went wrong deleting your group! Please try again later.');
          });
        },
      }
    });

    __exports__["default"] = GroupsController;
  });
define("client/controllers/groups/new",
  ["exports"],
  function(__exports__) {
    "use strict";
    var GroupsNewController = Em.ObjectController.extend({
      actions: {
        cancel: function () {
          this.get('model').destroy();
          this.transitionToRoute('groups');
        },

        save: function () {
          var self = this,
              group = this.get('model');

          this.api.add('groups', group).then(function (data) {
            self.store.load('groups', data);
            self.send('refresh');

            self.transitionToRoute('groups');
          }).catch(function () {
            alert('Sorry, saving your group failed! Please try again later.');
          });
        },
      }
    });

    __exports__["default"] = GroupsNewController;
  });
define("client/controllers/item/edit",
  ["exports"],
  function(__exports__) {
    "use strict";
    var ItemEditController = Em.ObjectController.extend({
      setComplete: function () {
        var model = this.get('model'),
            complete;

        // this observer fires even when this controller is not part of the active route.
        // this is because route controllers are singletons and persist.
        // since changing routes destroys the temp model we used for editing, we must
        // avoid accessing or mutating it until we know it's fresh (on entering the route).
        if (model.isDestroyed) {
          return;
        }

        complete = this.get('canonicalModel.complete');
        model.set('complete', complete);
      }.observes('canonicalModel.complete'),

      actions: {
        cancel: function () {
          this.get('model').destroy();
          this.transitionToRoute('items');
        },

        save: function () {
          var self = this,
              item = this.get('model');

          this.api.edit('items', item).then(function (data) {
            var id = Ember.get(data, 'id');

            self.store.load('items', data);
            self.send('refresh');

            self.transitionToRoute('item.index', self.store.find('items', id));
          }).catch(function () {
            alert('Sorry, something went wrong saving your edited item! Please try again later.');
          });
        },
      }
    });

    __exports__["default"] = ItemEditController;
  });
define("client/controllers/item/index",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.ObjectController.extend();
  });
define("client/controllers/items",
  ["client/mixins/sortable-controller","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var SortableControllerMixin = __dependency1__["default"];

    var ItemsController = Em.ArrayController.extend(SortableControllerMixin, {
      needs: ['application', 'item/index', 'item/edit'],

      // various sort orders
      sortedTitleAsc: Ember.computed.equal('userSorted', 'title-asc'),
      sortedPriorityAsc: Ember.computed.equal('userSorted', 'priority-asc'),
      sortedRatingAsc: Ember.computed.equal('userSorted', 'rating-asc'),

      actions: {
        sortByTitle: function () {
          var direction = this.get('userSorted') === 'title-asc' ? false : true;
          this.set('sortProperties', ['title']);
          this.set('sortAscending', direction);
        },

        sortByPriority: function () {
          var direction = this.get('userSorted') === 'priority-asc' ? false : true;
          this.set('sortProperties', ['priority']);
          this.set('sortAscending', direction);
        },

        sortByRating: function () {
          var direction = this.get('userSorted') === 'rating-asc' ? false : true;
          this.set('sortProperties', ['rating']);
          this.set('sortAscending', direction);
        },

        patchChecked: function (model) {
          this.api.patch('items', model, 'complete').catch(function () {
            alert('Sorry, something went wrong saving your checkmark! Please try again later.');
          });
        },

        delete: function (item) {
          var self = this;

          if(!confirm('Are you sure you want to delete ' + Ember.get(item, 'title') + '?')) {
            return;
          }

          this.api.deleteModel('items', item).then(function () {
            var id = Ember.get(item, 'id'),
            routeName = self.get('controllers.application').get('currentRouteName');

            // if we were viewing or editing that item, we need to transition away
            if (routeName.indexOf('item.index') !== -1 && self.get('controllers.item/index').get('model.id') === id) {
              self.transitionToRoute('items');
            } else if (routeName.indexOf('item.edit') !== -1 && self.get('controllers.item/edit').get('model.id') === id) {
              self.transitionToRoute('items');
            }

            self.store.deleteModels('items', item);
            self.get('model').removeObject(item);
            // refresh the `items` route to remove the model from the list.
            // even if we're on a sub-route, the action will bubble up.
            self.send('refresh');
          }).catch(function () {
            alert('Sorry, something went wrong deleting your item! Please try again later.');
          });
        }
      }
    });

    __exports__["default"] = ItemsController;
  });
define("client/controllers/items/new",
  ["exports"],
  function(__exports__) {
    "use strict";
    var ItemsNewController = Em.ObjectController.extend({
      needs: ['items'],

      actions: {
        cancel: function () {
          this.get('model').destroy();
          this.transitionToRoute('items');
        },

        save: function () {
          var self = this,
              item = this.get('model'),
              GroupId = this.get('controllers.items.GroupId');

          item.set('GroupId', GroupId);

          this.api.add('items', item).then(function (data) {
            var id = Ember.get(data, 'id');

            self.store.load('items', data);
            self.send('refresh');

            self.transitionToRoute('item.index', id);
          }).catch(function () {
            alert('Sorry, saving your item failed! Please try again later.');
          });
        },
      }
    });

    __exports__["default"] = ItemsNewController;
  });
define("client/helpers/de-dasherize",
  ["exports"],
  function(__exports__) {
    "use strict";
    Ember.Handlebars.helper('dedasherize', function (str) {
      return str.replace(/-/g, ' ');
    });

    __exports__["default"] = null;
  });
define("client/helpers/moment-calendar",
  ["exports"],
  function(__exports__) {
    "use strict";
    Ember.Handlebars.helper('moment-calendar', function (date) {
      return moment(date).calendar();
    });

    __exports__["default"] = null;
  });
define("client/initializers/inject-api",
  ["client/utils/api","client/utils/sequelize-data-transform","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Api = __dependency1__["default"];
    var sequelizeTransform = __dependency2__["default"];

    __exports__["default"] = {
      name: 'api',
      after: ['data-store'],

      initialize: function (container, application) {
          application.register('api:main', Api);
          application.inject('api:main', 'store', 'store:main');
          application.inject('route', 'api', 'api:main');
          application.inject('controller', 'api', 'api:main');

          var api;
          api = container.lookup('api:main');
          api.set('keyTransforms.defalt', sequelizeTransform);
          api.fakeIt();
      }
    };
  });
define("client/initializers/inject-data-store",
  ["client/utils/data-store","client/models/group","client/models/item","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var DataStore = __dependency1__["default"];
    var GroupModel = __dependency2__["default"];
    var ItemModel = __dependency3__["default"];

    __exports__["default"] = {
        name: 'data-store',

        initialize: function (container, application) {
          var store;

          // warnings clutter the console in testing
          if (!application.get('testing')) {
              DataStore.reopen({ warnings: true });
          }

          application.register('store:main', DataStore);
          application.inject('route', 'store', 'store:main');
          application.inject('controller', 'store', 'store:main');

          // add basic model types to the store so they can accept models
          store = container.lookup('store:main');
          store.addType('groups');
          store.registerModelFactory('groups', GroupModel);
          store.addType('items');
          store.registerModelFactory('items', ItemModel);
        }
    };
  });
define("client/initializers/preload",
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = {
        name: 'preloadData',
        after: ['data-store'],

        initialize: function (container, application) {
          var store = container.lookup('store:main');
          var head = document.head;

          var attributes = [
            {
              target: 'route:groups',
              type: 'groups',
              content: $('meta[name="preload-groups"]', head).attr('content')
            },
            {
              type: 'items',
              content: $('meta[name="preload-items"]', head).attr('content')
            }
          ].filterBy('content');

          var hasData = !Em.isEmpty(attributes);

          if (hasData) {
            attributes.forEach(function (obj) {
              var data = JSON.parse(obj.content);

              if (!data) {
                return;
              }

              if (obj.type) {
                store.load(obj.type, data);
              }

              if (obj.target) {
                container.lookup(obj.target).set('preload', true);
              }
            });
          }
        }
      };
  });
define("client/mixins/sortable-controller",
  ["exports"],
  function(__exports__) {
    "use strict";
    var SortControllerMixin = Ember.Mixin.create({
      userSorted: function () {
        var which = this.get('sortProperties.firstObject');

        if (which) {
          which += this.get('sortAscending') ? '-asc' : '-desc';
        }

        return which;
      }.property('sortProperties', 'sortAscending'),
    });

    __exports__["default"] = SortControllerMixin;
  });
define("client/models/group",
  ["exports"],
  function(__exports__) {
    "use strict";
    var Group = Ember.Object.extend({
      init: function () {
        this._super();
        this.set('fields', []);
      },

      title: '',
      description: '',
    });

    __exports__["default"] = Group;
  });
define("client/models/item",
  ["exports"],
  function(__exports__) {
    "use strict";
    var Item = Ember.Object.extend({
      init: function () {
        this._super();
        this.set('fields', []);
      },

      title: '',
      description: '',
      rating: 0,
      priority: 0,
      complete: false,
    });

    __exports__["default"] = Item;
  });
define("client/router",
  ["exports"],
  function(__exports__) {
    "use strict";
    var Router = Em.Router.extend({
    });

    Router.map(function () {
      this.resource('groups', {path: '/groups'}, function () {
        // these inner resources 'group' and 'items' are split up
        // so that their inner views are exclusively shown on screen.
        // also for clarity.

        this.resource('group', {path: ':group_id'}, function () {
          this.route('edit');
        });
        this.route('new');

        this.resource('items', {path: ':group_id/items'}, function () {
          this.resource('item', {path: ':item_id'}, function () {
            this.route('edit');
          });
          this.route('new');
        });
      });
    });

    __exports__["default"] = Router;
  });
define("client/routes/application",
  ["exports"],
  function(__exports__) {
    "use strict";
    var ApplicationRoute = Em.Route.extend();

    __exports__["default"] = ApplicationRoute;
  });
define("client/routes/group",
  ["exports"],
  function(__exports__) {
    "use strict";
    var GroupRoute = Ember.Route.extend({
      model: function (params) {
        return this.api.find('groups', params.group_id);
      },

      renderTemplate: function () {
        this.render('group', {
          into: 'application',
          outlet: 'group'
        });
      },
    });

    __exports__["default"] = GroupRoute;
  });
define("client/routes/group/edit",
  ["exports"],
  function(__exports__) {
    "use strict";
    var GroupEditRoute = Em.Route.extend({
      setupController: function (controller, group) {
        // deep copy of passed-in model to mess with in case edits are canceled.
        // seems like `.toJSON()` is not supported for `Ember.Object`
        controller.set('model', this.store.createModelOfType('groups', group));
        controller.set('canonicalModel', group);
      },

      renderTemplate: function () {
        this.render('group/edit', {
          into: 'application',
          outlet: 'group',
        });
      },

      actions: {
        willTransition: function () {
          this.get('controller.model').destroy();
        }
      }
    });

    __exports__["default"] = GroupEditRoute;
  });
define("client/routes/group/index",
  ["exports"],
  function(__exports__) {
    "use strict";
    var GroupIndexRoute = Em.Route.extend({
      renderTemplate: function () {
        this.render('group/index', {
          into: 'application',
          outlet: 'group',
        });
      },
    });

    __exports__["default"] = GroupIndexRoute;
  });
define("client/routes/groups",
  ["exports"],
  function(__exports__) {
    "use strict";
    var GroupsRoute = Em.Route.extend({
      model: function () {
        var preload = this.get('preload');

        if (preload) {
          this.set('preload', null);
          return this.store.all('groups');
        }

        return this.api.fetchAll('groups');
      },

      renderTemplate: function () {
        this.render('groups', {
          into: 'application',
          outlet: 'groups',
        });
      },

      actions: {
        refresh: function () {
          this.refresh();
        }
      }
    });

    __exports__["default"] = GroupsRoute;
  });
define("client/routes/groups/new",
  ["exports"],
  function(__exports__) {
    "use strict";
    var GroupsNewRoute = Em.Route.extend({
      setupController: function (controller) {
        controller.set('model', this.store.createModelOfType('groups'));
      },

      renderTemplate: function () {
        this.render('groups/new', {
          into: 'application',
          outlet: 'group',
        });
      },

      actions: {
        willTransition: function () {
          this.get('controller.model').destroy();
        }
      }
    });

    __exports__["default"] = GroupsNewRoute;
  });
define("client/routes/index",
  ["exports"],
  function(__exports__) {
    "use strict";
    var IndexRoute = Em.Route.extend({
      beforeModel: function () {
        this.transitionTo('groups');
      },
    });

    __exports__["default"] = IndexRoute;
  });
define("client/routes/item",
  ["exports"],
  function(__exports__) {
    "use strict";
    var ItemRoute = Em.Route.extend({
      model: function (params) {
        return this.api.find('items', params.item_id);
      },

      renderTemplate: function () {
        this.render('item', {
          into: 'application',
          outlet: 'item',
        });
      },
    });

    __exports__["default"] = ItemRoute;
  });
define("client/routes/item/edit",
  ["exports"],
  function(__exports__) {
    "use strict";
    var ItemEditRoute = Em.Route.extend({
      setupController: function (controller, item) {
        // deep copy of passed-in model to mess with in case edits are canceled.
        // seems like `.toJSON()` is not supported for `Ember.Object`
        controller.set('model', this.store.createModelOfType('items', item));
        controller.set('canonicalModel', item);
      },

      renderTemplate: function () {
        this.render('item/edit', {
          into: 'application',
          outlet: 'item',
        });
      },

      actions: {
        willTransition: function () {
          this.get('controller.model').destroy();
        }
      }
    });

    __exports__["default"] = ItemEditRoute;
  });
define("client/routes/item/index",
  ["exports"],
  function(__exports__) {
    "use strict";
    var ItemIndexRoute = Em.Route.extend({
      renderTemplate: function () {
        this.render('item/index', {
          into: 'application',
          outlet: 'item',
        });
      },
    });

    __exports__["default"] = ItemIndexRoute;
  });
define("client/routes/items",
  ["exports"],
  function(__exports__) {
    "use strict";
    var ItemsRoute = Em.Route.extend({
      model: function (params) {
        this.set('currentGroupId', parseInt(params.group_id, 10));
        return this.api.fetchAll('items', 'groups', params.group_id);
      },

      setupController: function (controller, model) {
        // allow sub-routes to access the GroupId since it seems the dynamic segment is not available otherwise
        controller.set('GroupId', this.get('currentGroupId'));
        this._super(controller, model);
      },

      renderTemplate: function () {
        this.render('items', {
          into: 'application',
          outlet: 'items',
        });
      },

      actions: {
        refresh: function () {
          this.refresh();
          return true;
        }
      }
    });

    __exports__["default"] = ItemsRoute;
  });
define("client/routes/items/new",
  ["exports"],
  function(__exports__) {
    "use strict";
    var ItemsNewRoute = Em.Route.extend({
      setupController: function (controller) {
        var model = this.store.createModelOfType('items', {
          GroupId: this.controllerFor('items').get('GroupId')
        });

        controller.set('model', model);
      },

      renderTemplate: function () {
        this.render('items/new', {
          into: 'application',
          outlet: 'item',
        });
      },

      actions: {
        willTransition: function () {
          this.get('controller.model').destroy();
        }
      }
    });

    __exports__["default"] = ItemsNewRoute;
  });
define("client/utils/after-render",
  ["exports"],
  function(__exports__) {
    "use strict";
    // create a hook for jQuery logic that will run after
    // a view and all child views have been rendered,
    // since didInsertElement runs only when the view's el
    // has rendered, and not necessarily all child views.
    // Note: if you use this hook, and also override didInsertElement,
    //       be sure to call this._super() in your overridden didInsertElement.
    //
    // http://mavilein.github.io/javascript/2013/08/01/Ember-JS-After-Render-Event/
    // http://emberjs.com/api/classes/Ember.run.html#method_next
    Em.View.reopen({
      didInsertElement : function(){
        this._super();
        Em.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
      },
      afterRenderEvent : function(){
        // implement this hook in your own subclasses and run your jQuery logic there
      }
    });

    __exports__["default"] = null;
  });
define("client/utils/api",
  ["exports"],
  function(__exports__) {
    "use strict";
    var api = Ember.Object.extend({
      init: function () {
        this._super();
        // a transform will take the prefixName and prefixVal,
        // and return a set accepted by DataStore#all to filter by key/value
        this.keyTransforms = {
          // noop
          defalt: function (type, prefixName, prefixVal) {
            return [type, prefixName, prefixVal];
          }
        };
      },

      // provide a fake API in the case of a static site with preloaded model data
      fakeIt: function () {
        var self = this;

        this.set('add', function (type, model) {
          var count = self.store.all(type).get('length');
          // model will be destroyed on willTransition, so we need a copy to add to the store
          model = JSON.parse(JSON.stringify(model));
          // make sure the new id is past any probable id number in the preloaded data
          model.id = 100 + count;
          return Ember.RSVP.resolve(model);
        });
        this.set('edit', function (type, model) {
          // app code expects plain object (from server), so "create" one
          model = JSON.parse(JSON.stringify(model));
          delete model.canonicalModel;
          return Ember.RSVP.resolve(model);
        });
        this.set('patch', function (type, model) {
          // app code expects plain object (from server), so "create" one
          model = JSON.parse(JSON.stringify(model));
          return Ember.RSVP.resolve(model);
        });
        this.set('deleteModel', function () { return Ember.RSVP.resolve(); });
        this.set('find', function (type, id) { return self.store.find(type, id); });
        this.set('fetchAll', function (type, prefixName, prefixVal, transform) {
          var transformed;

          if (typeof prefixVal === 'undefined') {
            return self.store.all(type);
          }

          transform = self.getTransform(transform);
          transformed = transform(type, prefixName, prefixVal);

          return self.store.all.apply(self.store, transformed);
        });
      },

      add: function (type, model) {
        return new Ember.RSVP.Promise(function (resolve, reject) {
          model = JSON.stringify(model);

          $.ajax({
            url: '/api/v1/' + type,
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: model,
          }).done(function (data) {
            resolve(data);
          }).fail(reject);
        });
      },

      edit: function (type, model) {
        return new Ember.RSVP.Promise(function (resolve, reject) {
          var id = Ember.get(model, 'id');

          model = JSON.stringify(model);

          $.ajax({
            url: '/api/v1/' + type + '/' + id,
            type: 'PUT',
            contentType: 'application/json',
            dataType: 'json',
            data: model,
          }).done(function (data) {
            resolve(data);
          }).fail(reject);
        });
      },

      patch: function (type, model, patchKeys) {
        return new Ember.RSVP.Promise(function (resolve, reject) {
          var id = Ember.get(model, 'id'),
              patches = JSON.stringify(model.getProperties(patchKeys));

          if (typeof id === 'undefined') {
            return reject(new Error('model did not have an id!'));
          }

          $.ajax({
            url: '/api/v1/' + type + '/' + id,
            type: 'PATCH',
            contentType: 'application/json',
            dataType: 'json',
            data: patches,
          }).done(resolve).fail(reject);
        });
      },

      deleteModel: function (type, model) {
        return new Ember.RSVP.Promise(function (resolve, reject) {
          var id = Ember.get(model, 'id');

          if (typeof id === 'undefined') {
            return reject(new Error('model did not have an id!'));
          }

          $.ajax({
            url: '/api/v1/' + type + '/' + id,
            type: 'DELETE',
          }).done(resolve).fail(reject);
        });
      },

      find: function (type, id) {
        var self = this;

        return $.getJSON('/api/v1/' + type + '/' + id).then(function (payload) {
          self.store.load(type, payload);
          return self.store.find(type, id);
        });
      },

      getTransform: function (transform) {
        if (typeof transform === 'string') {
          transform = this.get('keyTransforms.' + transform);
        }

        if (typeof transform === 'undefined') {
          transform = this.get('keyTransforms.defalt');
        }

        if (typeof transform !== 'function') {
          throw new Error('Type of keyTransform was not a function!');
        }

        return transform;
      },

      // allows getting all of a nested type,
      // i.e. /api/v1/prefixName/prefixVal/type
      // e.g. /api/v1/groups/1/items
      //
      // the transform will take the prefixName and prefixVal,
      // and return an array of parameters for DataStore#all
      fetchAll: function (type, prefixName, prefixVal, transform) {
        var self = this;

        transform = this.getTransform(transform);

        if (typeof prefixVal === 'undefined') {
          return $.getJSON('/api/v1/' + type).then(function (payload) {
            self.store.load(type, payload);
            return self.store.all(type);
          });
        }

        if (typeof prefixName !== 'string' || prefixName === '') {
          throw new Error('Tried to search for all of a type, but got no prefix!');
        }

        return $.getJSON('/api/v1/' + prefixName + '/' + prefixVal + '/' + type).then(function (payload) {
          var transformed = transform(type, prefixName, prefixVal);
          self.store.load(type, payload);
          return self.store.all.apply(self.store, transformed);
        });
      }
    });

    __exports__["default"] = api;
  });
define("client/utils/data-store",
  ["exports"],
  function(__exports__) {
    "use strict";
    var DataStore = Ember.Object.extend({
      init: function () {
        this._super();
        this.set('_store', Ember.Object.create());
        this.set('_factories', Ember.Object.create());
      },

      /**
      * Empty out all data records from each internal model store. All models (but not their factories) are lost.
      * @return
      */
      clear: function () {
        for (var type in this._store) {
          if (this._store.hasOwnProperty(type) && typeof this._store[type] === 'object') {
            this._store[type].get('model').clear();
          }
        }
      },

      /**
      * Add a storage unit that will contain models of a given named type. It is initialized empty.
      * @param {String} type A string name of the internal array representation of model data of a certain type.
      * @return
      */
      addType: function (type) {
        if (typeof this._store[type] !== 'undefined') {
          throw new Error('A model type of type "' + type + '" already exists! Cannot add it again.');
        }

        // using ArrayController to sort it now makes later binary search easier
        this._store[type] = Ember.ArrayController.create({
          model: Ember.A(),
          sortProperties: ['id'],
          sortAscending: true,
        });
      },

      /**
      * Keeps a reference of the given model factory internally under the given named type. New models with that named type created from JSON or extended from an existing Ember object-type will be created from this factory, or by default, from `Ember.Object.create()`.
      * @param {String} type A string name representing the model type and its factory type.
      * @param {(Function|Object|Ember.Object)} factory An existing function, object, or Ember.Object that will create a new object of its type when its `.create()` method is invoked. `factory.create()` MUST exist.
      * @return
      */
      registerModelFactory: function (type, factory) {
        if (!this._store[type]) {
          throw new Error('There is no model type ' + type + ' in the datastore!');
        }

        if (typeof this._factories.get(type) !== 'undefined') {
          throw new Error ('There is already a registered model factory of type ' + type + ' in the datastore!');
        }

        if (typeof factory !== 'function' || typeof factory.create === 'undefined') {
          throw new Error ('The model factory of type ' + type + 'you are trying to register is not of the proper datatype!');
        }

        this._factories.set(type, factory);
      },

      /**
      * Create a new model using its factory, or if one doesn't exist, `Ember.Object.create()`. Can be extended from a deep clone of another object or `Ember.Object`. The factory's `.create()` method **MUST** exist.
      * @param {String} type A string name representing the model type and its factory type.
      * @param {...(Object|Ember.Object)} model Optional existing objects or Ember.Objects to extend from, using a deep clone.
      * @return {Ember.Object} The new object.
      */
      createModelOfType: function (type) {
        var args = [].slice.call(arguments, 1),
            factory = this._factories.get(type) || Ember.Object,
            model;

        if (this.get('warnings') && factory === Ember.Object) {
          console.log('WARNING: A model was created of type "' + type + '" even though there was no registered model factory associated with it.');
        }

        model = factory.create();
        this._mergeObject.apply(this, [model].concat(args));
        return model;
      },

      /**
      * Load new models into the internal data storage unit of the named model type. New models will be created using a previously-registered factory of that type if it exists. The payload can be an object or an array of objects.
      * @param {String} type A string name representing the model type, and if its factory was registered, its factory type.
      * @param {(Object|Array)} payload An object or array of objects to load into internal model storage.
      * @return
      */
      load: function (type, payload) {
        var modelType = this._store[type],
            emberizedItems = [],
            foundItem;

        if (!modelType) {
          throw new Error('There is no model of type ' + type + ' in the datastore!');
        }

        if (typeof payload !== 'object') {
          throw new Error('Payload for type ' + type + ' was not an object!', payload);
        }

        if (Array.isArray(payload) && payload.length === 0) {
          return;
        }

        if (!Array.isArray(payload) || (payload.length === 1 && (payload = payload[0]))) {
          foundItem = this._binarySearch(modelType, payload.id);

          if (foundItem) {
            this._mergeObject(foundItem, payload);
          } else {
            modelType.pushObject(this.createModelOfType(type, payload));
          }

          return;
        }

        if (!modelType.get('length')) {
          emberizedItems = payload.map(function (obj) {
            return this.createModelOfType(type, obj);
          }, this);

          this._store[type].pushObjects(emberizedItems);
          return;
        }

        // now we know both payload and the modelType in the store are non-zero-length arrays.
        // we need to check for collisions and update those that exist, and insert those that don't.
        // we also need to be extremely careful not to modify the array while we're searching it.
        payload.forEach(function (item) {
          foundItem = this._binarySearch(modelType, item.id);

          if (foundItem) {
            this._mergeObject(foundItem, item);
          } else {
            emberizedItems.push(this.createModelOfType(type, item));
          }
        }, this);

        modelType.pushObjects(emberizedItems);
      },

      /**
      * Use the containing array to update the properties of an object it contains and notify observers.
      * @param {Object} obj The object you want the following arguments' object properties to be merged into.
      * @param {...(Object|Ember.Object)} model Optional existing objects or Ember.Objects to extend from, using a deep clone.
      * @return
      */
      _mergeObject: function (obj) {
        var args = [].slice.call(arguments, 1);
        var i, prop, curr;

        for (i = 0; i !== args.length; ++i) {
          if (typeof obj !== 'object' || Array.isArray(obj)) {
            continue;
          }

          // easily create a deep clone of an object/Ember.Object.
          curr = JSON.parse(JSON.stringify(args[i]));

          for (prop in curr) {
            if (curr.hasOwnProperty(prop)) {
              obj.set(prop, curr[prop]);
            }
          }
        }
      },

      /**
      * Sort the internal model array by a specified key.
      * Since the arrays are always sorted by id, searching by id offers significant speedup.
      * Uses `<` to determine whether one object's property is before another.
      *
      * @param {(String|modelType)} type A string name of the internal array representation of model data of a certain type, or the array itself.
      * @param {String} [key=id] A key name to sort by. Defaults to 'id'.
      * @return {Array} A copy of the array, but sorted by `key`.
      */
      _sortBy: function (type, key) {
        var sortedArray;

        key = key || 'id';

        if (typeof type === 'string') {
          sortedArray = this._store[type];
        } else {
          sortedArray = type;
        }

        if (key !== 'id') {
          sortedArray = sortedArray.sortBy(key);
        }

        return sortedArray;
      },

      /**
      * Search the internal model array (already sorted by `key`), for an object with type `value` in that `key`.
      *
      * @param {Array} sortedArray An array that has already been sorted by `key`.
      * @param {(String|Number|Date)} value The value to check on the current object's `key`. Anything that can be compared with `<`.
      * @param {String} [key=id] The key to search objects by within sortedArray. Defaults to 'id'.
      * @return {Object} The found object or undefined.
      */
      _binarySearch: function (sortedArray, value, key) {
        key = key || 'id';

        if (typeof value === 'undefined') {
          throw new Error('The value for binary searching was undefined!');
        }

        if (key === 'id' && value < 0) {
          throw new Error('The value for binary searching by id was less than zero!');
        }

        if (!sortedArray.get('length')) {
          return;
        }

        var beg = 0,
            end = sortedArray.get('length') - 1,
            mid,
            checkedItem;

        while (beg <= end) {
          mid = beg + Math.floor((end - beg) / 2);
          checkedItem = sortedArray.objectAt(mid);

          if (checkedItem[key] < value) {
            beg = mid + 1;
          } else if (checkedItem[key] > value) {
            end = mid - 1;
          } else {
            return checkedItem;
          }
        }

        return;
      },

      /**
      * Finds all models in modelType with key === val.
      * `key` is optional; searches `id` key by default if given two arguments.
      * `val` is optional; returns all models if not given.
      *
      * @param {String} type The name of the modelType you wish to search through.
      * @param {String} [key=id] Optional key to search modelType. Defaults to `id` if not given.
      * @param {(Number|String|Date)} val Optional value you're looking for in `key`.
      * @returns {Array} Returns an array with any objects that matched.
      */
      all: function (type, key, val) {
        var modelType = this._store[type];

        if (!modelType) {
          throw new Error('There is no model of type ' + type + ' in the datastore!');
        }

        if (typeof val === 'undefined') {
          if (typeof key === 'undefined') {
            return modelType;
          } else if (typeof key === 'number' || !isNaN(parseInt(key, 10))) {
            // we're searching by id, leverage the fact that it's already sorted
            return [this._binarySearch(modelType, parseInt(key, 10))];
          }

          // no idea what we're trying to search, but it's not an number id
          return [];
        }

        return modelType.filterBy(key, val);
      },

      /**
      * Finds the first model in modelType with key === val.
      * `key` is optional; searches `id` key by default if given two arguments.
      *
      * @param {String} type The name of the modelType you wish to search through.
      * @param {String} [key=id] Optional key to search modelType. Defaults to `id` if not given.
      * @param {(Number|String|Date)} val The value you're looking for in `key`.
      * @returns {(Object|undefined)} Returns the object or undefined if it wasn't found.
      */
      find: function (type, key, val) {
        var modelType = this._store[type];

        if (!modelType) {
          throw new Error('There is no model of type ' + type + ' in the datastore!');
        }

        // we're searching by id, leverage the fact that it's already sorted
        if (typeof val === 'undefined') {
          if (isNaN(parseInt(key, 10))) {
            return;
          } else {
            return this._binarySearch(modelType, parseInt(key, 10));
          }
        }

        return modelType.findBy(key, val);
      },

      deleteModels: function (type, models) {
        var modelType = this._store[type];

        if (!modelType) {
          throw new Error('There is no model of type ' + type + ' in the datastore!');
        }

        if (Array.isArray(models)) {
          modelType.removeObjects(models);
        } else if (typeof models === 'object') {
          modelType.removeObject(models);
        }
      },

      seekAndDestroy: function (type, key, val) {
        var models = this.all(type, key, val);
        this.deleteModels(type, models);
      },
    });

    __exports__["default"] = DataStore;
  });
define("client/utils/fastclick",
  ["exports"],
  function(__exports__) {
    "use strict";
    var FastClickInit = function () {
      Ember.$(function () {
        Ember.run.scheduleOnce('afterRender', function () {
          FastClick.attach(document.body);
        });
      });
    };

    __exports__["default"] = FastClickInit;
  });
define("client/utils/sequelize-data-transform",
  ["exports"],
  function(__exports__) {
    "use strict";
    function sequelizeTransform (type, prefix, id) {
      if (typeof id !== 'number' && isNaN(parseInt(id, 10))) {
        throw new Error('Tried to get all of a prefixed type, but the id was not in a proper format!', id);
      }

      id = parseInt(id, 10);

      // change prefix to fit Sequelize property name style
      // original type is like 'groups', need 'GroupId'
      prefix = prefix[0].toUpperCase() + prefix.slice(1, prefix.length-1);
      prefix += 'Id';

      return [type, prefix, id];
    }

    __exports__["default"] = sequelizeTransform;
  });
define("client/views/application",
  ["exports"],
  function(__exports__) {
    "use strict";
    var ApplicationView = Em.View.extend({
      classNames: ['application'],
    });

    __exports__["default"] = ApplicationView;
  });
define("client/views/field",
  ["exports"],
  function(__exports__) {
    "use strict";
    var FieldView = Ember.View.extend({
      init: function () {
        this._super();

        var type = this.get('field.type');

        if (type === 'String') {
          this.set('isString', true);
        } else if (type === 'Number') {
          this.set('isNumber', true);
        } else if (type === 'Boolean') {
          this.set('isBoolean', true);
        } else if (type === 'Date') {
          this.set('isDate', true);
        }
      }
    });

    __exports__["default"] = FieldView;
  });