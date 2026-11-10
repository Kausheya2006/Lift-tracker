'use strict';
// Saved data (localStorage), UI state, theme.

const KEY = 'lift.v1';

const fresh = () => ({
    v: 1,
    custom: [],
    groups: [],
    routines: [],
    active: null,
    logs: {},
    unit: 'kg',
    theme: 'auto',
    splitPref: {},
});

function load() {
    try {
        const s = JSON.parse(localStorage.getItem(KEY));
        if (s && s.v === 1) return Object.assign(fresh(), s);
    } catch (e) {}
    return fresh();
}

let S = load();

function save() {
    try {
        localStorage.setItem(KEY, JSON.stringify(S));
    } catch (e) {}
}

const getEx = (id) => EXI[id] || S.custom.find((x) => x.id === id);

const gget = (id) => S.groups.find((g) => g.id === id);

const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

const ui = {
    tab: 'today',
    date: today(),
    pick: new Set(),
    hv: 'days',
    pq: '',
    pex: null,
    pm: 'w',
    stack: [],
    confirm: null,
    setMenu: null,
};

const topSheet = () => ui.stack[ui.stack.length - 1];

const lg = () => S.logs[ui.date];

function applyTheme() {
    const r = document.documentElement;
    if (S.theme === 'auto') r.removeAttribute('data-theme');
    else r.setAttribute('data-theme', S.theme);
}
