const numCPUs = require('os').cpus().length;
const http = require('http');
const cluster = require('cluster');
const socketio = require('socket.io');
const unixCPU = require('pidusage');
const async = require('async');
const SocketController = require('./controllers/SocketController');
const _ = require('underscore')._;

class ApplicationClass {

    constructor(options) {
        this.transport = options.transport;
        this.isClusterMode = options.cluster.enabled;
        if( this.isClusterMode ) {
            this.clusterOptions = options.cluster;
        }
        this.app = options.app;
        this.port = options.port;
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
        //todo: логика запуска транспорта
        http.createServer(this.app).listen(this.port, () => {
            if (this.isMaster) {
                console.log(`Master ${process.pid} http instance started on port ${this.port}`);
            } else {
                console.log(`Worker ${process.pid} http instance started on port ${this.port}`);
            }
        });

        if ( this.transport.isPermanentConnection ) {
            const io = socketio(http);
            console.log(`Permanent socket connection started`);

            io.on('connection', (socket) => {
                console.log('Client connected to socket');
                socket.on('employee.list', (params) => {
                    console.log('Client sent employee.list request');

                    async.map(cluster.workers, this.getCPU_Load, function (err, result) {
                        let resultArrWithoutNull = _.without(result, null);
                        let minObject = _.min(resultArrWithoutNull, function (resultArrWithoutNull) {
                            return resultArrWithoutNull.cpu;
                        });

                        let worker = cluster.workers[minObject.id];
                        worker.send({ cmd: 'employee.list', socket: socket });
                    });

                })
            })
        }
    }

    async startWorker() {
        //todo: логика запуска обработчика запросов

        return null;
    }

    async startCluster() {
        console.log(`Master ${process.pid} is running`);
        for (let i = 0; i < numCPUs; i++) {
            const worker = cluster.fork();
            console.log(`Worker ${worker.process.pid} started`);
            worker.on('message', async (msg) => {
                if (msg.cmd && msg.cmd === 'employee.list') {
                    let resp = await SocketController.getEmployeeList();
                    msg.socket.emit('employee.list', resp);
                }
            });
        }
        return null;
    }

    get isMaster() {
        return cluster.isMaster;
    }

    async getCPU_Load(worker, cb) {
        unixCPU.stat(worker.process.pid, function (err, result) {
            if (err) {
                console.error('Error in getCPU_Percent. Err: ', err);
                return cb(err, null);
            }
            cb(null, {"id": worker.id, "cpu": result.cpu, "pid": worker.pid});
        });
    }
}

module.exports = ApplicationClass;