'use strict';
// PRs, last performance, sessions, volume and set generation.

function stats(id) {
    // PRs are tracked separately for left ('L'), right ('R') and normal ('') sets.
    const flags = new Set(),
        best = { '': 0, L: 0, R: 0 },
        prSide = {};
    let top = 0,
        pr = null;
    for (const d of Object.keys(S.logs).sort()) {
        for (const en of S.logs[d].entries || []) {
            if (en.ex !== id) continue;
            for (const s of en.sets) {
                const w = num(s.w),
                    r = num(s.r),
                    k = s.side || '';
                if (!s.d || s.wu || !(w > 0)) continue;
                if (w > best[k]) {
                    if (best[k] > 0) flags.add(s);
                    best[k] = w;
                    prSide[k] = { w, r, d };
                } else if (w === best[k] && r > prSide[k].r) {
                    prSide[k] = { w, r, d };
                }
                if (w > top) {
                    top = w;
                    pr = { w, r, d };
                } else if (w === top && r > pr.r) {
                    pr = { w, r, d };
                }
            }
        }
    }
    return { pr, flags, prSide };
}

// Last session's best set. Pass side ('L' or 'R') to prefer that side's history.
function lastPerf(id, date, side) {
    const find = (useSide) => {
        for (const d of Object.keys(S.logs).sort().reverse()) {
            if (d >= date) continue;
            for (const en of S.logs[d].entries || []) {
                if (en.ex !== id) continue;
                let b = null;
                for (const s of en.sets) {
                    if (useSide && (s.side || '') !== side) continue;
                    const w = num(s.w);
                    if (s.d && !s.wu && w > 0 && (!b || w > b.w)) b = { w, r: s.r };
                }
                if (b) return b;
            }
        }
        return null;
    };
    return (side && find(true)) || find(false);
}

function sessions(id) {
    const out = [],
        fl = stats(id).flags;
    for (const d of Object.keys(S.logs).sort()) {
        for (const en of S.logs[d].entries || []) {
            if (en.ex !== id) continue;
            let tp = null,
                n = 0,
                v = 0,
                e1 = 0,
                pr = false;
            for (const s of en.sets) {
                const w = num(s.w),
                    r = num(s.r);
                if (!s.d || s.wu || !(w > 0)) continue;
                n++;
                v += w * r;
                e1 = Math.max(e1, w * (1 + r / 30));
                if (!tp || w > tp.w || (w === tp.w && r > tp.r)) tp = { w, r };
                if (fl.has(s)) pr = true;
            }
            if (n) out.push({ d, tp, n, v, e1, pr });
        }
    }
    return out;
}

function prByDay() {
    const m = {},
        ids = new Set();
    Object.values(S.logs).forEach((L) => (L.entries || []).forEach((e) => ids.add(e.ex)));
    ids.forEach((id) => {
        const fl = stats(id).flags;
        if (!fl.size) return;
        for (const d in S.logs)
            for (const en of S.logs[d].entries || [])
                if (en.ex === id && en.sets.some((s) => fl.has(s)))
                    (m[d] = m[d] || new Set()).add(id);
    });
    return m;
}

const vol = (L) =>
    (L.entries || []).reduce(
        (a, e) => a + e.sets.reduce((b, s) => b + (s.d && !s.wu ? num(s.w) * num(s.r) : 0), 0),
        0
    );

// Builds the starting sets. With split=true you get a left list and a right list.
function mkSets(id, date, wu, n, reps, split) {
    const r = parseInt(reps) || '',
        out = [];
    (split ? ['L', 'R'] : ['']).forEach((side) => {
        const lp = lastPerf(id, date, side),
            lw = lp ? lp.w : '',
            mk = (o) => {
                if (side) o.side = side;
                return o;
            };
        for (let i = 0; i < wu; i++)
            out.push(
                mk({ wu: 1, w: lw ? rnd(((lw * (i + 1)) / (wu + 1)) * 0.85) : '', r: r, d: 0 })
            );
        for (let i = 0; i < n; i++) out.push(mk({ w: lw, r: r, d: 0 }));
    });
    return out;
}
