'use strict';
// PRs, last performance, sessions, volume and set generation.

// Bodyweight exercises (equipment W) may be done with no added weight; reps alone count there.
const isBodyweight = (id) => {
    const x = getEx(id);
    return !!x && x.e === 'W';
};

// A set counts towards PRs when it is done and is a normal working set: not a warm-up and not a
// drop set. Without added weight it only counts for bodyweight exercises.
const scored = (s, bw) => s.d && !s.wu && !s.dr && (num(s.w) > 0 || (bw && num(s.r) > 0));

// Higher weight wins; at the same weight, more reps win.
const beats = (w, r, b) => !b || w > b.w || (w === b.w && r > b.r);

// Set to false if the very first set of an exercise should not be marked as a PR.
const PR_FIRST_SET = true;

// "65 kg x 8", or "8 reps" for a bodyweight set with no added weight.
const fmtSet = (w, r) => (w > 0 ? fmtN(w) + ' ' + S.unit + ' × ' + fmtN(r) : fmtN(r) + ' reps');

function stats(id) {
    // PRs are tracked separately for left ('L'), right ('R') and normal ('') sets.
    const bw = isBodyweight(id),
        flags = new Set(),
        prSide = {};
    let pr = null;
    for (const d of Object.keys(S.logs).sort()) {
        for (const en of S.logs[d].entries || []) {
            if (en.ex !== id) continue;
            for (const s of en.sets) {
                if (!scored(s, bw)) continue;
                const w = num(s.w),
                    r = num(s.r),
                    k = s.side || '';
                if (beats(w, r, prSide[k])) {
                    if (prSide[k] || PR_FIRST_SET) flags.add(s);
                    prSide[k] = { w, r, d };
                }
                if (beats(w, r, pr)) pr = { w, r, d };
            }
        }
    }
    return { pr, flags, prSide };
}

// Last session's best set. Pass side ('L' or 'R') to prefer that side's history.
function lastPerf(id, date, side) {
    const bw = isBodyweight(id);
    const find = (useSide) => {
        for (const d of Object.keys(S.logs).sort().reverse()) {
            if (d >= date) continue;
            for (const en of S.logs[d].entries || []) {
                if (en.ex !== id) continue;
                let b = null;
                for (const s of en.sets) {
                    if (useSide && (s.side || '') !== side) continue;
                    if (!scored(s, bw)) continue;
                    const w = num(s.w);
                    if (beats(w, num(s.r), b && { w: b.w, r: num(b.r) })) b = { w, r: s.r };
                }
                if (b) return b;
            }
        }
        return null;
    };
    return (side && find(true)) || find(false);
}

// One row per exercise per day. Drop sets add to volume and set count but never set the top set.
function sessions(id) {
    const bw = isBodyweight(id),
        out = [],
        fl = stats(id).flags;
    for (const d of Object.keys(S.logs).sort()) {
        for (const en of S.logs[d].entries || []) {
            if (en.ex !== id) continue;
            let tp = null,
                n = 0,
                v = 0,
                tr = 0,
                e1 = 0,
                pr = false;
            for (const s of en.sets) {
                const w = num(s.w),
                    r = num(s.r);
                if (!s.d || s.wu || !(w > 0 || (bw && r > 0))) continue;
                n++;
                v += w * r;
                tr += r;
                if (s.dr) continue;
                e1 = Math.max(e1, w * (1 + r / 30));
                if (beats(w, r, tp)) tp = { w, r };
                if (fl.has(s)) pr = true;
            }
            if (tp) out.push({ d, tp, n, v, e1, tr, pr });
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
