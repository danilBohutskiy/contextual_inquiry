const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

const TEXT_TAGS = [
    'p', 'span', 'textarea', 'a',
    'h1', 'h2', 'h3', 'h4',
    'b', 'strong', 'pre', 'blockquote', 'address',
    'label', 'li', 'ol'
];

const LENGTH_MIN_LIMIT = 45;
const LENGTH_MAX_LIMIT = 80;


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
            let tag_text_total = [];
            let tag_words_count = 0;

            let tag_is_normal = 0;

            $.each(tags, (tag_i, tag_item) => {
                let tag_text = self.formatText($(tag_item).text());
                if (!tag_text)
                    return;

                let text_length = tag_text.length;
                let text_count = tag_text.split(' ').length;
                let text_is_normal = text_length >= LENGTH_MIN_LIMIT && text_length <= LENGTH_MAX_LIMIT;

                if (text_is_normal)
                    tag_is_normal++;

                tag_words_count += text_count;
                total_words_count += text_count;
                tag_text_total.push(tag_text);

                items.push({
                    value: tag_text,
                    length: text_length,
                    is_normal: text_is_normal,
                });
            });

            tag_data_arr[tag_selector] = {
                items: items,
                count: items.length,
                total_text: tag_text_total.join(' '),
                is_normal_total: tag_is_normal ? (tag_is_normal / items.length * 100).toFixed(2) : 0,
                words_count: tag_words_count,
            };
        });

        return {
            tags: tag_data_arr,
            total_words: total_words_count
        };
    }

    getCorrectTagsChartData(data) {
        let tags = data.words.tags;
        let tag_name_map = [];
        let tag_count_map = [];

        $.each(tags, function (tag_name, tag_item) {
            if (tag_item.count === 0 || tag_item.is_normal_total === 0)
                return;

            let tag_name_count = `<${tag_name}> ( ${tag_item.count} )`;
            tag_name_map.push(tag_name_count);
            tag_count_map.push(tag_item.is_normal_total);
        });

        return {
            labels: tag_name_map,
            data: tag_count_map
        }
    }

    getCountWordsChartData(data) {
        let tags = data.words.tags;
        let tag_name_map = [];
        let tag_count_map = [];

        $.each(tags, function (tag_name, tag_item) {
            if (tag_item.count == 0 || tag_item.words_count == 0)
                return;

            let tag_name_count = `<${tag_name}> ( ${tag_item.count} )`;
            tag_name_map.push(tag_name_count);
            tag_count_map.push(tag_item.words_count);
        });

        return {
            labels: tag_name_map,
            data: tag_count_map
        }
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