'use strict';
// Shared view helpers and the sheet registry.

function head(t) {
    return (
        '<div class="top"><div class="brand">' +
        LOGO(32) +
        '<b>Lift</b></div><button class="ib" data-a="settings" aria-label="Settings">' +
        IC.gear +
        '</button></div>' +
        (t ? '<h1 class="pt">' + t + '</h1>' : '')
    );
}

function gNames(ids) {
    return ids
        .map((id) => {
            const g = gget(id);
            return g ? esc(g.name) : '';
        })
        .filter(Boolean)
        .join(' + ');
}

function wrap(title, body, foot, cls) {
    return (
        '<div class="sheet ' +
        (cls || '') +
        '"><div class="sh-h"><div class="in"><button class="ib" data-a="close" aria-label="Back">' +
        IC.cl +
        '</button><h2>' +
        title +
        '</h2></div></div>' +
        body +
        (foot ? '<div class="sh-f"><div class="in">' + foot + '</div></div>' : '') +
        '</div>'
    );
}

const bodyOf = (h) => '<div class="sh-b"><div class="in">' + h + '</div></div>';

// Sheet registry: each full-screen sheet registers a render function in js/ui/sheets/*.js
const SHEETS = {};
const sheetHTML = (s) => (SHEETS[s.type] ? SHEETS[s.type](s) : '');
