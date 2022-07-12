const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

const htmlTojQueryDoc = (html) => $(html);

module.exports = {
    htmlTojQueryDoc
};