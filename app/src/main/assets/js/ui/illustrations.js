'use strict';
// Generated pose illustrations, used for exercises without a photo.

const D2R = Math.PI / 180,
    LN = { T: 22, UA: 12, FA: 11, TH: 16, SH: 15 };

const vv = (a, l) => [Math.cos(a * D2R) * l, Math.sin(a * D2R) * l],
    ad = (p, v) => [p[0] + v[0], p[1] + v[1]],
    mx = (p, q, k) => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k];

const f1 = (n) => Math.round(n * 10) / 10,
    pt = (p) => f1(p[0]) + ' ' + f1(p[1]);

const sg = (pts, w, c) =>
    '<path class="' + c + '" stroke-width="' + w + '" d="M' + pts.map(pt).join('L') + '"/>';

const ci = (p, r, c) =>
    '<circle class="' + c + '" cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="' + r + '"/>';

const POSE = {
    ohp: { t: -90, ua: -58, fa: -98, th: 90, sh: 90, imp: 'W' },
    frontraise: { t: -88, ua: -8, fa: -6, th: 90, sh: 90, imp: 'W' },
    reardelt: { t: -25, ua: 80, fa: 95, th: 75, sh: 100, imp: 'W' },
    curl: { t: -90, ua: 85, fa: -50, th: 90, sh: 90, imp: 'W' },
    preacher: { t: -72, ua: 30, fa: -55, th: 90, sh: 90, imp: 'W', furn: ['padp'] },
    pushdown: { t: -86, ua: 84, fa: 35, th: 90, sh: 90, imp: 'W', cab: [10, -52] },
    ohtri: { t: -90, ua: -70, fa: 128, th: 90, sh: 90, imp: 'W' },
    skull: { t: 180, ua: -95, fa: -170, th: -15, sh: 100, imp: 'W', lay: 'bench', furn: ['bench'] },
    kickback: { t: -22, ua: 168, fa: 176, th: 80, sh: 100, imp: 'W' },
    bench: { t: 180, ua: -90, fa: -90, th: -15, sh: 100, imp: 'W', lay: 'bench', furn: ['bench'] },
    incbench: {
        t: -150,
        ua: -70,
        fa: -75,
        th: -10,
        sh: 95,
        imp: 'W',
        lay: 'seat',
        furn: ['incl', 'seat'],
    },
    decbench: {
        t: 155,
        ua: -90,
        fa: -90,
        th: -30,
        sh: 105,
        imp: 'W',
        lay: 'bench',
        furn: ['incl'],
    },
    fly: { t: 180, ua: -60, fa: -105, th: -15, sh: 100, imp: 'W', lay: 'bench', furn: ['bench'] },
    cablefly: {
        t: -80,
        ua: -25,
        fa: -12,
        th: 100,
        sh: 85,
        imp: 'W',
        cab: [-34, -30],
        far: { th: 70, sh: 100 },
    },
    pecdeck: {
        t: -94,
        ua: -14,
        fa: -6,
        th: 2,
        sh: 90,
        imp: 'W',
        lay: 'seat',
        furn: ['seat', 'incl'],
    },
    pushup: { t: -24, ua: 90, fa: 90, th: 156, sh: 156, ft: 30, lay: 'floor' },
    plank: { t: -6, ua: 90, fa: 0, th: 174, sh: 174, ft: 75, lay: 'floor' },
    dip: { t: -84, ua: 100, fa: -12, th: 98, sh: 125, nofl: 1, furn: ['bars'] },
    squat: { t: -52, ua: 75, fa: -70, th: 8, sh: 108, imp: 'S' },
    goblet: { t: -72, ua: 70, fa: -55, th: 10, sh: 100, imp: 'W' },
    legpress: { t: -135, ua: 40, fa: 5, th: -58, sh: -28, lay: 'seat', furn: ['incl', 'plat'] },
    legext: { t: -96, ua: 60, fa: 25, th: 2, sh: -8, lay: 'seat', furn: ['seat', 'incl', 'shin'] },
    legcurl: { t: 2, ua: 70, fa: 60, th: 178, sh: -95, lay: 'bench', furn: ['bench'] },
    lunge: { t: -88, ua: 90, fa: 90, th: 25, sh: 100, far: { th: 115, sh: 170 }, imp: 'W' },
    deadlift: { t: -38, ua: 90, fa: 92, th: 68, sh: 98, imp: 'W' },
    gm: { t: -42, ua: 70, fa: -45, th: 78, sh: 96, imp: 'S' },
    hipthrust: { t: 166, ua: 70, fa: 20, th: -28, sh: 88, imp: 'H', furn: ['upper'] },
    bridge: { t: 170, ua: 60, fa: 30, th: -28, sh: 88, lay: 'floor' },
    bentrow: { t: -28, ua: 135, fa: 95, th: 72, sh: 100, imp: 'W' },
    seatedrow: {
        t: -92,
        ua: 118,
        fa: -8,
        th: -8,
        sh: 8,
        imp: 'W',
        cab: [48, 2],
        lay: 'seat',
        furn: ['seatf'],
    },
    pulldown: {
        t: -98,
        ua: 105,
        fa: -75,
        th: -4,
        sh: 88,
        imp: 'W',
        cab: [-2, -50],
        lay: 'seat',
        furn: ['seat'],
    },
    pullup: { t: -90, ua: -120, fa: -52, th: 98, sh: 112, nofl: 1, furn: ['pbar'] },
    hangleg: { t: -92, ua: -92, fa: -88, th: -6, sh: -4, nofl: 1, furn: ['pbar'] },
    crunch: { t: -142, ua: -70, fa: -140, th: -55, sh: 92, lay: 'floor' },
    calf: { t: -90, ua: 88, fa: 90, th: 90, sh: 90, ft: 55, imp: 'W' },
    upright: { t: -90, ua: -45, fa: 120, th: 90, sh: 90, imp: 'W' },
    hang: { t: -90, ua: 90, fa: 90, th: 90, sh: 90, imp: 'W' },
    carry: { t: -90, ua: 90, fa: 90, th: 76, sh: 88, far: { th: 108, sh: 96 }, imp: 'W' },
    wristcurl: { t: -62, ua: 75, fa: 5, th: 3, sh: 90, imp: 'W', lay: 'seat', furn: ['seat'] },
    russian: { t: -118, ua: 15, fa: -10, th: -42, sh: 25, imp: 'W', lay: 'floor' },
    pullover: {
        t: 180,
        ua: -150,
        fa: -165,
        th: -15,
        sh: 100,
        imp: 'W',
        lay: 'bench',
        furn: ['bench'],
    },
    backext: { t: -18, ua: 70, fa: 130, th: 162, sh: 162, furn: ['hpad'] },
    glutekick: { t: -72, ua: 12, fa: 8, th: 90, sh: 90, far: { th: 140, sh: 155 } },
    facepull: { t: -90, ua: 172, fa: -42, th: 90, sh: 90, cab: [48, -4] },
};

const FRONT = {
    lateral: { a: [68, 78], g: [3, 0], imp: 1 },
    abd: { a: [6, 4], g: [0, 0], g2: [34, 34] },
};

function poseKey(x) {
    const n = x.name.toLowerCase(),
        m = x.m,
        e = x.e,
        t = (r) => r.test(n);
    if (t(/pull-?ups?\b|chin-?ups?\b|muscle.?up|pullups/)) return 'pullup';
    if (t(/pulldown|pull-down|pull down/)) return 'pulldown';
    if (t(/face pull/)) return 'facepull';
    if (t(/hanging|knee.*raise|hip raise/)) return 'hangleg';
    if (t(/plank|mountain|bear crawl|body saw/)) return 'plank';
    if (t(/push-?up|pushups|press-?up/)) return 'pushup';
    if (t(/\bdips?\b/)) return 'dip';
    if (t(/skull|lying triceps|french press/)) return 'skull';
    if (m === 'Triceps' && t(/overhead|behind the head|seated triceps/)) return 'ohtri';
    if (t(/pushdown|press-?down|push-down/)) return 'pushdown';
    if (t(/kickback/)) return m === 'Glutes' ? 'glutekick' : 'kickback';
    if (t(/leg curl|lying curl|hamstring curl|glute.?ham|nordic|ham curl/)) return 'legcurl';
    if (t(/wrist|finger/)) return 'wristcurl';
    if (t(/preacher|spider/)) return 'preacher';
    if (t(/curl/) && m !== 'Hamstrings') return 'curl';
    if (t(/pec deck|butterfly|reverse machine|machine fly/)) return 'pecdeck';
    if (t(/rear delt|reverse fl|bent.?over.*(raise|fly)|lying rear/)) return 'reardelt';
    if (t(/crossover|cable.*fl[yi]|fl[yi].*cable/)) return 'cablefly';
    if (t(/fl[yi]e?s?\b/) && m === 'Chest') return 'fly';
    if (t(/lateral raise|side raise|side lateral|lateral.*raise/)) return 'lateral';
    if (t(/front.*raise|plate raise|raise.*front|swing/)) return 'frontraise';
    if (t(/shrug/)) return 'hang';
    if (t(/upright row/)) return 'upright';
    if (!t(/lunge/) && t(/farmer|carry|walk/)) return 'carry';
    if (t(/\brows?\b/)) return e === 'C' || t(/seated|machine|low/) ? 'seatedrow' : 'bentrow';
    if (t(/good morning/)) return 'gm';
    if (t(/deadlift|rack pull|pull through|clean|snatch|stiff/)) return 'deadlift';
    if (t(/hip thrust|thrust/)) return 'hipthrust';
    if (t(/bridge/)) return 'bridge';
    if (t(/calf/)) return 'calf';
    if (t(/leg press|sled/)) return 'legpress';
    if (t(/leg extension/)) return 'legext';
    if (t(/lunge|split squat|step.?up/)) return 'lunge';
    if (t(/goblet/) || (t(/squat/) && (e === 'D' || e === 'K'))) return 'goblet';
    if (t(/squat|thruster/)) return 'squat';
    if (t(/donkey|heel/)) return 'calf';
    if (t(/abduct|adduct|thigh/)) return 'abd';
    if (t(/russian|twist|oblique|woodchop/)) return 'russian';
    if (t(/crunch|sit-?up|roll-?out|ab roller|v-up|jack ?knife|flutter|leg raise|raise.*leg/))
        return 'crunch';
    if (t(/pullover/)) return 'pullover';
    if (t(/hyperext|back extension/)) return 'backext';
    if (t(/incline/) && (m === 'Chest' || t(/press/))) return 'incbench';
    if (t(/decline/)) return 'decbench';
    if ((m === 'Chest' || m === 'Triceps') && t(/bench|press/)) return 'bench';
    if (m === 'Shoulders' && t(/press|raise|jerk/)) return 'ohp';
    if (t(/press/)) return 'ohp';
    return (
        {
            Chest: 'bench',
            Back: 'bentrow',
            Shoulders: 'ohp',
            Traps: 'hang',
            Biceps: 'curl',
            Triceps: 'pushdown',
            Forearms: 'wristcurl',
            Abs: 'crunch',
            Quads: 'squat',
            Hamstrings: 'deadlift',
            Glutes: 'hipthrust',
            Calves: 'calf',
            Hips: 'abd',
        }[m] || 'hang'
    );
}

function hlShapes(m, H, S, E, W, K, A, hd) {
    switch (m) {
        case 'Chest':
            return sg([mx(H, S, 0.58), mx(H, S, 0.95)], 9.5, 'zh');
        case 'Back':
            return sg([mx(H, S, 0.3), mx(H, S, 0.92)], 9.5, 'zh');
        case 'Traps':
            return sg([mx(H, S, 0.86), mx(H, S, 1)], 9.5, 'zh') + ci(mx(S, hd, 0.35), 3.4, 'zhf');
        case 'Shoulders':
            return ci(S, 5.8, 'zhf');
        case 'Biceps':
        case 'Triceps':
            return sg([mx(S, E, 0.06), mx(S, E, 0.94)], 7, 'zh');
        case 'Forearms':
            return sg([mx(E, W, 0.06), mx(E, W, 0.94)], 7, 'zh');
        case 'Abs':
            return sg([mx(H, S, 0.06), mx(H, S, 0.5)], 9.5, 'zh');
        case 'Quads':
        case 'Hamstrings':
            return sg([mx(H, K, 0.06), mx(H, K, 0.94)], 7.5, 'zh');
        case 'Glutes':
            return ci(H, 6.5, 'zhf');
        case 'Calves':
            return sg([mx(K, A, 0.1), mx(K, A, 0.92)], 7.5, 'zh');
        case 'Hips':
            return ci(H, 5.5, 'zhf') + sg([mx(H, K, 0.05), mx(H, K, 0.5)], 7.5, 'zh');
    }
    return '';
}

function implShape(e, loc, cab, W) {
    let s = '';
    if (e === 'B' || e === 'Z' || e === 'S') {
        s += ci(loc, e === 'Z' ? 5.2 : 6.4, 'zp') + ci(loc, 1.3, 'zq');
        if (e === 'S')
            s += sg(
                [
                    [loc[0] + 10, loc[1] - 26],
                    [loc[0] + 10, loc[1] + 26],
                ],
                1.6,
                'zm'
            );
    } else if (e === 'D') s += ci(loc, 4.6, 'zq');
    else if (e === 'K')
        s +=
            ci(ad(loc, [0, 1.5]), 5, 'zq') +
            '<path class="zm" stroke-width="1.8" d="M' +
            pt(ad(loc, [-3, -2.5])) +
            'a3 3.2 0 0 1 6 0"/>';
    else if (e === 'C') s += ci(loc, 2.4, 'zp');
    else if (e === 'M') s += ci(loc, 3.2, 'zp');
    return s;
}

function figure(key, m, e) {
    const P = POSE[key],
        H = [0, 0],
        S = ad(H, vv(P.t, LN.T)),
        E = ad(S, vv(P.ua, LN.UA)),
        W = ad(E, vv(P.fa, LN.FA)),
        K = ad(H, vv(P.th, LN.TH)),
        A = ad(K, vv(P.sh, LN.SH)),
        ft = P.ft || 0,
        T = ad(A, vv(ft, 5)),
        hd = ad(S, vv(P.t, 9.5));
    const fr = P.far || { th: P.th, sh: P.sh },
        K2 = ad(H, vv(fr.th, LN.TH)),
        A2 = ad(K2, vv(fr.sh, LN.SH)),
        T2 = ad(A2, vv(ft, 5));
    let fl = null;
    if (!P.nofl) {
        fl = Math.max(T[1], A[1], T2[1]);
        const L = P.lay;
        if (L === 'bench') fl = Math.max(fl, H[1] + 15);
        else if (L === 'seat') fl = Math.max(fl, H[1] + 14);
        else if (L === 'floor') fl = Math.max(fl, H[1] + 5);
    }
    const pts = [H, S, E, W, K, A, T, K2, A2, [hd[0] - 6, hd[1] - 6], [hd[0] + 6, hd[1] + 6]];
    let fur = '',
        imp = '',
        cabl = '';
    const post = (x, y) =>
        fl != null && fl - y > 2
            ? '<rect class="zfu" x="' +
              f1(x - 1.5) +
              '" y="' +
              f1(y) +
              '" width="3" height="' +
              f1(fl - y) +
              '"/>'
            : '';
    const FU = {
        bench: () => {
            const lo = Math.min(S[0], H[0]),
                hi = Math.max(S[0], H[0]),
                x1 = lo - 10,
                x2 = hi + 14,
                top = H[1] + 5;
            pts.push([x1, top], [x2, top + 4]);
            return (
                '<rect class="zfu" x="' +
                f1(x1) +
                '" y="' +
                f1(top) +
                '" width="' +
                f1(x2 - x1) +
                '" height="4" rx="2"/>' +
                post(x1 + 5, top + 4) +
                post(x2 - 5, top + 4)
            );
        },
        upper: () => {
            const x1 = S[0] - 14,
                x2 = S[0] + 8,
                top = S[1] + 5;
            pts.push([x1, top], [x2, top + 4]);
            return (
                '<rect class="zfu" x="' +
                f1(x1) +
                '" y="' +
                f1(top) +
                '" width="' +
                f1(x2 - x1) +
                '" height="4" rx="2"/>' +
                post(S[0] - 4, top + 4)
            );
        },
        incl: () => {
            const a = ad(S, vv(P.t - 90, 5.5)),
                b = ad(H, vv(P.t - 90, 5.5));
            pts.push(a, b);
            return sg([a, b], 4, 'zfu2');
        },
        seat: () => {
            const x1 = H[0] - 8,
                x2 = Math.max(H[0] + 10, K[0]),
                top = H[1] + 5;
            pts.push([x1, top]);
            return (
                '<rect class="zfu" x="' +
                f1(x1) +
                '" y="' +
                f1(top) +
                '" width="' +
                f1(x2 - x1) +
                '" height="4" rx="2"/>' +
                post(H[0] + 1, top + 4)
            );
        },
        seatf: () => {
            const x1 = H[0] - 8,
                x2 = H[0] + 12,
                top = H[1] + 5,
                a = ad(T, [3, -10]),
                b = ad(T, [3, 6]);
            pts.push([x1, top], a, b);
            return (
                '<rect class="zfu" x="' +
                f1(x1) +
                '" y="' +
                f1(top) +
                '" width="' +
                f1(x2 - x1) +
                '" height="4" rx="2"/>' +
                post(H[0], top + 4) +
                sg([a, b], 3.5, 'zfu2')
            );
        },
        plat: () => {
            const p = vv(P.sh + 90, 13),
                a = ad(A, p),
                b = ad(A, [-p[0], -p[1]]);
            pts.push(a, b);
            return sg([a, b], 4, 'zfu2');
        },
        shin: () => {
            const a = ad(mx(K, A, 0.62), vv(P.sh - 90, 5.5)),
                b = ad(mx(K, A, 0.96), vv(P.sh - 90, 5.5));
            pts.push(a, b);
            return sg([a, b], 4, 'zfu2');
        },
        padp: () => {
            const a = ad(S, [4, 7]),
                b = ad(S, [17, 22]);
            pts.push(a, b);
            return sg([a, b], 6, 'zfu2') + post(b[0], b[1] + 3);
        },
        hpad: () => {
            const a = [H[0] - 10, H[1] + 8],
                b = [H[0] + 8, H[1] + 12];
            pts.push(a, b);
            return sg([a, b], 5, 'zfu2') + post(H[0] - 2, H[1] + 12);
        },
        pbar: () => {
            const a = [W[0] - 18, W[1]],
                b = [W[0] + 18, W[1]];
            pts.push(a, b);
            return (
                sg([a, b], 3, 'zm') +
                sg([a, [a[0], a[1] - 6]], 2, 'zm') +
                sg([b, [b[0], b[1] - 6]], 2, 'zm')
            );
        },
        bars: () => {
            const a = [W[0] - 14, W[1]],
                b = [W[0] + 14, W[1]],
                c = [b[0], b[1] + 34];
            pts.push(a, c);
            return sg([a, b], 3, 'zm') + sg([b, c], 3, 'zm');
        },
    };
    (P.furn || []).forEach((k) => {
        fur += FU[k]();
    });
    const locs = { W: W, S: ad(S, vv(P.t - 90, 3)), H: H, A: A };
    const loc = P.imp ? locs[P.imp] : null;
    if (loc) {
        pts.push([loc[0] - 8, loc[1] - 8], [loc[0] + 8, loc[1] + 8]);
        imp += implShape(e, loc, P.cab, W);
        if (e === 'R')
            imp +=
                '<path class="zm" stroke-width="1.5" stroke-dasharray="3 2.5" d="M' +
                pt(W) +
                'L' +
                pt(A) +
                '"/>';
    }
    if (e === 'C') {
        let an = null;
        if (P.cab) an = ad(W, P.cab);
        else if (loc) an = W[1] < S[1] + 8 ? ad(W, [2, 40]) : ad(W, [3, -46]);
        if (an) {
            pts.push(mx(W, an, 0.4));
            cabl = sg([W, an], 1.3, 'zm') + ci(an, 2.4, 'zp');
        }
    }
    let sk = '';
    if (e === 'M') {
        const x0 =
                Math.min.apply(
                    null,
                    pts.map((p) => p[0])
                ) - 10,
            yb =
                fl != null
                    ? fl
                    : Math.max.apply(
                          null,
                          pts.map((p) => p[1])
                      ),
            y0 = yb - 36;
        pts.push([x0 - 1, y0]);
        for (let i = 0; i < 5; i++)
            sk +=
                '<rect class="zfu" x="' +
                f1(x0) +
                '" y="' +
                f1(y0 + i * 7.4) +
                '" width="7" height="5.6" rx="1.4"/>';
    }
    const far =
        '<g class="zf">' +
        sg([H, K2, A2, T2], 5.5, 'zb') +
        sg([S, ad(E, [-2, -1]), ad(W, [-2, -1])], 5, 'zb') +
        '</g>';
    const body =
        sg([H, K, A, T], 5.5, 'zb') +
        sg([H, S], 8, 'zb') +
        sg([S, E, W], 5, 'zb') +
        ci(hd, 5.6, 'zbh');
    return wrapSVG(pts, fl, sk + fur + far + body + hlShapes(m, H, S, E, W, K, A, hd) + cabl + imp);
}

function frontFig(key, m, e) {
    const F = FRONT[key],
        SD = (a, l, s) => [s * Math.sin(a * D2R) * l, Math.cos(a * D2R) * l];
    const SL = [-8, 2],
        SR = [8, 2],
        HL = [-4, 24],
        HR = [4, 24];
    const arm = (Sh, s) => {
        const E = ad(Sh, SD(F.a[0], LN.UA, s)),
            W = ad(E, SD(F.a[1], LN.FA, s));
        return [Sh, E, W];
    };
    const leg = (Hp, s, g) => {
        const K = ad(Hp, SD(g[0], LN.TH, s)),
            A = ad(K, SD(g[1], LN.SH, s));
        return [Hp, K, A, ad(A, [s * 3, 1])];
    };
    const aL = arm(SL, -1),
        aR = arm(SR, 1),
        lL = leg(HL, -1, F.g),
        lR = leg(HR, 1, F.g2 || F.g);
    const pts = [SL, SR, aL[2], aR[2], lL[3], lR[3], [-6, -16], [6, 6]];
    let fl = Math.max(lL[3][1], lR[3][1]),
        imp = '';
    if (F.imp) {
        [aL[2], aR[2]].forEach((w) => {
            pts.push([w[0] - 6, w[1] - 6], [w[0] + 6, w[1] + 6]);
            imp += implShape(e === 'K' || e === 'D' ? e : 'D', w);
        });
    }
    let h = '';
    if (m === 'Shoulders') h = ci(SL, 5.8, 'zhf') + ci(SR, 5.8, 'zhf');
    else h = ci(HR, 5.5, 'zhf') + sg([lR[0], mx(lR[0], lR[1], 0.7)], 7.5, 'zh');
    const body =
        sg(lL, 5.5, 'zb') +
        sg(lR, 5.5, 'zb') +
        sg(
            [
                [0, 0],
                [0, 24],
            ],
            8,
            'zb'
        ) +
        sg([SL, SR], 6, 'zb') +
        sg(aL, 5, 'zb') +
        sg(aR, 5, 'zb') +
        ci([0, -9.5], 5.6, 'zbh');
    return wrapSVG(pts, fl, body + h + imp);
}

function wrapSVG(pts, fl, inner) {
    const xs = pts.map((p) => p[0]),
        ys = pts.map((p) => p[1]);
    if (fl != null) ys.push(fl);
    const x0 = Math.min.apply(null, xs),
        x1 = Math.max.apply(null, xs),
        y0 = Math.min.apply(null, ys),
        y1 = Math.max.apply(null, ys),
        pd = 8;
    const vw = Math.max(x1 - x0 + pd * 2, ((y1 - y0 + pd * 2) * 4) / 3),
        vh = (vw * 3) / 4,
        vx = (x0 + x1) / 2 - vw / 2,
        vy = (y0 + y1) / 2 - vh / 2;
    const floor =
        fl != null
            ? '<path class="zfl" d="M' +
              f1(vx + 3) +
              ' ' +
              f1(fl + 1.5) +
              'L' +
              f1(vx + vw - 3) +
              ' ' +
              f1(fl + 1.5) +
              '"/>'
            : '';
    return (
        '<svg viewBox="' +
        [vx, vy, vw, vh].map(f1).join(' ') +
        '" aria-hidden="true">' +
        floor +
        inner +
        '</svg>'
    );
}

const iconCache = {};

function iconFor(x) {
    const k = poseKey(x),
        fr = k === 'lateral' || k === 'abd',
        id = k + '|' + x.m + '|' + x.e;
    return iconCache[id] || (iconCache[id] = fr ? frontFig(k, x.m, x.e) : figure(k, x.m, x.e));
}

window.LIFT_ICON = iconFor;

