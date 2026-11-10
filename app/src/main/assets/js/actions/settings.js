'use strict';

// Settings, backup, dialogs
Object.assign(A, {
    settings: () => {
        ui.stack.push({ type: 'settings' });
        render();
    },
    unit: (t) => {
        S.unit = t.dataset.v;
        save();
        render();
    },
    theme: (t) => {
        S.theme = t.dataset.v;
        save();
        applyTheme();
        render();
    },
    bkshow: () => {
        const b = $('#bk');
        b.value = JSON.stringify(S);
        b.focus();
        b.select();
    },
    bkcopy: () => {
        const b = $('#bk');
        if (!b.value) b.value = JSON.stringify(S);
        b.focus();
        b.select();
        let ok = false;
        try {
            ok = document.execCommand('copy');
        } catch (e) {}
        toast(ok ? 'Copied' : 'Selected – copy it manually');
    },
    bkrestore: () => {
        try {
            const s = JSON.parse($('#bk').value);
            if (!s || s.v !== 1 || typeof s.logs !== 'object') throw 0;
            ask('Replace everything on this device with the pasted backup?', 'Restore', () => {
                S = Object.assign(fresh(), s);
                save();
                applyTheme();
                ui.stack = [];
                render();
                toast('Backup restored');
            });
        } catch (e) {
            toast('That doesn’t look like a valid backup');
        }
    },
    erase: () =>
        ask(
            'Erase all workouts, routines and logs from this device? This can’t be undone.',
            'Erase',
            () => {
                S = fresh();
                save();
                applyTheme();
                ui.stack = [];
                ui.tab = 'today';
                render();
                toast('All data erased');
            }
        ),
    doc: (t) => {
        ui.stack.push({ type: 'doc', k: t.dataset.v });
        render();
    },
    cy: () => {
        const c = ui.confirm;
        ui.confirm = null;
        c.fn();
        if (!ui.confirm) render();
    },
    cn: () => {
        ui.confirm = null;
        ui.setMenu = null;
        render();
    },
});
