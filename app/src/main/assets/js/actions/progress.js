'use strict';

// Progress tab
Object.assign(A, {
    openProg: (t) => {
        ui.stack.push({ type: 'prog', id: t.dataset.id, metric: 'w' });
        render();
    },
    pmet: (t) => {
        topSheet().metric = t.dataset.v;
        render();
    },
    pex: (t) => {
        ui.pex = t.dataset.id;
        render();
    },
    pmi: (t) => {
        ui.pm = t.dataset.v;
        render();
    },
});
