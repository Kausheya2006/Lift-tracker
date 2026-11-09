'use strict';
// Workout group editor and group chooser sheets.

SHEETS.group = function (s) {
    const d = s.d;
    const rows = d.items
        .map((it, i) => {
            const ex = getEx(it.ex);
            if (!ex) return '';
            return (
                '<div class="card"><div class="row"><button class="thb" data-a="exv" data-id="' +
                ex.id +
                '" aria-label="View exercise">' +
                exThumb(ex) +
                '</button><div class="grow"><div class="nm">' +
                esc(ex.name) +
                '</div><div class="mu sm-t">' +
                ex.m +
                ' · ' +
                EQ[ex.e] +
                '</div></div>' +
                '<button class="ib" data-a="gup" data-i="' +
                i +
                '" aria-label="Move up">↑</button><button class="ib" data-a="gdn" data-i="' +
                i +
                '" aria-label="Move down">↓</button><button class="ib" data-a="grm" data-i="' +
                i +
                '" aria-label="Remove">×</button></div>' +
                '<div class="gi"><label>Warm-up sets<input type="number" inputmode="numeric" min="0" data-f="gi" data-i="' +
                i +
                '" data-k="wu" value="' +
                it.wu +
                '"></label><label>Working sets<input type="number" inputmode="numeric" min="0" data-f="gi" data-i="' +
                i +
                '" data-k="sets" value="' +
                it.sets +
                '"></label><label>Reps<input type="text" inputmode="numeric" data-f="gi" data-i="' +
                i +
                '" data-k="reps" value="' +
                esc(it.reps) +
                '"></label></div></div>'
            );
        })
        .join('');
    return wrap(
        d.id ? 'Edit group' : 'New group',
        bodyOf(
            '<label class="lb" style="margin-top:4px">Group name</label><input class="inp" data-f="gname" value="' +
                esc(d.name) +
                '" placeholder="e.g. Back, Legs, Chest + Triceps"><div style="height:14px"></div>' +
                rows +
                '<button class="btn line blk" data-a="gaddex">+ Add exercises</button><p class="mu sm-t">Tip: mix muscles freely to make hybrid groups.</p>'
        ),
        (d.id ? '<button class="btn dg" data-a="gdel" style="flex:none">Delete</button>' : '') +
            '<button class="btn pri" data-a="gsave">Save group</button>'
    );
};

SHEETS.gpick = function (s) {
    return wrap(
        esc(s.title),
        bodyOf(
            '<div class="chips">' +
                S.groups
                    .map(
                        (g) =>
                            '<button class="chip ' +
                            (s.sel.has(g.id) ? 'on' : '') +
                            '" data-a="gpt" data-id="' +
                            g.id +
                            '" style="padding:12px 16px;font-size:15px">' +
                            esc(g.name) +
                            '</button>'
                    )
                    .join('') +
                '</div>' +
                (s.rest
                    ? '<p class="mu sm-t" style="margin-top:16px">Select none for a rest day.</p>'
                    : '')
        ),
        '<button class="btn pri" data-a="gpdone">Done</button>'
    );
};
