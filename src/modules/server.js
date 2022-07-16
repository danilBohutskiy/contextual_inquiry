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

    setJsStatic(path) {
        this.app.use('/js', express.static(joinPath(rootDir, path)));
    };

    setCssStatic(path) {
        this.app.use('/css', express.static(joinPath(rootDir, path)));
    }

    initStatic() {
        this.setJsStatic('node_modules/jquery/dist');
        this.setJsStatic('node_modules/chart.js/dist');
        this.setJsStatic('/src/web/js');

        this.setCssStatic('node_modules/bootstrap/dist/css');
        this.setCssStatic('/src/web/css');
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
                let file = req.files.document;
                let mimeType = file.mimetype;
                if ( !(mimeType.indexOf('html') > -1) )
                    res.send('File must be a .html extension!');

                let data = file.data.toString();
                let parser = new Parser(data);

                res.render(createViewPath('result'), {data: JSON.stringify(parser.data)});
            } catch (e) {
                console.log(e);
                res.sendStatus(500);
            }
        });
    }
}

module.exports = Server;