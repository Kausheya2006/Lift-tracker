'use strict';
// Builds the searchable exercise library (names, aliases, stemmed search).

const BUILTIN = LIB.map((a) => ({ id: a[0], name: a[1], m: MUSCLES[a[2]], e: a[3], i: a[4] }));

const EXI = {};

BUILTIN.forEach((x) => (EXI[x.id] = x));

const stem = (w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w);

const toks = (s) =>
    s
        .toLowerCase()
        .replace(/flyes?|flies/g, 'fly')
        .replace(/push[- ]?down/g, 'pushdown')
        .replace(/\bt[- ]bar/g, 'tbar')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .split(' ')
        .filter(Boolean)
        .map(stem);

const ALIAS = [
    [/crossover|pec deck|butterfly/i, 'fly pec deck butterfly machine'],
    [/straight-arm.*pulldown/i, 'lat prayer wings'],
    [/pushdown/i, 'pressdown tricep'],
    [/overhead.*tricep/i, 'french press'],
    [/forearm machine|wrist/i, 'forearm wrist machine'],
    [/ab crunch machine|ab roller/i, 'abs machine seated crunch core'],
    [/t-bar/i, 'tbar chest supported'],
];

const hay = (x) =>
    x._h ||
    (x._h = toks(
        x.name +
            ' ' +
            x.m +
            ' ' +
            (MALIAS[x.m] || '') +
            ' ' +
            EQ[x.e] +
            ' ' +
            ALIAS.filter((a) => a[0].test(x.name))
                .map((a) => a[1])
                .join(' ')
    ));
