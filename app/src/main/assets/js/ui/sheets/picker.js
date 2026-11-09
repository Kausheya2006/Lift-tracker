'use strict';
// Exercise picker and new-exercise sheets.

function pkItems(s) {
    const q = toks(s.q);
    let list = BUILTIN.concat(S.custom).filter(
        (x) =>
            (s.muscle === 'All' || x.m === s.muscle) &&
            (s.eq === 'All' || x.e === s.eq) &&
            q.every((t) => hay(x).some((w) => w.startsWith(t)))
    );
    if (q.length)
        list.sort(
            (a, b) =>
                (hay(b)[0] && hay(b)[0].startsWith(q[0]) ? 1 : 0) -
                (hay(a)[0] && hay(a)[0].startsWith(q[0]) ? 1 : 0)
        );
    const total = list.length;
    list = list.slice(0, s.limit);
    if (!total)
        return (
            '<div class="empty"><h3>No match</h3><div>Try another word or filter, or add it yourself.</div><div style="margin-top:12px"><button class="btn pri" data-a="newex">Create “' +
            esc(s.q.trim() || 'exercise') +
            '”</button></div></div>'
        );
    return (
        '<div class="mu sm-t" style="margin:2px 0 10px">' +
        total +
        ' exercise' +
        (total === 1 ? '' : 's') +
        '</div><div class="grid">' +
        list
            .map(
                (x) =>
                    '<button class="pc ' +
                    (s.sel.has(x.id) ? 'sel' : '') +
                    '" data-a="pkt" data-id="' +
                    x.id +
                    '"><div class="im">' +
                    exImg(x) +
                    '<span class="inf" role="button" data-a="exv" data-id="' +
                    x.id +
                    '" aria-label="View details">i</span></div><div class="n">' +
                    esc(x.name) +
                    '</div><div class="e">' +
                    x.m +
                    ' · ' +
                    EQ[x.e] +
                    '</div></button>'
            )
            .join('') +
        '</div>' +
        (total > list.length
            ? '<button class="btn blk" data-a="pkmore" style="margin-top:12px">Show more (' +
              (total - list.length) +
              ' left)</button>'
            : '')
    );
}

const pkCount = (s) =>
    s.sel.size
        ? 'Add ' + s.sel.size + ' exercise' + (s.sel.size > 1 ? 's' : '')
        : 'Select exercises';

function pkRefresh() {
    const s = topSheet();
    if (!s || s.type !== 'picker') return;
    $('#pk-list').innerHTML = pkItems(s);
    const b = $('#pk-done');
    b.textContent = pkCount(s);
    b.disabled = !(s.sel.size || s.allowEmpty);
}

function openPicker(sel, onDone, allowEmpty) {
    ui.stack.push({
        type: 'picker',
        q: '',
        muscle: 'All',
        eq: 'All',
        limit: 60,
        sel: new Set(sel),
        onDone,
        allowEmpty,
    });
    render();
}

SHEETS.picker = function (s) {
    return (
        '<div class="sheet"><div class="sh-h"><div class="in"><button class="ib" data-a="close" aria-label="Back">' +
        IC.cl +
        '</button><h2>Choose exercises</h2></div></div>' +
        '<div class="pk-top"><div class="in"><input class="inp" data-f="pkq" placeholder="Try “cable fly”, “abs machine”, “rope”…" value="' +
        esc(s.q) +
        '" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"></div>' +
        '<div class="pk-chips">' +
        ['All']
            .concat(MUSCLES)
            .map(
                (m) =>
                    '<button class="chip ' +
                    (s.muscle === m ? 'on' : '') +
                    '" data-a="pkm" data-v="' +
                    m +
                    '">' +
                    m +
                    '</button>'
            )
            .join('') +
        '</div><div class="pk-chips" style="padding-top:0">' +
        ['All']
            .concat(Object.keys(EQ))
            .map(
                (k) =>
                    '<button class="chip st ' +
                    (s.eq === k ? 'on' : '') +
                    '" data-a="pke" data-v="' +
                    k +
                    '">' +
                    (k === 'All' ? 'Any equipment' : EQ[k]) +
                    '</button>'
            )
            .join('') +
        '</div></div>' +
        '<div class="sh-b"><div class="in" id="pk-list" style="padding-top:4px">' +
        pkItems(s) +
        '</div></div>' +
        '<div class="sh-f"><div class="in"><button class="btn" data-a="newex" style="flex:none">+ New</button><button class="btn pri" data-a="pkdone" id="pk-done" ' +
        (s.sel.size || s.allowEmpty ? '' : 'disabled') +
        '>' +
        pkCount(s) +
        '</button></div></div></div>'
    );
};

SHEETS.newex = function (s) {
    return wrap(
        'New exercise',
        bodyOf(
            '<label class="lb">Name</label><input class="inp" data-f="nxn" value="' +
                esc(s.name) +
                '" placeholder="e.g. Cable Pullover">' +
                '<label class="lb">Muscle</label><div class="chips">' +
                MUSCLES.map(
                    (m) =>
                        '<button class="chip ' +
                        (s.m === m ? 'on' : '') +
                        '" data-a="nxm" data-v="' +
                        m +
                        '">' +
                        m +
                        '</button>'
                ).join('') +
                '</div>' +
                '<label class="lb">Equipment</label><div class="chips">' +
                Object.keys(EQ)
                    .map(
                        (k) =>
                            '<button class="chip ' +
                            (s.e === k ? 'on' : '') +
                            '" data-a="nxe" data-v="' +
                            k +
                            '">' +
                            EQ[k] +
                            '</button>'
                    )
                    .join('') +
                '</div>' +
                '<div class="th" style="width:70px;height:84px;margin-top:18px">' +
                iconFor({ name: s.name, m: s.m, e: s.e }) +
                '</div>'
        ),
        '<button class="btn pri" data-a="nxsave">Save exercise</button>'
    );
};
