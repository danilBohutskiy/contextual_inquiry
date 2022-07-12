const path = require('path');

const createViewPath = (page) => path.resolve(__dirname, '../../ejs-views', `${page}.ejs`);

const joinPath = (first, second) => path.join(first, second);

module.exports = {
    createViewPath,
    joinPath
};