const numCPUs = require('os').cpus().length;
const http = require('http');
const cluster = require('cluster');
const socketio = require('socket.io');
const async = require('async');
const SocketController = require('./controllers/SocketController');
const _ = require('underscore')._;
const utils = require('./utils');

class ApplicationClass {

    constructor(options) {
        this.transport = options.transport;
        this.isClusterMode = options.cluster.enabled;
        if( this.isClusterMode ) {
            this.clusterOptions = options.cluster;
        }
        this.app = options.app;
        this.port = options.port;
        this.worker_pids = [];
        this.server = {};
        this.io = {};
    }

    async start() {
        if( this.isClusterMode ) {
            if( this.isMaster ) {
                await this.startCluster();
                if( this.transport.isPermanentConnection ) {
                    await this.startTransport();
                }
            }
            else {
                await this.startWorker();
                if( !this.transport.isPermanentConnection ) {
                    await this.startTransport();
                }
            }
        }
        else {
            await this.startWorker();
            await this.startTransport();
        }
    }

    async startTransport() {
        this.server = http.Server(this.app).listen(this.port, () => {
            console.log(`${this.isMaster ? 'Master' : 'Worker'} ${process.pid} http instance started on port ${this.port}`);
        });

        if ( this.transport.isPermanentConnection ) {
            this.io = socketio(this.server);
            console.log(`Permanent socket connection started`);

            this.io.on('connection', (socket) => {
                socket.on('employee.list', async (params) => {

                    if (this.isClusterMode) {
                        // Not using because of 'out of memory' error in unixCPU library
                        // async.map(this.worker_pids, utils.getCPU_Load, function (err, result) {
                        //     let resultArrWithoutNull = _.without(result, null);
                        //     let minObject = _.min(resultArrWithoutNull, function (resultArrWithoutNull) {
                        //         return resultArrWithoutNull.cpu;
                        //     });
                        //     let worker = cluster.workers[minObject.id];
                        //     worker.send({cmd: 'employee.list', socketid: socket.id});
                        // });

                        let rand = Math.floor(Math.random() * numCPUs);
                        let workerId = this.worker_pids[rand].id;
                        let worker = cluster.workers[workerId];
                        worker.send({cmd: 'employee.list', socketid: socket.id});
                    }
                    else {
                        socket.emit('employee.list', await SocketController.getEmployeeList());
                    }

                })
            });
        }
    }

    async startWorker() {
        if (this.isClusterMode) {
            cluster.worker.on('message', async(msg) => {
                if (msg.cmd && msg.cmd === 'employee.list') {
                    let result = {
                        cmd: 'employee.list.result',
                        data: await SocketController.getEmployeeList(),
                        socketid: msg.socketid
                    };
                    cluster.worker.send(result);
                }
            });
        }
        return null;
    }

    async startCluster() {
        console.log(`Master ${process.pid} is running`);
        for (let i = 0; i < numCPUs; i++) {
            const worker = cluster.fork();
            this.worker_pids.push({"id": worker.id, "pid": worker.process.pid});
            console.log(`Worker ${worker.process.pid} started`);
        }

        cluster.on('message', (worker, msg) => {
            if (msg.cmd && msg.cmd === 'employee.list.result') {
                this.io.to(msg.socketid).emit('employee.list', msg.data);
            }
        });

        return null;
    }

    get isMaster() {
        return cluster.isMaster;
    }
}

module.exports = ApplicationClass;