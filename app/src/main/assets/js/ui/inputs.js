'use strict';
// Text and number input handlers.

const H = {
    w: (t) => {
        lg().entries[+t.dataset.e].sets[+t.dataset.s].w = t.value;
        save();
    },
    r: (t) => {
        lg().entries[+t.dataset.e].sets[+t.dataset.s].r = t.value;
        save();
    },
    pkq: (t) => {
        const s = topSheet();
        s.q = t.value;
        s.limit = 60;
        pkRefresh();
    },
    pgq: (t) => {
        ui.pq = t.value;
        pgList();
    },
    nxn: (t) => {
        topSheet().name = t.value;
    },
    gname: (t) => {
        topSheet().d.name = t.value;
    },
    rname: (t) => {
        topSheet().d.name = t.value;
    },
    gi: (t) => {
        const it = topSheet().d.items[+t.dataset.i],
            k = t.dataset.k;
        it[k] = k === 'reps' ? t.value : Math.max(0, parseInt(t.value) || 0);
    },
};

const onIn = (e) => {
    const f = e.target.dataset && e.target.dataset.f;
    if (f && H[f]) H[f](e.target);
};

document.addEventListener('input', onIn);
