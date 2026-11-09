'use strict';
// App start.

document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-a]');
    if (!t) return;
    const f = A[t.dataset.a];
    if (f) f(t, e);
});

applyTheme();

render();
