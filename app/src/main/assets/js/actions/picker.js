'use strict';

// Exercise picker, details, new exercise
Object.assign(A, {
    exv: (t) => {
        ui.stack.push({ type: 'exview', id: t.dataset.id });
        render();
    },
    pkm: (t) => {
        ui.reset = 1;
        topSheet().muscle = t.dataset.v;
        topSheet().limit = 60;
        render();
    },
    pke: (t) => {
        ui.reset = 1;
        topSheet().eq = t.dataset.v;
        topSheet().limit = 60;
        render();
    },
    pkmore: () => {
        topSheet().limit += 60;
        pkRefresh();
    },
    pkt: (t) => {
        const s = topSheet(),
            id = t.dataset.id;
        s.sel.has(id) ? s.sel.delete(id) : s.sel.add(id);
        t.classList.toggle('sel');
        const b = $('#pk-done');
        b.textContent = pkCount(s);
        b.disabled = !(s.sel.size || s.allowEmpty);
    },
    pkdone: () => {
        const s = topSheet();
        ui.stack.pop();
        s.onDone([...s.sel]);
        render();
    },
    newex: () => {
        const s = topSheet();
        ui.stack.push({
            type: 'newex',
            name: s && s.type === 'picker' ? s.q.trim() : '',
            m: s && s.type === 'picker' && s.muscle !== 'All' ? s.muscle : 'Chest',
            e: 'D',
        });
        render();
    },
    nxm: (t) => {
        topSheet().m = t.dataset.v;
        render();
    },
    nxe: (t) => {
        topSheet().e = t.dataset.v;
        render();
    },
    nxsave: () => {
        const s = topSheet();
        if (!s.name.trim()) {
            toast('Give it a name');
            return;
        }
        const ex = { id: uid('c'), name: s.name.trim(), m: s.m, e: s.e };
        S.custom.push(ex);
        save();
        ui.stack.pop();
        const p = topSheet();
        if (p && p.type === 'picker') {
            p.sel.add(ex.id);
            p.q = '';
            p.muscle = 'All';
        }
        render();
        toast('Exercise added');
    },
    close: () => {
        ui.stack.pop();
        render();
    },
});
