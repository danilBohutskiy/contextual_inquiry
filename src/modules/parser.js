const { htmlTojQueryDoc } = require('../helpers/HtmlHelper');
const TextModule = require('./parser-modules/TextModule');
const ColorsModule = require('./parser-modules/ColorsModule');
const SectionsModule = require('./parser-modules/SectionsModule');

const MODULES_MAP = {
    TextModule,
    ColorsModule,
    SectionsModule
};

class Parser
{
    constructor(html) {
        this.document = htmlTojQueryDoc(html);
        this.data = {};
        this.run();
    }

    run() {
        let self = this;

        for (let moduleName in MODULES_MAP) {
            let module = new MODULES_MAP[moduleName](self.document);
            this.data[moduleName] = module.run();
        }
    }
}

module.exports = Parser;