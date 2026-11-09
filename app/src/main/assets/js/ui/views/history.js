'use strict';
// History tab.

function vHist() {
    let h = head('History');
    const days = Object.keys(S.logs).sort().reverse();
    if (!days.length)
        return (
            h +
            '<div class="card empty"><h3>Nothing logged yet</h3><div>Your training days will show up here.</div></div>'
        );
    const prm = prByDay();
    const groups = [];
    days.forEach((d) => {
        const mk = pd(d).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
        let g = groups[groups.length - 1];
        if (!g || g.mk !== mk) {
            g = { mk, rows: [] };
            groups.push(g);
        }
        g.rows.push(d);
    });
    groups.forEach((g) => {
        h +=
            '<div class="hmon">' +
            esc(g.mk) +
            '</div><div class="tb2">' +
            g.rows
                .map((d) => {
                    const L = S.logs[d],
                        dt = pd(d),
                        prs = prm[d] || new Set();
                    const nm = (L.entries || [])
                        .map((e) => {
                            const x = getEx(e.ex);
                            return x
                                ? prs.has(e.ex)
                                    ? '<b>★ ' + esc(x.name) + '</b>'
                                    : esc(x.name)
                                : '';
                        })
                        .filter(Boolean)
                        .join(', ');
                    return (
                        '<button class="hr" data-a="openDay" data-d="' +
                        d +
                        '"><div class="hd"><span>' +
                        esc(dt.toLocaleDateString(undefined, { weekday: 'short' })) +
                        '</span><b>' +
                        dt.getDate() +
                        '</b></div><div class="hb">' +
                        (L.rest
                            ? '<div class="g mu">Rest day</div>'
                            : '<div class="g">' +
                              (L.groups.length ? gNames(L.groups) : 'Custom workout') +
                              '</div>' +
                              (nm ? '<div class="x">' + nm + '</div>' : '')) +
                        '</div>' +
                        (prs.size
                            ? '<span class="star" aria-label="Personal record">★' +
                              (prs.size > 1 ? '<i>' + prs.size + '</i>' : '') +
                              '</span>'
                            : '') +
                        '</button>'
                    );
                })
                .join('') +
            '</div>';
    });
    return h;
}
