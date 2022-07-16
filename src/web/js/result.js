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

function getTextModuleChart(module) {
    let chart = $('#tagsCountChart');

    let tags = module.words.tags;
    let tag_name_map = [];
    let tag_count_map = [];
    $.each(tags, function (tag_name, tag_item) {
        if (tag_item.left == 0 || tag_item.is_normal_total == 0)
            return;

        let tag_name_count = `<${tag_name}> ( ${tag_item.count} )`;
        tag_name_map.push(tag_name_count);
        tag_count_map.push(tag_item.is_normal_total);
    });

    $('#total_normal_text').text();

    const data = {
        labels: tag_name_map,
        datasets: [{
            label: 'Tags count',
            data: tag_count_map,
            backgroundColor: getRandomRGBArray(tag_count_map.length),
            hoverOffset: 4
        }]
    };

    new Chart(chart, {
        type: 'doughnut',
        data: data,
    });
}

$(document).ready(() => {
    const data = JSON.parse($('input[name="data"]').val());

    initCharts(data);
});