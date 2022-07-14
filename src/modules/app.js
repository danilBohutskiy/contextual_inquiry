const Server = require('./server');

class App {
    constructor() {
        this.server = new Server();
    }

    run() {
        this.server.setEngine();
        this.server.setMiddleWare();
        this.server.initStatic();
        this.server.setRouters();
        this.server.startServer();
    }
}

module.exports = App;