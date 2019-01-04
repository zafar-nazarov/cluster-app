// const cluster = require('cluster');
// const http = require('http');
// const numCPUs = require('os').cpus().length;
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const Application = require('./ApplicationClass');

const app = express();
app.use('/', routes);
// let isCluster = true;
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
        isPermanentConnection: true
    },
    cluster: {
        enabled: true
    },
    app: app,
    port: port
};

const server = new Application(appOptions);
server.start();


// if (isCluster) {
//     if (cluster.isMaster) {
//         console.log(`Master ${process.pid} is running`);
//         for (let i = 0; i < numCPUs; i++) {
//             cluster.fork();
//         }
//     }
//     else {
//         http.createServer(app).listen(port, () => {
//             console.log(`Worker ${process.pid} started`);
//         });
//     }
// }
// else {
//     const server = http.createServer(app);
//     server.listen(port, () => {
//         console.log(`No cluster server listening port ${port}`);
//     })
// }