function initCharts(modules) {
    getTextModuleChart(modules.TextModule)
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

function setChart(type, selector, label, chartData) {
    let chart = $(selector);

    const data = {
        labels: chartData.labels,
        datasets: [{
            label: label,
            data: chartData.data,
            backgroundColor: getRandomRGBArray(chartData.data.length),
            hoverOffset: 4
        }]
    };

    new Chart(chart, {
        type: type,
        data: data,
        options: {
            responsive: false,
        }
    });
}

function getTextModuleChart(module) {
    setChart('doughnut', '#correctTextChart', 'Correct text', module.charts.correctText);
    setChart('pie', '#wordsCountChart', 'Words count', module.charts.countWordsTotal);
}

$(document).ready(() => {
    const data = JSON.parse($('input[name="data"]').val());
    console.log(data);

    initCharts(data);
});