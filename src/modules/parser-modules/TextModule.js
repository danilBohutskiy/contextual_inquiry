const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

const LONG_TAGS_LIST = [
    'p', 'article',
];

const SHORT_TAGS_LIST = [
    'span', 'b', 'strong', 'abbr', 'address',
];

const TITLE_TAGS_LIST = [
    'h1', 'h2', 'h3', 'h4',
];

const CAPTION_TAGS_LIST = [
  'caption', 'label', 'legend'
];

const QUOTE_TAGS_LIST = [
    'blockquote',
];

const LINE_TAGS_LIST = [
    'li', 'ol'
];

const LONG_TAGS_WORDS_MIN    = 100;
const LONG_TAGS_WORDS_MAX    = 200;

const SHORT_TAGS_WORDS_MIN   = 25;
const SHORT_TAGS_WORDS_MAX   = 50;

const TITLE_LENGTH_MIN       = 60;
const TITLE_LENGTH_MAX       = 70;
// OR
const TITLE_WORDS_MIN        = 10;
const TITLE_WORDS_MAX        = 25;

const CAPTION_LENGTH_MAX     = 50;
const QUOTE_WORDS_MIN        = 40;
const LINE_LENGTH_MAX        = 70;

class TextModule {
    constructor(document) {
        this.document = document;
        this.tags = this.getTagsMap();
    }

    getTagsMap() {
       return [].concat.apply([], [
           LONG_TAGS_LIST,
           SHORT_TAGS_LIST,
           TITLE_TAGS_LIST,
           CAPTION_TAGS_LIST,
           QUOTE_TAGS_LIST,
           LINE_TAGS_LIST,
       ]);
    }

    getData() {
        let data = {};

        data.readable = this.getReadableData();

        return data;
    }

    getTextCountWords(text) {
        return text ? text.split(' ').length : 0;
    }

    getTextLength(text) {
        return text ? text.length : 0;
    }

    formatText(text) {
        // remove escape line
        let formatted_text = text.replace(/[\\n ]/g, '').trim();
        // remove double spaces
        formatted_text = formatted_text.replace(/\s{2,}/g,' ');
        // return formatted
        return formatted_text;
    }

    isTextReadable(text, selector) {
        let self = this;

        let words_count = self.getTextCountWords(text);
        let text_length = self.getTextLength(text);

        // long
        if (LONG_TAGS_LIST.includes(selector))
            return words_count >= LONG_TAGS_WORDS_MIN && words_count <= LONG_TAGS_WORDS_MAX;

        if (SHORT_TAGS_LIST.includes(selector))
            return words_count >= SHORT_TAGS_WORDS_MIN && words_count <= SHORT_TAGS_WORDS_MAX;

        if (TITLE_TAGS_LIST.includes(selector))
            return (words_count >= TITLE_WORDS_MIN && words_count <= TITLE_WORDS_MAX) || (text_length >= TITLE_LENGTH_MIN && text_length <= TITLE_LENGTH_MAX);

        if (CAPTION_TAGS_LIST.includes(selector))
            return text_length <= CAPTION_LENGTH_MAX;

        if (QUOTE_TAGS_LIST.includes(selector))
            return words_count >= QUOTE_WORDS_MIN;

        if (LINE_TAGS_LIST.includes(selector))
            return text_length <= LINE_LENGTH_MAX;

        return false;
    }

    getReadableData() {
        let self = this;

        let total_words_count = 0;

        let tag_data_arr = {};

        $.each(self.tags, (tag_selector_i, tag_selector) => {
            let all_tags = $(self.document).find(tag_selector).filter(':not(:empty)');

            let items = [];
            let tag_text_total = [];
            let tag_words_count = 0;

            let tag_is_normal = 0;

            $.each(all_tags, (tag_i, tag_item) => {
                let tag_text = self.formatText($(tag_item).text());
                if (!tag_text)
                    return;

                let text_length = self.getTextLength(tag_text);
                let text_words_count = self.getTextCountWords(tag_text);

                let is_readable = self.isTextReadable(tag_text, tag_selector);

                if (is_readable)
                    tag_is_normal++;

                tag_words_count += text_words_count;
                total_words_count += text_words_count;
                tag_text_total.push(tag_text);

                items.push({
                    text: tag_text,
                    text_length: text_length,
                    text_words_count: text_words_count,
                    is_readable: is_readable,
                });
            });

            tag_data_arr[tag_selector] = {
                items: items,
                count: items.length,
                total_text: tag_text_total.join(' '),
                total_words_count: tag_words_count,
                total_readable: tag_is_normal ? (tag_is_normal / items.length * 100).toFixed(2) : 0,
            };
        });

        return {
            tags: tag_data_arr,
            total_words: total_words_count
        };
    }

    getCorrectTagsChartData(data) {
        let tags = data.readable.tags;
        let tag_name_map = [];
        let tag_count_map = [];

        $.each(tags, function (tag_name, tag_item) {
            if (tag_item.count === 0 || tag_item.total_readable === 0)
                return;

            let tag_name_count = `<${tag_name}> ( ${tag_item.count} )`;
            tag_name_map.push(tag_name_count);
            tag_count_map.push(tag_item.total_readable);
        });

        return {
            labels: tag_name_map,
            data: tag_count_map
        }
    }

    getCountWordsChartData(data) {
        let tags = data.readable.tags;
        let tag_name_map = [];
        let tag_count_map = [];

        $.each(tags, function (tag_name, tag_item) {
            if (tag_item.count == 0 || tag_item.total_readable === 0 || tag_item.total_words_count == 0)
                return;

            let tag_name_count = `<${tag_name}> ( ${tag_item.count} )`;
            tag_name_map.push(tag_name_count);
            tag_count_map.push(tag_item.total_words_count);
        });

        return {
            labels: tag_name_map,
            data: tag_count_map
        }
    }

    run() {

        let data = this.getData();
        let correctText = this.getCorrectTagsChartData(data);
        let countWordsChart = this.getCountWordsChartData(data);

        let charts = {
          correctText: correctText,
          countWordsTotal: countWordsChart,
        };

        return {
            data: data,
            charts: charts
        };
    }
}

module.exports = TextModule;