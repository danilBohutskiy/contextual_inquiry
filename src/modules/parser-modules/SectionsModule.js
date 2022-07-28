const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

const SEMANTIC_TAGS = [
    'article',
    'aside',
    'details',
    'figcaption',
    'figure',
    'footer',
    'header',
    'main',
    'mark',
    'nav',
    'section',
    'summary',
    'time',
];

const BASIC_SEMANTIC_TAGS = [
    'nav', 'main', 'footer'
];

class SectionsModule {

    constructor(document) {
        this.document = document;
        this.tags = this.getTagsMap();
    }

    getTagsMap() {
        return [].concat.apply([], [
            SEMANTIC_TAGS,
        ]);
    }

    getSemanticData() {
        let self = this;

        let tags = {};

        let items = [];
        let total_tags = 0;
        let total_unique_tags = 0;
        let tags_basic_count = 0;
        $.each(self.tags, function (tag_i, tag_selector) {
            let tag_items = self.document.find(tag_selector);
            let tag_items_count = tag_items.length;
            if (!tag_items_count)
                return;
            //console.log(`${tag_selector}|${tag_items_count}`); // debug

            items = [];
            $.each(tag_items, function (item_i, tag_item) {
               let tag_text = $(tag_item).text();
               items.push({
                   text: tag_text,
                   text_length: tag_text.length,
                   text_words_count: tag_text.split(' ').length,
               });
            });

            let isBasicTag = BASIC_SEMANTIC_TAGS.includes(tag_selector);
            if (isBasicTag)
                tags_basic_count++;

            tags[tag_selector] = {
                items: items,
                count: items.length,
                is_basic: isBasicTag
            };

            total_unique_tags++;
            total_tags+=tag_items_count;
        });

        return {
            tags: tags,
            total_tags: total_tags,
            total_unique_tags: total_unique_tags,
            tags_basic_total: BASIC_SEMANTIC_TAGS.length,
            tags_basic_count: BASIC_SEMANTIC_TAGS.length,
        };
    }

    getData() {
        let data = {};

        data.semantic = this.getSemanticData();

        return data;
    }

    getSemanticTagsChartData(data) {
        let tags = data.semantic.tags;
        let tag_name_map = [];
        let tag_count_map = [];

        $.each(tags, function (tag_name, tag_item) {
            if (tag_item.count === 0 || tag_item.total_readable === 0)
                return;

            let tag_name_count = `<${tag_name}>`;
            tag_name_map.push(tag_name_count);
            tag_count_map.push(tag_item.count);
        });

        return {
            labels: tag_name_map,
            data: tag_count_map
        }
    }

    run() {
        let data = this.getData();

        let correctText = this.getSemanticTagsChartData(data);

        let charts = {
            semanticTags: correctText,
        };

        return {
            data: data,
            charts: charts,
        }
    }
}

module.exports = SectionsModule;