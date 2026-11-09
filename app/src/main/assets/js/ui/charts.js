'use strict';
// SVG charts: line chart, weekly bars, sparkline.

function star(cx, cy, r) {
    let p = '';
    for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5,
            q = i % 2 ? r * 0.45 : r;
        p +=
            (i ? 'L' : 'M') +
            (cx + q * Math.cos(a)).toFixed(1) +
            ' ' +
            (cy + q * Math.sin(a)).toFixed(1);
    }
    return p + 'Z';
}

function lineChart(pts, fmt) {
    fmt = fmt || fmtN;
    if (!pts.length) return '';
    const W = 340,
        H = 180,
        PL = 42,
        PR = 12,
        PT = 14,
        PB = 26;
    let lo = Math.min(...pts.map((p) => p.y)),
        hi = Math.max(...pts.map((p) => p.y));
    if (hi === lo) {
        hi = lo + 1;
        lo = Math.max(0, lo - 1);
    }
    const pa = (hi - lo) * 0.18;
    lo = Math.max(0, lo - pa);
    hi += pa;
    const t0 = pd(pts[0].d).getTime(),
        t1 = pd(pts[pts.length - 1].d).getTime();
    const X = (p) =>
        pts.length < 2 || t1 === t0
            ? PL + (W - PL - PR) / 2
            : PL + ((pd(p.d).getTime() - t0) / (t1 - t0)) * (W - PL - PR);
    const Y = (v) => PT + (1 - (v - lo) / (hi - lo)) * (H - PT - PB);
    let g = '';
    [0, 0.5, 1].forEach((f) => {
        const v = lo + (hi - lo) * f,
            y = Y(v);
        g +=
            '<line class="cg" x1="' +
            PL +
            '" x2="' +
            (W - PR) +
            '" y1="' +
            y.toFixed(1) +
            '" y2="' +
            y.toFixed(1) +
            '"/><text class="ct" x="' +
            (PL - 6) +
            '" y="' +
            (y + 3).toFixed(1) +
            '" text-anchor="end">' +
            fmt(v) +
            '</text>';
    });
    const path = pts
        .map((p, i) => (i ? 'L' : 'M') + X(p).toFixed(1) + ' ' + Y(p.y).toFixed(1))
        .join('');
    const area =
        pts.length > 1
            ? '<path class="ca" d="' +
              path +
              'L' +
              X(pts[pts.length - 1]).toFixed(1) +
              ' ' +
              (H - PB) +
              'L' +
              X(pts[0]).toFixed(1) +
              ' ' +
              (H - PB) +
              'Z"/>'
            : '';
    const dots = pts
        .map((p) =>
            p.pr
                ? '<path class="cs" d="' + star(X(p), Y(p.y), 8.5) + '"/>'
                : '<circle class="cp" cx="' +
                  X(p).toFixed(1) +
                  '" cy="' +
                  Y(p.y).toFixed(1) +
                  '" r="3.5"/>'
        )
        .join('');
    return (
        '<svg viewBox="0 0 ' +
        W +
        ' ' +
        H +
        '" class="chart" role="img" aria-label="Progress chart">' +
        g +
        area +
        '<path class="cl" d="' +
        path +
        '"/>' +
        dots +
        '<text class="ct" x="' +
        PL +
        '" y="' +
        (H - 6) +
        '">' +
        sdate(pts[0].d) +
        '</text>' +
        (pts.length > 1
            ? '<text class="ct" x="' +
              (W - PR) +
              '" y="' +
              (H - 6) +
              '" text-anchor="end">' +
              sdate(pts[pts.length - 1].d) +
              '</text>'
            : '') +
        '</svg>'
    );
}

function weekBars() {
    const now = today(),
        mon = addD(now, -wdi(now)),
        ws = [];
    for (let i = 7; i >= 0; i--) {
        const s = addD(mon, -7 * i);
        let c = 0;
        for (let k = 0; k < 7; k++) {
            const L = S.logs[addD(s, k)];
            if (L && !L.rest && L.entries.length) c++;
        }
        ws.push({ s, c });
    }
    const W = 340,
        H = 130,
        mx = Math.max(4, ...ws.map((w) => w.c)),
        bw = 26,
        gap = (W - 8 * bw) / 9;
    return (
        '<svg viewBox="0 0 ' +
        W +
        ' ' +
        H +
        '" class="chart" role="img" aria-label="Workouts per week">' +
        ws
            .map((w, i) => {
                const x = gap + i * (bw + gap),
                    h = ((H - 38) * w.c) / mx,
                    y = H - 22 - h;
                return (
                    '<rect class="' +
                    (i === 7 ? 'cp2' : 'cb') +
                    '" x="' +
                    x.toFixed(1) +
                    '" y="' +
                    y.toFixed(1) +
                    '" width="' +
                    bw +
                    '" height="' +
                    Math.max(h, 2).toFixed(1) +
                    '" rx="5"/>' +
                    (w.c
                        ? '<text class="ct tb" x="' +
                          (x + bw / 2).toFixed(1) +
                          '" y="' +
                          (y - 4).toFixed(1) +
                          '" text-anchor="middle">' +
                          w.c +
                          '</text>'
                        : '') +
                    '<text class="ct" x="' +
                    (x + bw / 2).toFixed(1) +
                    '" y="' +
                    (H - 6) +
                    '" text-anchor="middle">' +
                    sdate(w.s).replace(' ', '\u00a0') +
                    '</text>'
                );
            })
            .join('') +
        '</svg>'
    );
}

function spark(ss) {
    const a = ss.slice(-10).map((x) => x.tp.w);
    if (a.length < 2) return '<span class="spark"></span>';
    const lo = Math.min(...a),
        hi = Math.max(...a),
        r = hi - lo || 1;
    return (
        '<svg class="spark" viewBox="0 0 56 24"><path d="' +
        a
            .map(
                (v, i) =>
                    (i ? 'L' : 'M') +
                    (2 + (i * 52) / (a.length - 1)).toFixed(1) +
                    ' ' +
                    (21 - ((v - lo) / r) * 18).toFixed(1)
            )
            .join('') +
        '"/></svg>'
    );
}
