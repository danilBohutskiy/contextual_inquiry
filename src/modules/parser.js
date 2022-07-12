const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

class Parser
{
    constructor(html) {
        this.html = html;
        this.document = $(html);
    }
}

module.exports = Parser;