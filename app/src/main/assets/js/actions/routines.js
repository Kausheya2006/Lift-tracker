'use strict';

// Routines
Object.assign(A, {
    newr: () => {
        ui.stack.push({
            type: 'routine',
            d: {
                name: '',
                mode: 'week',
                tr: 4,
                rs: 1,
                cur: 1,
                daysW: [[], [], [], [], [], [], []],
                daysC: [[], [], [], [], []],
            },
        });
        render();
    },
    editr: (t) => {
        const r = S.routines.find((x) => x.id === t.dataset.id),
            cyc = r.mode === 'cycle',
            cp = JSON.parse(JSON.stringify(r.days));
        const d = {
            id: r.id,
            name: r.name,
            mode: cyc ? 'cycle' : 'week',
            tr: 4,
            rs: 1,
            cur: 1,
            daysW: [[], [], [], [], [], [], []],
            daysC: [[], [], [], [], []],
        };
        if (cyc) {
            d.daysC = cp;
            d.tr = r.tr || cp.filter((x) => x.length).length || 1;
            d.rs = r.rs != null ? r.rs : cp.length - d.tr;
            d.cur = slotFor(r, today()).k + 1;
        } else d.daysW = cp;
        ui.stack.push({ type: 'routine', d });
        render();
    },
    rmode: (t) => {
        topSheet().d.mode = t.dataset.v;
        render();
    },
    rstep: (t) => {
        const d = topSheet().d,
            k = t.dataset.k,
            n = +t.dataset.n;
        d[k] = k === 'tr' ? Math.min(7, Math.max(1, d.tr + n)) : Math.min(4, Math.max(0, d.rs + n));
        rebuildC(d);
        render();
    },
    rpre: (t) => {
        const d = topSheet().d;
        d.tr = +t.dataset.tr;
        d.rs = +t.dataset.rs;
        rebuildC(d);
        render();
    },
    rcur: (t) => {
        topSheet().d.cur = +t.dataset.n;
        render();
    },
    setActive: (t) => {
        S.active = t.dataset.id;
        save();
        render();
        toast('Routine activated');
    },
    rday: (t) => {
        const d = topSheet().d,
            i = +t.dataset.i,
            cyc = d.mode === 'cycle',
            arr = cyc ? d.daysC : d.daysW;
        ui.stack.push({
            type: 'gpick',
            title: cyc ? 'Day ' + (i + 1) : DAYS[i],
            rest: true,
            sel: new Set(arr[i].filter(gget)),
            onDone: (ids) => {
                arr[i] = ids;
            },
        });
        render();
    },
    rsave: () => {
        const d = topSheet().d,
            cyc = d.mode === 'cycle',
            r = {
                id: d.id || uid('r'),
                name: d.name.trim() || 'My routine',
                mode: d.mode,
                days: cyc ? d.daysC : d.daysW,
            };
        if (cyc) {
            r.tr = d.tr;
            r.rs = d.rs;
            r.start = addD(today(), -(d.cur - 1));
        }
        if (d.id) {
            const i = S.routines.findIndex((x) => x.id === d.id);
            S.routines[i] = r;
        } else {
            S.routines.push(r);
            if (!S.active) S.active = r.id;
        }
        save();
        ui.stack.pop();
        render();
        toast('Routine saved');
    },
    rdel: () => {
        const d = topSheet().d;
        ask('Delete routine “' + d.name + '”?', 'Delete', () => {
            S.routines = S.routines.filter((r) => r.id !== d.id);
            if (S.active === d.id) S.active = S.routines[0] ? S.routines[0].id : null;
            save();
            ui.stack.pop();
            render();
        });
    },
    gpt: (t) => {
        const s = topSheet(),
            id = t.dataset.id;
        s.sel.has(id) ? s.sel.delete(id) : s.sel.add(id);
        render();
    },
    gpdone: () => {
        const s = topSheet();
        ui.stack.pop();
        s.onDone(S.groups.map((g) => g.id).filter((id) => s.sel.has(id)));
        render();
    },
});
