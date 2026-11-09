'use strict';
// Workouts tab: your exercise groups.

function vWork() {
    let h = head('Workouts');
    h +=
        '<p class="sub">Reusable exercise lists like Back, Legs or Biceps. Combine them into routines.</p>';
    if (!S.groups.length)
        h +=
            '<div class="card empty"><h3>No workout groups yet</h3><div>Build one per muscle group, then combine them in a routine.</div><div style="margin-top:16px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn pri" data-a="newg">Create group</button><button class="btn" data-a="seed">Add examples</button></div></div>';
    else {
        S.groups.forEach((g) => {
            const ex = g.items.map((i) => getEx(i.ex)).filter(Boolean),
                ms = [...new Set(ex.map((x) => x.m))].slice(0, 3).join(', ');
            h +=
                '<button class="hrow" data-a="editg" data-id="' +
                g.id +
                '"><div class="stack">' +
                ex
                    .slice(0, 3)
                    .map((x) => exThumb(x, 'av'))
                    .join('') +
                '</div><div class="grow"><div class="nm" style="font-size:17px">' +
                esc(g.name) +
                '</div><div class="mu sm-t">' +
                g.items.length +
                ' exercise' +
                (g.items.length === 1 ? '' : 's') +
                (ms ? ' · ' + ms : '') +
                '</div></div><span class="mu">' +
                IC.cr.replace('<svg', '<svg width="18" height="18"') +
                '</span></button>';
        });
        h +=
            '<button class="btn line blk" data-a="newg" style="margin-top:4px;padding:15px">+ New workout group</button>';
    }
    return h;
}
