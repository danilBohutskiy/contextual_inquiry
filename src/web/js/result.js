const SELECTOR_WORDS_COUNT  = 'wordsCountChart';
const SELECTOR_CORRECT_TEXT = 'correctTextChart';

const defaultLegendClickHandler = Chart.defaults.plugins.legend.onClick;
const pieDoughnutLegendClickHandler = Chart.controllers.doughnut.overrides.plugins.legend.onClick;
const newOnClickTextModuleHandler = function (e, legendItem, legend) {
    const type = legend.chart.config.type;
    let canvas = legend.chart.canvas.id;

    let chart = null;

    switch (canvas) {
        case SELECTOR_WORDS_COUNT:
            chart = Chart.getChart(SELECTOR_CORRECT_TEXT);
            break;
        case SELECTOR_CORRECT_TEXT:
            chart = Chart.getChart(SELECTOR_WORDS_COUNT);
            break;
    }

    if (type === 'pie' || type === 'doughnut') {
        pieDoughnutLegendClickHandler(e, legendItem, legend)
    } else {
        defaultLegendClickHandler(e, legendItem, legend);
    }

    if (!chart)
        return false;

    $.each(chart.legend.legendItems, function (index, item) {
        if (item.text === legendItem.text && item.hidden === legendItem.hidden) {
            chart.toggleDataVisibility(index);
            chart.update();
            return true;
        }
    });
};

function initCharts(modules) {
    setTextModuleChart(modules.TextModule)
}

function getRandomRGBArray(count) {
    let colors = [];
    for (let i = 0; i < count; i++) {
        let value = getRandomRGB();
        colors.push(value);
    }
    return colors;
}

function getRandomRGB() {
    const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);

    const randomRGB = () => `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;

    return randomRGB();
}

function setChart(params) {
    let type            = params.type;
    let chartData       = params.data;
    let backgroundColor = params.backgroundColors;
    let selector        = params.selector;
    let onClickCallback = params.callback;

    let chart = $(selector);

    if (!backgroundColor)
        backgroundColor = getRandomRGBArray(chartData.data.length);

    const data = {
        labels: chartData.labels,
        datasets: [{
            data: chartData.data,
            backgroundColor: backgroundColor,
            hoverOffset: 4
        }]
    };

    let legend = {};
    if (onClickCallback)
        legend.onClick = onClickCallback;

    new Chart(chart, {
        type: type,
        data: data,
        options: {
            plugins: {
              legend: legend
            },
            responsive: false,
        }
    });
}

function setJson(selector, data) {
    $(selector).attr('data-json', JSON.stringify(data));
}

function setTextModuleChart(module) {
    const backgroundColors = getRandomRGBArray(module.charts.correctText.data.length);

    const paramsCorrect = {
        type: 'doughnut',
        selector: `#${SELECTOR_CORRECT_TEXT}`,
        data: module.charts.correctText,
        backgroundColors: backgroundColors,
        callback: newOnClickTextModuleHandler,
    };

    const paramsWords = {
        type: 'doughnut',
        selector: `#${SELECTOR_WORDS_COUNT}`,
        data: module.charts.countWordsTotal,
        backgroundColors: backgroundColors,
        callback: newOnClickTextModuleHandler,
    };

    setChart(paramsCorrect);
    setChart(paramsWords);
    setJson('.readable-data', module.data.readable);
}

$(document).ready(() => {
    const data = JSON.parse($('input[name="data"]').val());
    initCharts(data);
    console.log(data);

    $('.show-json').on('click', function (e) {
        e.preventDefault();

        let json_data = JSON.parse($(this).attr('data-json'));
        $('#json-renderer').jsonViewer(json_data, {
            collapsed: true,
        });

        $('#json-modal').modal('show');
    });

});