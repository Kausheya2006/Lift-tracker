'use strict';
// Small helpers: DOM, escaping, dates, number formatting, toast.

const $ = (s) => document.querySelector(s);

const esc = (s) =>
    String(s == null ? '' : s).replace(
        /[&<>"]/g,
        (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]
    );

const pad = (n) => String(n).padStart(2, '0');

const ds = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());

const pd = (s) => {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
};

const today = () => ds(new Date());

const addD = (s, n) => {
    const d = pd(s);
    d.setDate(d.getDate() + n);
    return ds(d);
};

const wdi = (s) => (pd(s).getDay() + 6) % 7;

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const fmtLong = (s) =>
    pd(s).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

const fmtShort = (s) =>
    pd(s).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

const num = (v) => {
    const n = parseFloat(v);
    return isFinite(n) ? n : 0;
};

const fmtN = (n) => String(Math.round(n * 100) / 100);

const rnd = (v) => {
    const s = S.unit === 'lb' ? 5 : 2.5;
    return Math.max(s, Math.round(v / s) * s);
};

let toastT;

function toast(m) {
    const t = $('#toast');
    t.textContent = m;
    t.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('show'), 2000);
}

const sdate = (d) => pd(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

const APPV = '1.4';

const fmtK = (v) => (v >= 10000 ? fmtN(Math.round(v / 100) / 10) + 'k' : String(Math.round(v)));

function swap(a, i, j) {
    if (j < 0 || j >= a.length) return;
    [a[i], a[j]] = [a[j], a[i]];
}
