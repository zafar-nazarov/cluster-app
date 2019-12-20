const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const Application = require('./classes/ApplicationClass');
const Transport = require('./classes/TransportClass');
const EmployeeModel = require('./models/EmployeeModel');

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

let transportOptions = {
    app: app,
    port: port,
    isPermanentConnection: true
};
const transport = new Transport(transportOptions);

let appOptions = {
    transport: transport,
    cluster: {
        enabled: true
    },
    app: app,
    port: port
};

const server = new Application(appOptions);
server.start();


async function addUser() {
    await (new Promise(done => setTimeout(done, 500)));

    let user = {
        test: 1
    };
    try {
        const employee = new EmployeeModel(user);
        let result = await employee.save();
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}

// addUser();
