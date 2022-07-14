const path = require('path');

const rootDir = path.resolve(__dirname, '../../');

const createViewPath = (page) => path.resolve(__dirname, '../ejs-views', `${page}.ejs`);

const joinPath = (first, second) => path.join(first, second);

module.exports = {
    rootDir,
    createViewPath,
    joinPath,
};