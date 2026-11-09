'use strict';
// Settings and document (About, Privacy…) sheets.

SHEETS.settings = function (s) {
    const lr = (k, l) =>
        '<button class="lrow" data-a="doc" data-v="' +
        k +
        '"><span>' +
        l +
        '</span><span class="mu">›</span></button>';
    return wrap(
        'Settings',
        bodyOf(
            '<div class="setlab" style="margin-top:6px">Preferences</div><div class="card"><label class="lb" style="margin:0 2px 7px">Weight unit</label><div class="seg"><button class="' +
                (S.unit === 'kg' ? 'on' : '') +
                '" data-a="unit" data-v="kg">kg</button><button class="' +
                (S.unit === 'lb' ? 'on' : '') +
                '" data-a="unit" data-v="lb">lb</button></div>' +
                '<label class="lb" style="margin:14px 2px 7px">Appearance</label><div class="seg">' +
                ['auto', 'light', 'dark']
                    .map(
                        (t) =>
                            '<button class="' +
                            (S.theme === t ? 'on' : '') +
                            '" data-a="theme" data-v="' +
                            t +
                            '">' +
                            t[0].toUpperCase() +
                            t.slice(1) +
                            '</button>'
                    )
                    .join('') +
                '</div></div>' +
                '<div class="setlab">Your data</div><div class="card"><p class="mu sm-t" style="margin:0 0 10px">Everything is stored on this device only. Copy the backup text somewhere safe, or paste a backup here and restore it.</p><textarea class="inp" id="bk" spellcheck="false" placeholder="Backup text appears here"></textarea>' +
                '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><button class="btn sm" data-a="bkshow">Show backup</button><button class="btn sm" data-a="bkcopy">Copy</button><button class="btn sm" data-a="bkrestore">Restore from text</button></div></div>' +
                '<div class="setlab">About</div><div class="card lst">' +
                lr('about', 'About Lift') +
                lr('help', 'Help & FAQ') +
                lr('privacy', 'Privacy Policy') +
                lr('terms', 'Terms of Use') +
                lr('credits', 'Credits') +
                '</div>' +
                '<div class="aboutf">' +
                LOGO(44) +
                '<div><b>Lift</b><div class="mu sm-t">Version ' +
                APPV +
                ' · Works offline</div></div></div>' +
                '<button class="btn dg blk" data-a="erase">Erase all data</button>'
        )
    );
};

SHEETS.doc = function (s) {
    const D = DOCS[s.k];
    return wrap(D.t, bodyOf('<div class="doc">' + D.h() + '</div>'));
};
