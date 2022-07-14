function initAnimations() {
    const form_block = $('.form-wrapper');
    const text_block = $('.text-wrapper');
    const form_text = $('.form-text');

    $(text_block).hide().fadeIn(2000);
    $(form_block).hide().delay(4000).fadeIn(1500);
    $(form_text).hide().delay(6000).fadeIn(1500);
}

function initOnChange() {
    const text_h = $('.text-wrapper h2');
    const confirm_text = 'Process initialize...';

    $('#apply').change(() => {
        text_h.text(confirm_text);
        setTimeout(() => $('form').submit(), 2000);
    });
}

$(document).ready(() => {
    initAnimations();
    initOnChange();
});