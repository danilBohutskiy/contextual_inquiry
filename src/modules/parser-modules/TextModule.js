const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

const TEXT_TAGS = [
    'p', 'span', 'textarea', 'a',
    'h1', 'h2', 'h3', 'h4',
    'b', 'strong', 'pre', 'blockquote', 'address',
    'label', 'li', 'ol'
];

class TextModule {
    constructor(document) {
        this.document = document;
    }

    getData() {
        let data = {};

        data.words = this.getWordsData();

        return data;
    }

    getWordsData() {
        let self = this;

        let total_words_count = 0;

        let tag_data_arr = {};

        $.each(TEXT_TAGS, (tag_selector_i, tag_selector) => {
            let tags = $(self.document).find(tag_selector).filter(':not(:empty)');

            let items = [];
            let tag_words_count = 0;
            let tag_text_total = [];

            $.each(tags, (tag_i, tag_item) => {
                let tag_text = self.formatText($(tag_item).text());
                if (!tag_text)
                    return;

                tag_text_total.push(tag_text);
                items.push(tag_text);

                let text_count = tag_text.split(' ').length;

                tag_words_count += text_count;
                total_words_count += text_count;
            });

            tag_data_arr[tag_selector] = {
                items: items,
                count: tags.length,
                total_text: tag_text_total.join(' '),
                words_count: tag_words_count,
            };
        });

        return {
            tags: tag_data_arr,
            total_words: total_words_count
        };
    }

    formatText(text) {
        // remove escape line
        let formatted_text = text.replace(/[\\n ]/g, '').trim();
        // remove double spaces
        formatted_text = formatted_text.replace(/\s{2,}/g,' ');
        // return formatted
        return formatted_text;
    }

    run() {
        return this.getData();
    }
}

module.exports = TextModule;