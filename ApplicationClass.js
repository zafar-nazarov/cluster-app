class ApplicationClass {
    constructor(options) {
        this.transport = options.transport;
        this.isClusterMode = !!options.cluster;
        if( this.isClusterMode ) {
            this.clusterOptions = options.cluster;
        }
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
    }

    async startWorker() {
        //todo: логика запуска обработчика запросов
    }

    async startCluster() {
        //todo: логика запуска дочерних процессов
    }

    get isMaster() {
        //todo: логика проверки что это мастер процесс
    }
}