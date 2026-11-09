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
            const lp = lastPerf(en.ex, ui.date, s.side);
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
    // Sets can belong to a side (data-side="L" or "R") when an exercise is tracked left/right.
    addset: (t) => {
        const sets = lg().entries[+t.dataset.e].sets,
            side = t.dataset.side,
            mine = sets.map((s, i) => [s, i]).filter(([s]) => !side || s.side === side),
            p = [...mine].reverse().find(([s]) => !s.wu),
            ns = { w: p ? p[0].w : '', r: p ? p[0].r : '', d: 0 };
        if (side) ns.side = side;
        sets.splice(mine.length ? mine[mine.length - 1][1] + 1 : sets.length, 0, ns);
        save();
        render();
    },
    addwu: (t) => {
        const sets = lg().entries[+t.dataset.e].sets,
            side = t.dataset.side,
            mine = sets.map((s, i) => [s, i]).filter(([s]) => !side || s.side === side),
            f = mine.find(([s]) => !s.wu),
            ns = { wu: 1, w: f && f[0].w ? rnd(num(f[0].w) * 0.5) : '', r: f ? f[0].r : '', d: 0 };
        if (side) ns.side = side;
        sets.splice((mine.length ? mine[0][1] : 0) + mine.filter(([s]) => s.wu).length, 0, ns);
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
                    L.entries.push(newEntry(id, ui.date, 0, 3, ''));
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
        const sets = lg().entries[+t.dataset.e].sets,
            side = t.dataset.side;
        for (let i = sets.length - 1; i >= 0; i--) {
            if (!side || sets[i].side === side) {
                sets.splice(i, 1);
                break;
            }
        }
        save();
        render();
    },
    // Switch an exercise between one list and separate left / right lists.
    split: (t) => {
        const en = lg().entries[+t.dataset.e];
        if (!en.split) {
            const left = en.sets.map((s) => ({ ...s, side: 'L' })),
                right = en.sets.map((s) => ({ ...s, side: 'R', d: 0 }));
            en.sets = left.concat(right);
            en.split = true;
            S.splitPref[en.ex] = true;
            save();
            render();
        } else {
            ask(
                'Combine left and right into one list? The right-side sets will be removed.',
                'Combine',
                () => {
                    en.sets = en.sets
                        .filter((s) => s.side === 'L')
                        .map((s) => {
                            const o = { ...s };
                            delete o.side;
                            return o;
                        });
                    en.split = false;
                    S.splitPref[en.ex] = false;
                    save();
                }
            );
        }
    },
});
