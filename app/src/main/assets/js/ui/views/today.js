'use strict';
// Today tab: choose workout, log sets.

function vToday() {
    const d = ui.date,
        L = S.logs[d],
        isT = d === today();
    let h =
        '<div class="dn"><button class="ib sq" data-a="dprev" aria-label="Previous day">' +
        IC.cl +
        '</button><div class="dt"><b>' +
        (isT ? 'Today' : esc(pd(d).toLocaleDateString(undefined, { weekday: 'long' }))) +
        '</b><span>' +
        esc(fmtLong(d)) +
        '</span></div><button class="ib sq" data-a="dnext" aria-label="Next day">' +
        IC.cr +
        '</button></div>';
    if (!isT)
        h +=
            '<div style="text-align:center;margin:-6px 0 14px"><button class="btn sm" data-a="dtoday">Jump to today</button></div>';
    if (!L) return h + vChoose(d);
    if (L.rest)
        return (
            h +
            '<div class="card empty"><h3>Rest day</h3><div>Recovery counts too.</div><div style="margin-top:16px"><button class="btn" data-a="resetDay">Change</button></div></div>'
        );
    const all = L.entries.reduce((a, e) => a.concat(e.sets), []),
        tot = all.length,
        dn = all.filter((s) => s.d).length,
        C = 2 * Math.PI * 26,
        pct = tot ? dn / tot : 0,
        v = vol(L),
        pc = (prByDay()[d] || new Set()).size;
    h +=
        '<div class="card sumc"><div class="grow"><div class="mu sm-t">' +
        (L.groups.length ? 'Workout' : 'Custom workout') +
        '</div><div class="sumt">' +
        (L.groups.length ? gNames(L.groups) : 'Your session') +
        '</div><div class="chips" style="margin-top:10px"><span class="chip st">' +
        L.entries.length +
        ' exercise' +
        (L.entries.length === 1 ? '' : 's') +
        '</span>' +
        (v ? '<span class="chip st">' + fmtN(v) + ' ' + S.unit + '</span>' : '') +
        (pc ? '<span class="chip st pr">★ ' + pc + ' PR' + (pc > 1 ? 's' : '') + '</span>' : '') +
        '</div></div>' +
        '<svg class="ring" viewBox="0 0 64 64" role="img" aria-label="' +
        dn +
        ' of ' +
        tot +
        ' sets done"><circle class="rt" cx="32" cy="32" r="26"/><circle class="rf" cx="32" cy="32" r="26" stroke-dasharray="' +
        (C * pct).toFixed(1) +
        ' ' +
        C.toFixed(1) +
        '" transform="rotate(-90 32 32)"/><text class="rx" x="32" y="37" text-anchor="middle">' +
        dn +
        '/' +
        tot +
        '</text></svg></div>';
    L.entries.forEach((en, i) => (h += entryHTML(en, i, d)));
    h +=
        '<div style="display:flex;gap:10px"><button class="btn line grow" data-a="logAddEx">+ Exercise</button><button class="btn line grow" data-a="logAddGrp">+ Group</button></div><button class="lnk" data-a="resetDay">Change workout</button>';
    return h;
}

function vChoose(d) {
    let h = '';
    const rt = S.routines.find((r) => r.id === S.active),
        sl = slotFor(rt, d);
    if (rt && sl.ids.length) {
        const gs = sl.ids.map(gget),
            exs = [];
        gs.forEach((g) =>
            g.items.forEach((i) => {
                if (!exs.includes(i.ex)) exs.push(i.ex);
            })
        );
        const sets = gs.reduce((a, g) => a + g.items.reduce((b, i) => b + i.sets + i.wu, 0), 0);
        h +=
            '<div class="hero"><div class="hl1">' +
            esc(rt.name) +
            ' · ' +
            esc(sl.label) +
            '</div><div class="hl2">' +
            gNames(sl.ids) +
            '</div><div class="hph">' +
            exs
                .map(getEx)
                .filter(Boolean)
                .slice(0, 4)
                .map((x) => exThumb(x, 'hp'))
                .join('') +
            '</div><div class="hl3">' +
            exs.length +
            ' exercises · ' +
            sets +
            ' sets</div><button class="btn pri blk" data-a="startR">Start workout</button></div>';
    } else if (rt) {
        h +=
            '<div class="hero"><div class="hl1">' +
            esc(rt.name) +
            ' · ' +
            esc(sl.label) +
            '</div><div class="hl2">Rest day</div><div class="hl3">Recovery is where the progress happens.</div><button class="btn blk ghw" data-a="rest">Log rest day</button></div>';
    }
    h +=
        '<div class="card"><h3 style="font-size:18px">' +
        (rt ? 'Train something else' : 'What did you train?') +
        '</h3>';
    if (!S.groups.length)
        h +=
            '<p class="sub" style="margin:6px 0 14px">Create workout groups in the Workouts tab, or start with an empty workout and add exercises as you go.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px"><button class="btn" data-a="seed">Add example workouts</button></div>';
    else
        h +=
            '<p class="sub" style="margin:4px 0 12px">Pick one or more groups and mix as you like.</p><div class="chips" style="margin-bottom:16px">' +
            S.groups
                .map(
                    (g) =>
                        '<button class="chip ' +
                        (ui.pick.has(g.id) ? 'on' : '') +
                        '" data-a="pickg" data-id="' +
                        g.id +
                        '">' +
                        esc(g.name) +
                        '</button>'
                )
                .join('') +
            '</div>';
    h +=
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
        (S.groups.length
            ? '<button class="btn pri" data-a="startPick" ' +
              (ui.pick.size ? '' : 'disabled') +
              '>Start' +
              (ui.pick.size ? ' (' + ui.pick.size + ')' : '') +
              '</button>'
            : '') +
        '<button class="btn" data-a="empty">Empty workout</button>' +
        (rt ? '' : '<button class="btn" data-a="rest">Rest day</button>') +
        '</div></div>';
    return h;
}

function entryHTML(en, ei, date) {
    const ex = getEx(en.ex) || { name: 'Removed exercise', m: 'Chest', e: 'W' },
        st = stats(en.ex),
        total = (S.logs[date] || { entries: [] }).entries.length,
        split = !!en.split,
        sides = split ? ['L', 'R'] : [''],
        sideName = { L: 'Left', R: 'Right' };
    let anyPR = false;

    // One block of set rows for a side ('' = the normal single list).
    const block = (side) => {
        const lp = lastPerf(en.ex, date, side || undefined);
        let n = 0;
        const rows = en.sets
            .map((s, si) => [s, si])
            .filter(([s]) => (s.side || '') === side)
            .map(([s, si]) => {
                if (!s.wu && !s.dr) n++;
                const isp = st.flags.has(s);
                if (isp) anyPR = true;
                return (
                    '<div class="sr ' +
                    (s.d ? 'on' : '') +
                    (s.wu ? ' wu' : '') +
                    (s.dr ? ' dr' : '') +
                    (isp ? ' isp' : '') +
                    '"><button class="sb" data-a="setmenu" data-e="' +
                    ei +
                    '" data-s="' +
                    si +
                    '" aria-label="Set options">' +
                    (isp ? '★' : s.wu ? 'W' : s.dr ? 'D' : n) +
                    '</button>' +
                    '<label class="fld"><input type="number" inputmode="decimal" step="any" data-f="w" data-e="' +
                    ei +
                    '" data-s="' +
                    si +
                    '" value="' +
                    esc(s.w) +
                    '" placeholder="' +
                    (lp ? lp.w : '0') +
                    '" aria-label="Weight in ' +
                    S.unit +
                    '"><span>' +
                    S.unit +
                    '</span></label>' +
                    '<i class="xx">×</i>' +
                    '<label class="fld"><input type="number" inputmode="numeric" data-f="r" data-e="' +
                    ei +
                    '" data-s="' +
                    si +
                    '" value="' +
                    esc(s.r) +
                    '" placeholder="' +
                    (lp && lp.r ? lp.r : '0') +
                    '" aria-label="Reps"><span>reps</span></label>' +
                    '<button class="ck" data-a="done" data-e="' +
                    ei +
                    '" data-s="' +
                    si +
                    '" aria-label="Mark set done">' +
                    IC.check +
                    '</button></div>'
                );
            })
            .join('');
        const at = ' data-e="' + ei + '"' + (side ? ' data-side="' + side + '"' : '');
        return (
            (side ? '<div class="side-h"><i>' + side + '</i>' + sideName[side] + '</div>' : '') +
            rows +
            '<div class="sbtns"><button class="btn sm" data-a="addset"' +
            at +
            '>+ Set</button><button class="btn sm" data-a="addwu"' +
            at +
            '>+ Warm-up</button><button class="btn sm" data-a="adddrop"' +
            at +
            '>+ Drop set</button><button class="btn sm" data-a="rmset"' +
            at +
            ' style="margin-left:auto">− Set</button></div>'
        );
    };
    const body = sides.map(block).join('');

    // PR and "last time" chips: one per side when tracked left/right.
    const prChip = (p, tag) =>
        p ? '<span class="chip st pr">PR ' + tag + fmtSet(p.w, p.r) + '</span>' : '';
    const lastChip = (lp, tag) =>
        lp
            ? '<span class="chip st">Last ' +
              tag +
              (lp.w > 0 ? fmtN(lp.w) + ' × ' + esc(lp.r || '–') : fmtN(num(lp.r)) + ' reps') +
              '</span>'
            : '';
    let chips = '';
    if (split) {
        chips = sides.map((sd) => prChip(st.prSide[sd], sd + ' ')).join('');
        chips += sides.map((sd) => lastChip(lastPerf(en.ex, date, sd), sd + ' ')).join('');
        if (!chips) chips = '<span class="chip st">No PR yet</span>';
    } else {
        chips =
            (st.pr ? prChip(st.pr, '') : '<span class="chip st">No PR yet</span>') +
            lastChip(lastPerf(en.ex, date), '');
    }
    if (anyPR) chips += '<span class="chip st pr">New PR!</span>';

    return (
        '<div class="card"><div class="ex-h"><button class="thb" data-a="exv" data-id="' +
        en.ex +
        '" aria-label="View exercise">' +
        exThumb(ex) +
        '</button>' +
        '<div class="grow"><div class="nm" style="font-size:17px">' +
        esc(ex.name) +
        '</div><div class="mu sm-t" style="margin-top:2px">' +
        ex.m +
        ' · ' +
        EQ[ex.e] +
        '</div>' +
        '<div class="chips" style="margin-top:8px;gap:6px">' +
        chips +
        '</div></div>' +
        '<div class="ctl"><button class="ib sm" data-a="moveentry" data-dir="-1" data-e="' +
        ei +
        '"' +
        (ei === 0 ? ' disabled' : '') +
        ' aria-label="Move exercise up">↑</button><button class="ib sm" data-a="moveentry" data-dir="1" data-e="' +
        ei +
        '"' +
        (ei === total - 1 ? ' disabled' : '') +
        ' aria-label="Move exercise down">↓</button><button class="ib sm" data-a="delentry" data-e="' +
        ei +
        '" aria-label="Remove exercise">×</button></div></div>' +
        body +
        '<button class="tgl" role="switch" aria-checked="' +
        split +
        '" data-a="split" data-e="' +
        ei +
        '"><span class="sw"></span><span>Track left and right separately</span></button></div>'
    );
}

// Dialog opened by tapping a set number: change the set type or delete the set.
function setMenuHTML() {
    const m = ui.setMenu,
        L = S.logs[ui.date],
        s = L && L.entries[m.e] && L.entries[m.e].sets[m.s];
    if (!s) return '';
    const cur = s.wu ? 'w' : s.dr ? 'd' : 'n';
    const opt = (t, label, hint) =>
        '<button class="opt' +
        (cur === t ? ' on' : '') +
        '" data-a="settype" data-t="' +
        t +
        '"><b>' +
        label +
        '</b><span>' +
        hint +
        '</span></button>';
    return (
        '<div class="cf"><div class="card"><div class="ct2" style="margin-bottom:10px">Set options</div>' +
        opt('n', 'Normal set', 'Counts towards PRs') +
        opt('w', 'Warm-up', 'Never counts towards PRs or volume') +
        opt('d', 'Drop set', 'Lighter set after a working set. PRs use the heavier set') +
        '<button class="opt dgr" data-a="setdel"><b>Delete this set</b></button>' +
        '<button class="btn blk" data-a="cn" style="margin-top:6px">Cancel</button></div></div>'
    );
}
