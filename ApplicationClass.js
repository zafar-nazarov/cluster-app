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
        const server = http.Server(this.app).listen(this.port, () => {
            console.log(`${this.isMaster ? 'Master' : 'Worker'} ${process.pid} http instance started on port ${this.port}`);
        });

        if ( this.transport.isPermanentConnection ) {
            const io = socketio(server);
            console.log(`Permanent socket connection started`);

            io.on('connection', (socket) => {
                socket.on('employee.list', (params) => {

                    async.map(this.worker_pids, utils.getCPU_Load, function (err, result) {
                        let resultArrWithoutNull = _.without(result, null);
                        let minObject = _.min(resultArrWithoutNull, function (resultArrWithoutNull) {
                            return resultArrWithoutNull.cpu;
                        });
                        let worker = cluster.workers[minObject.id];
                        // worker.send({ cmd: 'employee.list', socket: socket });
                        let someHandle;
                        worker.send({ cmd: 'employee.list' }, someHandle, (resp) => {
                            console.log('resp', resp);
                        });
                    });

                })
            })
        }
    }

    async startWorker() {
        cluster.worker.on('message', async (msg, cb) => {
            console.log('Received msg pid =', process.pid, ' Msg:', msg);
            if (msg.cmd && msg.cmd === 'employee.list') {
                let resp = await SocketController.getEmployeeList();
                // socket.emit('employee.list', resp);
                cb(resp);
            }
        });
        return null;
    }

    async startCluster() {
        console.log(`Master ${process.pid} is running`);
        for (let i = 0; i < numCPUs; i++) {
            const worker = cluster.fork();
            this.worker_pids.push({"id": worker.id, "pid": worker.process.pid});
            console.log(`Worker ${worker.process.pid} started`);
        }
        return null;
    }

    get isMaster() {
        return cluster.isMaster;
    }
}

module.exports = ApplicationClass;