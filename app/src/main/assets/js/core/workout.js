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
            L.entries.push({ ex: it.ex, sets: mkSets(it.ex, ui.date, it.wu, it.sets, it.reps) });
        });
    });
}
