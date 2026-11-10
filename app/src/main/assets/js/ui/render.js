'use strict';
// Main render loop and confirm dialog.

function render() {
    const csl = [...document.querySelectorAll('.pk-chips')].map((c) => c.scrollLeft),
        sct = ui.reset
            ? []
            : [...document.querySelectorAll('.sheet .sh-b')].map((e) => e.scrollTop);
    ui.reset = 0;
    const v = { today: vToday, work: vWork, rout: vRout, prog: vProg, hist: vHist }[ui.tab];
    const app = $('#app');
    const first = (ui.tab === 'today' ? head('') : '') + v();
    app.innerHTML = first;
    $('#nav').innerHTML = [
        ['today', 'Today', IC.today],
        ['work', 'Workouts', IC.work],
        ['rout', 'Routine', IC.rout],
        ['prog', 'Progress', IC.prog],
        ['hist', 'History', IC.hist],
    ]
        .map(
            (t) =>
                '<button class="' +
                (ui.tab === t[0] ? 'on' : '') +
                '" data-a="tab" data-v="' +
                t[0] +
                '">' +
                '<span class="ic">' +
                t[2] +
                '</span>' +
                t[1] +
                '</button>'
        )
        .join('');
    $('#sheets').innerHTML =
        ui.stack.map(sheetHTML).join('') +
        (ui.confirm
            ? '<div class="cf"><div class="card"><p style="margin:0 0 14px;font-weight:600">' +
              esc(ui.confirm.msg) +
              '</p><div style="display:flex;gap:8px"><button class="btn grow" data-a="cn">Cancel</button><button class="btn pri grow" data-a="cy">' +
              esc(ui.confirm.yes || 'Confirm') +
              '</button></div></div></div>'
            : '') +
        (ui.setMenu ? setMenuHTML() : '');
    document.body.style.overflow = ui.stack.length ? 'hidden' : '';
    document.querySelectorAll('.pk-chips').forEach((c, i) => {
        c.scrollLeft = csl[i] || 0;
    });
    document.querySelectorAll('.sheet .sh-b').forEach((e, i) => {
        e.scrollTop = sct[i] || 0;
    });
}

const ask = (msg, yes, fn) => {
    ui.confirm = { msg, yes, fn };
    render();
};
