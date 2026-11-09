'use strict';
// Routines tab.

function vRout() {
    let h = head('Routines');
    h +=
        '<p class="sub">Plan a weekly schedule, or run a rotating split like 4 training days and 1 rest day.</p>';
    if (!S.groups.length)
        return (
            h +
            '<div class="card empty"><h3>Create workout groups first</h3><div>Routines are built from them.</div><div style="margin-top:16px"><button class="btn pri" data-a="tab" data-v="work">Go to Workouts</button></div></div>'
        );
    S.routines.forEach((r) => {
        const act = r.id === S.active,
            tk = slotFor(r, today()).k;
        h +=
            '<div class="card"><div class="row" style="margin-bottom:8px"><div class="grow"><div class="nm" style="font-size:18px">' +
            esc(r.name) +
            (act ? '<span class="badge">Active</span>' : '') +
            '</div><div class="mu sm-t">' +
            rtDesc(r) +
            '</div></div><button class="btn sm" data-a="editr" data-id="' +
            r.id +
            '">Edit</button>' +
            (act
                ? ''
                : '<button class="btn sm pri" data-a="setActive" data-id="' +
                  r.id +
                  '">Use</button>') +
            '</div>' +
            r.days
                .map((ids, i) => {
                    const t = ids.filter(gget);
                    return (
                        '<div class="day ' +
                        (i === tk ? 'now' : '') +
                        '"><span class="d">' +
                        (r.mode === 'cycle' ? 'Day ' + (i + 1) : DAYS[i].slice(0, 3)) +
                        '</span><span class="grow ' +
                        (t.length ? '' : 'mu') +
                        '">' +
                        (t.length ? gNames(t) : 'Rest') +
                        '</span>' +
                        (i === tk ? '<span class="badge">Today</span>' : '') +
                        '</div>'
                    );
                })
                .join('') +
            '</div>';
    });
    h += '<button class="btn line blk" data-a="newr" style="padding:15px">+ New routine</button>';
    return h;
}
