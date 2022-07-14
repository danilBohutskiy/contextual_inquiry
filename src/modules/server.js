const express = require('express');
const fileUpload = require('express-fileupload');
const Parser = require('./parser');
const { rootDir, createViewPath, joinPath } = require('../helpers/FileHelper');

class Server {
    constructor() {
        this.PORT = 3000;
        this.app = express();
    }

    setEngine() {
        this.app.set('view engine', 'ejs');
    }

    setMiddleWare() {
        // enable file upload
        this.app.use(fileUpload({createParentPath: true}));
    }

    setStatic() {
        this.app.use(express.static('src/web/css'));
        // bootstrap
        this.app.use('/css', express.static(joinPath(rootDir, 'node_modules/bootstrap/dist/css')));
        this.app.use('/js', express.static(joinPath(rootDir, 'node_modules/bootstrap/dist/js')));
        this.app.use('/js', express.static(joinPath(rootDir, 'node_modules/jquery/dist')));
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

        this.app.post('/upload', (req, res) => {
            try {
                let file = req.files.uploadFile;
                let mimeType = file.mimetype;
                if ( !(mimeType.indexOf('html') > -1) )
                    res.send('File must be a .html extension!');

                let data = file.data.toString();
                let parser = new Parser(data);

                res.send(parser.data);
            } catch (e) {
                console.log(e);
                res.sendStatus(500);
            }
        });
    }
}

module.exports = Server;