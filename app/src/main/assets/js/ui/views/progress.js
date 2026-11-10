'use strict';
// Progress tab: stats, charts, lift list.

function pgRows() {
    const q = toks(ui.pq || ''),
        ids = new Set();
    Object.values(S.logs).forEach((L) => (L.entries || []).forEach((e) => ids.add(e.ex)));
    const rows = [...ids]
        .map((id) => ({ ex: getEx(id), ss: sessions(id) }))
        .filter(
            (r) => r.ex && r.ss.length && q.every((t) => hay(r.ex).some((w) => w.startsWith(t)))
        );
    rows.sort((a, b) => b.ss[b.ss.length - 1].d.localeCompare(a.ss[a.ss.length - 1].d));
    if (!rows.length)
        return (
            '<div class="card empty"><h3>' +
            (ui.pq ? 'No match' : 'No lifts tracked yet') +
            '</h3><div>' +
            (ui.pq
                ? 'Try another name.'
                : 'Mark sets as done on the Today tab and your progress shows up here.') +
            '</div></div>'
        );
    return rows
        .map((r) => {
            const st = stats(r.ex.id),
                last = r.ss[r.ss.length - 1];
            return (
                '<button class="hrow" data-a="openProg" data-id="' +
                r.ex.id +
                '">' +
                exThumb(r.ex) +
                '<div class="grow"><div class="nm">' +
                esc(r.ex.name) +
                '</div><div class="mu sm-t">' +
                r.ss.length +
                ' session' +
                (r.ss.length > 1 ? 's' : '') +
                ' · last ' +
                fmtSet(last.tp.w, last.tp.r) +
                '</div></div>' +
                spark(r.ss) +
                (st.pr
                    ? '<span class="chip st pr">' +
                      (st.pr.w > 0 ? fmtN(st.pr.w) : fmtN(st.pr.r) + ' reps') +
                      '</span>'
                    : '') +
                '</button>'
            );
        })
        .join('');
}

function pgList() {
    const e = $('#pg-list');
    if (e) e.innerHTML = pgRows();
}

function volWeeks(n) {
    const now = today(),
        mon = addD(now, -wdi(now)),
        out = [];
    for (let i = n - 1; i >= 0; i--) {
        const s = addD(mon, -7 * i);
        let v = 0;
        for (let k = 0; k < 7; k++) {
            const L = S.logs[addD(s, k)];
            if (L) v += vol(L);
        }
        out.push({ d: s, y: Math.round(v), pr: false });
    }
    return out;
}

function muscleSets(days) {
    const c = {},
        from = addD(today(), -days + 1);
    for (const d in S.logs) {
        if (d < from) continue;
        for (const en of S.logs[d].entries || []) {
            const x = getEx(en.ex);
            if (!x) continue;
            const n = en.sets.filter((s) => s.d && !s.wu).length;
            if (n) c[x.m] = (c[x.m] || 0) + n;
        }
    }
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
}

function topLifts() {
    const ids = {};
    Object.values(S.logs).forEach((L) =>
        (L.entries || []).forEach((e) => {
            ids[e.ex] = 1;
        })
    );
    return Object.keys(ids)
        .map((id) => ({ id, ex: getEx(id), ss: sessions(id) }))
        .filter((r) => r.ex && r.ss.length)
        .sort((a, b) => b.ss.length - a.ss.length);
}

// Chart value for one session. Bodyweight lifts with no added weight chart reps instead.
const metricY = (x, m) =>
    m === 'w'
        ? x.tp.w > 0
            ? x.tp.w
            : x.tp.r
        : m === 'e'
          ? x.e1 > 0
              ? Math.round(x.e1 * 10) / 10
              : x.tp.r
          : x.v > 0
            ? Math.round(x.v)
            : x.tr;

const metricPts = (ss, m) => ss.map((x) => ({ d: x.d, pr: x.pr, y: metricY(x, m) }));

// Metric buttons. A lift that never used added weight shows reps and hides estimated 1RM.
const metricTabs = (ss) =>
    ss.every((x) => x.tp.w === 0)
        ? [
              ['w', 'Best reps'],
              ['v', 'Total reps'],
          ]
        : [
              ['w', 'Top weight'],
              ['e', 'Est. 1RM'],
              ['v', 'Volume'],
          ];

function vProg() {
    let h = head('Progress');
    const tl = topLifts();
    if (!tl.length)
        return (
            h +
            '<div class="card empty"><h3>No progress to show yet</h3><div>Log a workout and tick your sets as done. Charts for weekly volume, muscle balance and every lift will appear here.</div></div>'
        );
    const now = today(),
        from = addD(now, -29),
        prm = prByDay();
    let wk = 0,
        v = 0,
        pc = 0,
        sets = 0;
    Object.keys(S.logs).forEach((d) => {
        if (d < from || d > now) return;
        const L = S.logs[d];
        if (!L.rest && L.entries.length) {
            wk++;
            v += vol(L);
            L.entries.forEach((e) =>
                e.sets.forEach((s) => {
                    if (s.d && !s.wu) sets++;
                })
            );
        }
        pc += prm[d] ? prm[d].size : 0;
    });
    h +=
        '<div class="tiles t2"><div class="tile"><b>' +
        wk +
        '</b><span>Workouts, last 30 days</span></div><div class="tile"><b>' +
        sets +
        '</b><span>Working sets</span></div><div class="tile"><b>' +
        fmtK(v) +
        ' <small style="font-size:14px;font-weight:650;color:var(--mu)">' +
        S.unit +
        '</small></b><span>Volume lifted</span></div><div class="tile"><b>' +
        pc +
        (pc ? ' ★' : '') +
        '</b><span>New PRs</span></div></div>';
    const sel = tl.find((r) => r.id === ui.pex) || tl[0];
    const pm = metricTabs(sel.ss).some((m) => m[0] === ui.pm) ? ui.pm : 'w';
    h +=
        '<div class="card"><div class="ct2">Lift progress</div><div class="sub2">Pick a lift to see how it’s trending</div><div class="pk-chips" style="padding:0 0 10px;margin:0 -2px">' +
        tl
            .slice(0, 8)
            .map(
                (r) =>
                    '<button class="chip ' +
                    (r.id === sel.id ? 'on' : '') +
                    '" data-a="pex" data-id="' +
                    r.id +
                    '">' +
                    esc(r.ex.name) +
                    '</button>'
            )
            .join('') +
        '</div>' +
        '<div class="seg">' +
        metricTabs(sel.ss)
            .map(
                (m) =>
                    '<button class="' +
                    (pm === m[0] ? 'on' : '') +
                    '" data-a="pmi" data-v="' +
                    m[0] +
                    '">' +
                    m[1] +
                    '</button>'
            )
            .join('') +
        '</div>' +
        lineChart(metricPts(sel.ss, pm), pm === 'v' ? fmtK : (x) => fmtN(Math.round(x * 10) / 10)) +
        '<div class="mu sm-t" style="margin:6px 0 12px">★ marks a session with a new PR</div><button class="btn sm" data-a="openProg" data-id="' +
        sel.id +
        '">Open details</button></div>';
    h +=
        '<div class="card"><div class="ct2">Weekly volume</div><div class="sub2">Total ' +
        S.unit +
        ' lifted, last 12 weeks</div>' +
        lineChart(volWeeks(12), fmtK) +
        '</div>';
    h +=
        '<div class="card"><div class="ct2">Workouts per week</div><div class="sub2">Last 8 weeks</div>' +
        weekBars() +
        '</div>';
    const ms = muscleSets(30),
        mx = ms[0] ? ms[0][1] : 1;
    h +=
        '<div class="card"><div class="ct2">Muscle balance</div><div class="sub2">Working sets, last 30 days</div>' +
        (ms.length
            ? ms
                  .map(
                      (a) =>
                          '<div class="mb"><span>' +
                          a[0] +
                          '</span><div class="trk"><i style="width:' +
                          ((a[1] / mx) * 100).toFixed(0) +
                          '%"></i></div><b>' +
                          a[1] +
                          '</b></div>'
                  )
                  .join('')
            : '<div class="mu sm-t">No sets in the last 30 days.</div>') +
        '</div>';
    h +=
        '<div class="sec">All lifts</div><input class="inp" data-f="pgq" placeholder="Search your exercises…" value="' +
        esc(ui.pq || '') +
        '" autocomplete="off" style="margin-bottom:12px"><div id="pg-list">' +
        pgRows() +
        '</div>';
    return h;
}
