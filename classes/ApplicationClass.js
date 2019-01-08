const numCPUs = require('os').cpus().length;
const cluster = require('cluster');
const SocketController = require('./../controllers/SocketController');

class ApplicationClass {

    constructor(options) {
        this.transport = options.transport;
        this.isClusterMode = options.cluster.enabled;
        if (this.isClusterMode) {
            this.clusterOptions = options.cluster;
        }
        this.worker_pids = [];
        this.httpServer = {};
        this.socketIO = {};
    }

    async start() {
        if (!this.isClusterMode) {
            await this.startWorker();
            await this.startTransport();
            return null;
        }

        if (!this.isMaster) {
            await this.startWorker();
            if (!this.transport.isPermanentConnection) {
                await this.startTransport();
            }
            return null;
        }

        await this.startCluster();
        if (this.transport.isPermanentConnection) {
            await this.startTransport();
        }
    }

    async startTransport() {
        this.httpServer = await this.transport.startHttp();
        console.log(`${this.isMaster ? 'Master' : 'Worker'} ${process.pid} http instance started on port ${this.transport.port}`);

        if (this.transport.isPermanentConnection) {
            this.socketIO = await this.transport.startSocketIO(this.httpServer);
            console.log(`Permanent socket connection started`);
            this.socketIO.on('connection', this.onSocketConnection);
        }
    }

    async startWorker() {
        if (this.isClusterMode) {
            cluster.worker.on('message', this.onWorkerMessage);
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

        cluster.on('message', this.onClusterMessage);
        return null;
    }

    get isMaster() {
        return cluster.isMaster;
    }

    async onWorkerMessage(msg) {
        if (msg.cmd && msg.cmd === 'employee.list') {
            let result = {
                cmd: 'employee.list.result',
                data: await SocketController.getEmployeeList(),
                socketid: msg.socketid
            };
            cluster.worker.send(result);
        }
    }

    async onClusterMessage(worker, msg) {
        if (msg.cmd && msg.cmd === 'employee.list.result') {
            this.socketIO.to(msg.socketid).emit('employee.list', msg.data);
        }
    }

    async onSocketConnection(socket) {
        socket.on('employee.list', async(params) => {
            if (!this.isClusterMode) {
                socket.emit('employee.list', await SocketController.getEmployeeList());
                return null;
            }
            let worker = await this.chooseRandomWorker();
            worker.send({cmd: 'employee.list', socketid: socket.id});
        })
    }

    async chooseRandomWorker() {
        let rand = Math.floor(Math.random() * numCPUs);
        let workerId = this.worker_pids[rand].id;
        return cluster.workers[workerId];
    }
}

module.exports = ApplicationClass;