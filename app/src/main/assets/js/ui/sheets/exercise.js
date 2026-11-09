'use strict';
// Exercise detail and per-lift progress sheets.

SHEETS.exview = function (s) {
    const ex = getEx(s.id) || { name: 'Exercise', m: 'Chest', e: 'W' },
        ph = ex.i >= 0,
        st = stats(s.id),
        ins = INS[ex.i] || [];
    return wrap(
        'Exercise',
        bodyOf(
            (ph
                ? '<div class="xv"><img alt="Start position" src="' +
                  imgSrc(ex.i, 0) +
                  '"><img alt="End position" src="' +
                  imgSrc(ex.i, 1) +
                  '"></div>'
                : '<div class="xvi">' + iconFor(ex) + '</div>') +
                '<div class="nm" style="font-size:22px;letter-spacing:-.03em;margin:4px 0 10px">' +
                esc(ex.name) +
                '</div><div class="chips"><span class="chip st">' +
                ex.m +
                '</span><span class="chip st">' +
                EQ[ex.e] +
                '</span>' +
                (st.pr
                    ? '<span class="chip st pr">PR ' +
                      fmtN(st.pr.w) +
                      ' ' +
                      S.unit +
                      ' × ' +
                      fmtN(st.pr.r) +
                      '</span>'
                    : '') +
                '</div>' +
                (ins.length
                    ? '<div class="sec">How to do it</div><ol class="doc">' +
                      ins.map((t) => '<li>' + esc(t) + '</li>').join('') +
                      '</ol>'
                    : '') +
                (ph
                    ? ''
                    : '<p class="mu sm-t" style="margin-top:14px">No photo for this one, so a drawing is shown.</p>')
        )
    );
};

SHEETS.prog = function (s) {
    const ex = getEx(s.id) || { name: 'Exercise', m: 'Chest', e: 'W' },
        ss = sessions(s.id),
        st = stats(s.id);
    const pts = ss.map((x) => ({
        d: x.d,
        pr: x.pr,
        y:
            s.metric === 'w'
                ? x.tp.w
                : s.metric === 'e'
                  ? Math.round(x.e1 * 10) / 10
                  : Math.round(x.v),
    }));
    const tv = ss.reduce((a, x) => a + x.v, 0),
        b1 = ss.reduce((a, x) => Math.max(a, x.e1), 0),
        np = ss.filter((x) => x.pr).length;
    return wrap(
        'Progress',
        bodyOf(
            '<div class="row" style="margin:4px 0 14px">' +
                exThumb(ex, 'th" style="width:104px;height:70px') +
                '<div class="grow"><div class="nm" style="font-size:18px">' +
                esc(ex.name) +
                '</div><div class="mu sm-t">' +
                ex.m +
                ' · ' +
                EQ[ex.e] +
                '</div></div></div>' +
                '<div class="tiles t2"><div class="tile"><b>' +
                (st.pr
                    ? fmtN(st.pr.w) +
                      ' <small style="font-size:14px">' +
                      S.unit +
                      ' × ' +
                      fmtN(st.pr.r) +
                      '</small>'
                    : '–') +
                '</b><span>Personal record</span></div><div class="tile"><b>' +
                (b1
                    ? fmtN(Math.round(b1 * 10) / 10) +
                      ' <small style="font-size:14px">' +
                      S.unit +
                      '</small>'
                    : '–') +
                '</b><span>Best est. 1RM</span></div><div class="tile"><b>' +
                ss.length +
                (np ? ' <small style="font-size:14px">★ ' + np + '</small>' : '') +
                '</b><span>Sessions</span></div><div class="tile"><b>' +
                (tv >= 10000 ? fmtN(tv / 1000) + 'k' : Math.round(tv)) +
                ' <small style="font-size:14px">' +
                S.unit +
                '</small></b><span>Total volume</span></div></div>' +
                '<div class="seg">' +
                [
                    ['w', 'Top weight'],
                    ['e', 'Est. 1RM'],
                    ['v', 'Volume'],
                ]
                    .map(
                        (m) =>
                            '<button class="' +
                            (s.metric === m[0] ? 'on' : '') +
                            '" data-a="pmet" data-v="' +
                            m[0] +
                            '">' +
                            m[1] +
                            '</button>'
                    )
                    .join('') +
                '</div>' +
                '<div class="card">' +
                (pts.length
                    ? lineChart(
                          pts,
                          s.metric === 'v'
                              ? (v) => Math.round(v)
                              : (v) => fmtN(Math.round(v * 10) / 10)
                      )
                    : '<div class="empty">No sets logged yet</div>') +
                (np
                    ? '<div class="mu sm-t" style="margin-top:6px">★ marks a session where you set a new PR</div>'
                    : '') +
                '</div>' +
                '<div class="sec">Sessions</div><div class="tb2">' +
                ss
                    .slice()
                    .reverse()
                    .map(
                        (x) =>
                            '<div class="hr"><div class="hd" style="width:74px"><span>' +
                            esc(pd(x.d).toLocaleDateString(undefined, { weekday: 'short' })) +
                            '</span><b style="font-size:16px">' +
                            esc(sdate(x.d)) +
                            '</b></div><div class="hb"><div class="g">' +
                            fmtN(x.tp.w) +
                            ' ' +
                            S.unit +
                            ' × ' +
                            fmtN(x.tp.r) +
                            '</div><div class="x">' +
                            x.n +
                            ' working set' +
                            (x.n > 1 ? 's' : '') +
                            ' · ' +
                            Math.round(x.v) +
                            ' ' +
                            S.unit +
                            ' volume</div></div>' +
                            (x.pr ? '<span class="star">★</span>' : '') +
                            '</div>'
                    )
                    .join('') +
                '</div>'
        )
    );
};
