'use strict';

// Navigation, starting workouts, logging sets
Object.assign(A, {
    tab: (t) => {
        ui.tab = t.dataset.v;
        ui.stack = [];
        render();
        window.scrollTo(0, 0);
    },
    dprev: () => {
        ui.date = addD(ui.date, -1);
        ui.pick = new Set();
        render();
    },
    dnext: () => {
        ui.date = addD(ui.date, 1);
        ui.pick = new Set();
        render();
    },
    dtoday: () => {
        ui.date = today();
        render();
    },
    pickg: (t) => {
        const id = t.dataset.id;
        ui.pick.has(id) ? ui.pick.delete(id) : ui.pick.add(id);
        render();
    },
    startPick: () => {
        startLog([...ui.pick]);
        ui.pick = new Set();
    },
    startR: () => {
        const rt = S.routines.find((r) => r.id === S.active);
        startLog(slotFor(rt, ui.date).ids);
    },
    rest: () => {
        S.logs[ui.date] = { rest: true, groups: [], entries: [] };
        save();
        render();
    },
    empty: () => {
        S.logs[ui.date] = { groups: [], entries: [] };
        save();
        render();
    },
    resetDay: () =>
        ask(
            'Clear this day so you can pick a different workout? Logged sets for this day will be removed.',
            'Clear day',
            () => {
                delete S.logs[ui.date];
                save();
                render();
            }
        ),
    done: (t) => {
        const en = lg().entries[+t.dataset.e],
            s = en.sets[+t.dataset.s];
        s.d = s.d ? 0 : 1;
        if (s.d && !s.w) {
            const lp = lastPerf(en.ex, ui.date);
            if (lp) s.w = lp.w;
        }
        save();
        render();
        if (s.d && stats(en.ex).flags.has(s)) toast('New personal record!');
    },
    delset: (t) => {
        lg().entries[+t.dataset.e].sets.splice(+t.dataset.s, 1);
        save();
        render();
    },
    addset: (t) => {
        const sets = lg().entries[+t.dataset.e].sets;
        const p = [...sets].reverse().find((s) => !s.wu);
        sets.push({ w: p ? p.w : '', r: p ? p.r : '', d: 0 });
        save();
        render();
    },
    addwu: (t) => {
        const sets = lg().entries[+t.dataset.e].sets;
        const f = sets.find((s) => !s.wu);
        const i = sets.filter((s) => s.wu).length;
        sets.splice(i, 0, { wu: 1, w: f && f.w ? rnd(num(f.w) * 0.5) : '', r: f ? f.r : '', d: 0 });
        save();
        render();
    },
    delentry: (t) => {
        lg().entries.splice(+t.dataset.e, 1);
        save();
        render();
    },
    logAddEx: () =>
        openPicker([], (ids) => {
            const L = lg();
            ids.forEach((id) => {
                if (!L.entries.some((e) => e.ex === id))
                    L.entries.push({ ex: id, sets: mkSets(id, ui.date, 0, 3, '') });
            });
            save();
        }),
    logAddGrp: () => {
        ui.stack.push({
            type: 'gpick',
            title: 'Add workout groups',
            sel: new Set(),
            onDone: (ids) => {
                const L = lg();
                ids.forEach((id) => {
                    if (!L.groups.includes(id)) L.groups.push(id);
                });
                addGroupEx(L, ids);
                save();
            },
        });
        render();
    },
    openDay: (t) => {
        ui.date = t.dataset.d;
        ui.tab = 'today';
        render();
        window.scrollTo(0, 0);
    },
    hv: (t) => {
        ui.hv = t.dataset.v;
        render();
    },
    rmset: (t) => {
        lg().entries[+t.dataset.e].sets.pop();
        save();
        render();
    },
});
