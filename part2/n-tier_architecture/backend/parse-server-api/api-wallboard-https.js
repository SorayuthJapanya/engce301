const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const path = require('path');
const cron = require("node-cron");
const mongoose = require('mongoose');
var cors = require('cors');
var fs = require('fs');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

var apiport = 5005;

const config = {
  databaseURI: 'mongodb://wallboarduser:WB1qazxsw2@10.21.47.33:27017/wallboarddb-team05',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'wallboardapi',
  masterKey: process.env.MASTER_KEY || 'wallboardapi', //Add your master key here. Keep it secret!
  clientKey: 'wallboardapi',
  javascriptKey: 'wallboardapi',
  serverURL: 'https://lab-parse-server.cpe-rmutl.net/team05/api', // Don't forget to change to https if needed
  publicServerURL: 'https://lab-parse-server.cpe-rmutl.net/team05/api',
  liveQuery: {
    classNames: ["OnlineAgentLists", "WallboardBanners", "CallAgentSummaries"], // List of classes to support for query subscriptions
  },

  masterKeyIps: ["0.0.0.0/0", "::/0"],
  useMasterKey: true,
  allowClientClassCreation: false,
  allowExpiredAuthDataToken: false,
  // encodeParseObjectInCloudFunction: false
};

const app = express();

app.use(cors());
app.use(cors({ origin: "*" }));

// Serve static assets from the /public folder
app.use("/", express.static(path.join(__dirname, "/wallboard")));

// Serve the Parse API on the /parse URL prefix
const mountPath = "/api";
const api = new ParseServer(config);

// 3. Start up Parse Server asynchronously
api.start();

app.use(mountPath, api.app);

const options = {
  key: fs.readFileSync('server.key'),  // Path to your private key file
  cert: fs.readFileSync('server.crt'),  // Path to your certificate file
};

var httpsServer = require("https").createServer(options, app);

httpsServer.listen(apiport, function () {
  console.log("Wallboard API (https) running on port " + apiport + ".");
});

ParseServer.createLiveQueryServer(httpsServer);
