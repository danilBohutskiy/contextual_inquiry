function initAnimations() {
    const form_block = $('.form-wrapper');
    const text_block = $('.text-wrapper');
    const form_text = $('.form-text');

    $(text_block).hide().fadeIn(1500);
    $(form_block).hide().delay(2000).fadeIn(1500);
    $(form_text).hide().delay(3000).fadeIn(1500);
}

function initOnChange() {
    $('#apply').change(() => {
        $('.app-text').toggle();
        $('.process-text').toggle();
        setTimeout(() => $('form').submit(), 2000);
    });
}

$(document).ready(() => {
    initAnimations();
    initOnChange();
});