'use strict';
// Routine editor sheet.

SHEETS.routine = function (s) {
    const d = s.d,
        cyc = d.mode === 'cycle',
        arr = cyc ? d.daysC : d.daysW;
    const stp = (lab, k, v, min, max) =>
        '<div class="row" style="padding:6px 0"><div class="grow nm">' +
        lab +
        '</div><div class="step"><button data-a="rstep" data-k="' +
        k +
        '" data-n="-1" ' +
        (v <= min ? 'disabled' : '') +
        ' aria-label="Fewer">−</button><b>' +
        v +
        '</b><button data-a="rstep" data-k="' +
        k +
        '" data-n="1" ' +
        (v >= max ? 'disabled' : '') +
        ' aria-label="More">+</button></div></div>';
    const rows = arr
        .map((ids, i) => {
            const t = ids.filter(gget);
            return (
                '<button class="day" data-a="rday" data-i="' +
                i +
                '" style="width:100%;text-align:left"><span class="d">' +
                (cyc ? 'Day ' + (i + 1) : DAYS[i].slice(0, 3)) +
                '</span><span class="grow ' +
                (t.length ? '' : 'mu') +
                '">' +
                (t.length ? gNames(t) : 'Rest') +
                '</span><span class="mu">›</span></button>'
            );
        })
        .join('');
    return wrap(
        d.id ? 'Edit routine' : 'New routine',
        bodyOf(
            '<label class="lb" style="margin-top:4px">Routine name</label><input class="inp" data-f="rname" value="' +
                esc(d.name) +
                '" placeholder="e.g. 4-day split">' +
                '<label class="lb">Schedule type</label><div class="seg"><button class="' +
                (cyc ? '' : 'on') +
                '" data-a="rmode" data-v="week">Weekly</button><button class="' +
                (cyc ? 'on' : '') +
                '" data-a="rmode" data-v="cycle">Rotating split</button></div>' +
                (cyc
                    ? '<div class="card">' +
                      stp('Training days', 'tr', d.tr, 1, 7) +
                      stp('Rest days', 'rs', d.rs, 0, 4) +
                      '<div class="chips" style="margin-top:10px">' +
                      [
                          [3, 1],
                          [4, 1],
                          [5, 2],
                          [6, 1],
                      ]
                          .map(
                              (p) =>
                                  '<button class="chip st ' +
                                  (d.tr === p[0] && d.rs === p[1] ? 'on' : '') +
                                  '" data-a="rpre" data-tr="' +
                                  p[0] +
                                  '" data-rs="' +
                                  p[1] +
                                  '">' +
                                  p[0] +
                                  ' + ' +
                                  p[1] +
                                  ' rest</button>'
                          )
                          .join('') +
                      '</div><div class="mu sm-t" style="margin-top:12px">The cycle repeats every ' +
                      arr.length +
                      ' days. Rest days keep their place on the calendar.</div></div>' +
                      '<label class="lb">Today is…</label><div class="chips">' +
                      arr
                          .map(
                              (_, i) =>
                                  '<button class="chip ' +
                                  (d.cur === i + 1 ? 'on' : '') +
                                  '" data-a="rcur" data-n="' +
                                  (i + 1) +
                                  '">Day ' +
                                  (i + 1) +
                                  '</button>'
                          )
                          .join('') +
                      '</div>'
                    : '') +
                '<label class="lb">' +
                (cyc ? 'Plan each day' : 'Weekly plan') +
                ' · tap to choose groups</label><div class="card" style="padding:2px 16px">' +
                rows +
                '</div>'
        ),
        (d.id ? '<button class="btn dg" data-a="rdel" style="flex:none">Delete</button>' : '') +
            '<button class="btn pri" data-a="rsave">Save routine</button>'
    );
};
