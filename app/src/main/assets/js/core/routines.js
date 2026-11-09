'use strict';
// Routine logic: weekly plans and rotating splits.

const dd = (a, b) => {
    const x = pd(a),
        y = pd(b);
    return Math.round(
        (Date.UTC(y.getFullYear(), y.getMonth(), y.getDate()) -
            Date.UTC(x.getFullYear(), x.getMonth(), x.getDate())) /
            864e5
    );
};

function slotFor(rt, date) {
    if (!rt) return null;
    const n = rt.days.length;
    if (rt.mode === 'cycle' && n) {
        const k = ((dd(rt.start || date, date) % n) + n) % n;
        return { ids: (rt.days[k] || []).filter(gget), label: 'Day ' + (k + 1) + ' of ' + n, k };
    }
    const k = wdi(date);
    return { ids: (rt.days[k] || []).filter(gget), label: DAYS[k], k };
}

const rtDesc = (rt) =>
    rt.mode === 'cycle'
        ? rt.days.filter((x) => x.length).length +
          ' training + ' +
          rt.days.filter((x) => !x.length).length +
          ' rest, repeating'
        : 'Weekly plan, Monday to Sunday';

function rebuildC(d) {
    const old = d.daysC,
        a = [];
    for (let i = 0; i < d.tr; i++) a.push(old[i] || []);
    for (let i = 0; i < d.rs; i++) a.push([]);
    d.daysC = a;
    if (d.cur > a.length) d.cur = 1;
}
