const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

const TEXT_TAGS = [
    'p', 'span', 'textarea',
    'h1', 'h2', 'h3', 'h4',
    'b', 'strong', 'label',
    'pre', 'blockquote',
    'a',
    'li', 'ol',
];

class TextModule {
    constructor(document) {
        this.document = document;
        this.wordsCount = null;
    }

    // only by tags map
    getWordsCount() {
        let self = this;

        let wordsCount = 0;
        let el_data = {};

        $.each(TEXT_TAGS, (index, tag) => {
            let elements = $(self.document).find(tag).filter(':not(:empty)');

            let items_text = [];
            $.each(elements, (tag_i, tag_item) => {
                let text = $(tag_item).text().replace(/[\n ]/g, '').trim();
                items_text.push(text);

                let text_count = text.split(' ').length;
                wordsCount += text_count;
            });

            el_data[tag] = {
                count: elements.length,
                text: items_text.join(' ')
            };
        });

        return {
            tags: el_data,
            total_words: wordsCount
        };
    }

    run() {
        let self = this;

        self.wordsCount = this.getWordsCount();

        return {
            data: self.wordsCount,
        }
    }


}

module.exports = TextModule;