const express = require('express');
const { createViewPath, joinPath } = require('./helpers/FileHelper');

class Server {
    constructor() {
        this.PORT = 3000;
        this.app = express();
    }

    setEngine() {
        this.app.set('view engine', 'ejs');
    }

    setStatic() {
        this.app.use(express.static('src/web/css'));
        // bootstrap
        this.app.use('/css', express.static(joinPath(__dirname, 'node_modules/bootstrap/dist/css')));
        this.app.use('/js', express.static(joinPath(__dirname, 'node_modules/bootstrap/dist/js')));
        this.app.use('/js', express.static(joinPath(__dirname, 'node_modules/jquery/dist')));
    }

    startServer() {
        let self = this;

        self.app.listen(self.PORT, (error) => {
            error ? console.log(error) : console.log(`listening port ${self.PORT}`);
        });
    }

    setRouters() {
        this.app.get('/', (req, res) => {
            res.render(createViewPath('index'));
        });
    }
}

module.exports = Server;