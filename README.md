# wishlist

A webapp to categorize the things you need to remember.

# random notes to myself:

need to run test server when doing `grunt test` or `grunt build`

- command should be `node server.js [environment] [karma-server-port (e.g. 9876)]`
- if you change the server port, you need to change it in `test/frontend/app/main.js`, under `App.ApplicationAdapter.reopen`. The reason is that CORS is needed since Karma runs the frontend app under a different port
- need to list libraries to be concatted into `scripts/vendor/environment.js` in `views/app` and also in karma.app.conf.js

gonna be switching out the module system to es6 and probably the test harness to make things easier, so most of these list items should be obsolete soon enough.
