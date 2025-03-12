var express = require('express');
var ParseDashboard = require('parse-dashboard');
var cors = require('cors');
var fs = require('fs');

// Allow insecure HTTP (set to false for production)
var options = { allowInsecureHTTP: true };

var apiport = 4000;
var dashboard_port = 4001;

// SSL/TLS certificate options
var cert_options = {
  key: fs.readFileSync('server.key'),  // Path to your private key file
  cert: fs.readFileSync('server.crt')  // Path to your certificate file
};

// Parse Dashboard configuration
var dashboard = new ParseDashboard({
  "apps": [{
    "serverURL": 'https://172.17.111.72:' + apiport + '/api',
    "appId": 'wallboardapi',
    "masterKey": 'wallboardapi',
    "appName": 'wallboardapi',
    "production": true
  }],
  "trustProxy": true, // Set to true if behind a proxy
  "users": [
    {
      "user": "user",
      "pass": "1234" // Replace with a strong password
    },
    {
      "user": "user2",
      "pass": "1234" // Replace with a strong password
    },
  ]
}, options);

var dashApp = express();

// Enable CORS
dashApp.use(cors({ origin: '*' }));

// Make the Parse Dashboard available at /
dashApp.use('/', dashboard);

// Create HTTPS server for the dashboard
var httpServerDash = require('https').createServer(cert_options, dashApp);

httpServerDash.listen(dashboard_port, function () {
  console.log('Parse-dashboard server running on port ' + dashboard_port + '.');
});