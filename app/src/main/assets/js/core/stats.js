'use strict';
// PRs, last performance, sessions, volume and set generation.

function stats(id) {
    const flags = new Set();
    let best = 0,
        pr = null;
    for (const d of Object.keys(S.logs).sort()) {
        for (const en of S.logs[d].entries || []) {
            if (en.ex !== id) continue;
            for (const s of en.sets) {
                const w = num(s.w),
                    r = num(s.r);
                if (!s.d || s.wu || !(w > 0)) continue;
                if (w > best) {
                    if (best > 0) flags.add(s);
                    best = w;
                    pr = { w, r, d };
                } else if (w === best && r > pr.r) {
                    pr = { w, r, d };
                }
            }
        }
    }
    return { pr, flags };
}

function lastPerf(id, date) {
    for (const d of Object.keys(S.logs).sort().reverse()) {
        if (d >= date) continue;
        for (const en of S.logs[d].entries || []) {
            if (en.ex !== id) continue;
            let b = null;
            for (const s of en.sets) {
                const w = num(s.w);
                if (s.d && !s.wu && w > 0 && (!b || w > b.w)) b = { w, r: s.r };
            }
            if (b) return b;
        }
    }
    return null;
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

function mkSets(id, date, wu, n, reps) {
    const lp = lastPerf(id, date),
        lw = lp ? lp.w : '',
        r = parseInt(reps) || '',
        out = [];
    for (let i = 0; i < wu; i++)
        out.push({ wu: 1, w: lw ? rnd(((lw * (i + 1)) / (wu + 1)) * 0.85) : '', r: r, d: 0 });
    for (let i = 0; i < n; i++) out.push({ w: lw, r: r, d: 0 });
    return out;
}
