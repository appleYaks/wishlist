need to run test server when doing `grunt test` or `grunt build`
- command should be `node server.js [environment] [karma-server-port (e.g. 9876)]
- if you change the server port, you need to change it in `test/frontend/app/main.js`, under `App.ApplicationAdapter.reopen`. The reason is that CORS is needed since Karma runs the frontend app under a different port
