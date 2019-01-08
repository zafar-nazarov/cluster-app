const http = require('http');
const socketio = require('socket.io');

class TransportClass {

    constructor(options) {
        this.app = options.app;
        this.port = options.port;
        this.isPermanentConnection = options.isPermanentConnection;
    }

    async startHttp() {
        return http.Server(this.app).listen(this.port);
    }

    async startSocketIO(server) {
        return socketio(server);
    }
}

module.exports = TransportClass;