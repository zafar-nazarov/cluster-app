const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const Application = require('./ApplicationClass');

const app = express();
app.use('/', routes);
let port = 8000;

const dbOptions = {
    autoIndex: false,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
};
mongoose.connect('mongodb://localhost:27017/clusterapp', dbOptions);

let appOptions = {
    transport: {
        isPermanentConnection: false
    },
    cluster: {
        enabled: true
    },
    app: app,
    port: port
};

const server = new Application(appOptions);
server.start();
