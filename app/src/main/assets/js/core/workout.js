'use strict';
// Starting a workout log from groups.

function startLog(gids) {
    const L = { groups: gids.slice(), entries: [] };
    S.logs[ui.date] = L;
    addGroupEx(L, gids);
    save();
    render();
}

function addGroupEx(L, gids) {
    gids.forEach((gid) => {
        const g = gget(gid);
        if (!g) return;
        g.items.forEach((it) => {
            if (!getEx(it.ex) || L.entries.some((e) => e.ex === it.ex)) return;
            L.entries.push(newEntry(it.ex, ui.date, it.wu, it.sets, it.reps));
        });
    });
}

// A new exercise entry for the log. Remembers if you track this exercise left/right separately.
function newEntry(id, date, wu, n, reps) {
    const split = !!(S.splitPref && S.splitPref[id]);
    return { ex: id, split: split, sets: mkSets(id, date, wu, n, reps, split) };
}
