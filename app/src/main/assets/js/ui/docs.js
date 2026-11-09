'use strict';
// About, Help, Privacy, Terms and Credits text.

const DOCS = {
    about: {
        t: 'About Lift',
        h: () =>
            '<div class="lg">' +
            LOGO(84) +
            '<b>Lift</b><div class="mu">Version ' +
            APPV +
            '</div></div><p style="margin-top:18px">Lift is a minimal workout tracker. Build exercise groups, plan a weekly or rotating split, log every set and watch your personal records and progress grow.</p><p>It runs entirely in your browser. There is no account, no sign-in and no server that receives your workouts.</p><h3>What you can do</h3><ul><li>Create your own workout groups like Back, Legs or Chest + Triceps</li><li>Plan weekly routines or rotating splits such as 4 training days and 1 rest day</li><li>Log sets, reps and weight with warm-ups, and see your last session and PR</li><li>Track progress with charts per exercise, weekly volume and muscle balance</li></ul>',
    },
    help: {
        t: 'Help & FAQ',
        h: () =>
            '<details><summary>How do I build a workout?</summary><p>Open Workouts, tap New workout group, pick exercises and set warm-up sets, working sets and reps. Mix any muscles you like.</p></details><details><summary>How do I set up a 4-day split with a rest day?</summary><p>Open Routine, tap New routine, choose Rotating, then set 4 training days and 1 rest day. Tap each day to choose its groups, and tell Lift which day of the cycle today is.</p></details><details><summary>How do routines pick today’s workout?</summary><p>Weekly routines follow Monday to Sunday. Rotating routines advance one day at a time by calendar date, so a rest day stays a rest day.</p></details><details><summary>How are PRs counted?</summary><p>A PR is a completed, non-warm-up set with more weight than any earlier set of that exercise. Your first ever set is the baseline and isn’t counted. Sets only count once you tick them done.</p></details><details><summary>Can I log a past day?</summary><p>Yes. On Today, use the arrows to move to another date, or tap a day in History.</p></details><details><summary>Does it work offline?</summary><p>Yes. Everything, including the exercise photos, is stored inside the app. After it has loaded, no internet connection is needed.</p></details><details><summary>How do I back up or move my data?</summary><p>In Settings, tap Show backup, copy the text and keep it somewhere safe. To restore, paste it into the same box and tap Restore from text.</p></details>',
    },
    privacy: {
        t: 'Privacy Policy',
        h: () =>
            '<p class="mu">Last updated: November 2026</p><h3>Summary</h3><p>Lift does not collect, sell or share your personal information. Your workout data stays on your device.</p><h3>What Lift stores</h3><p>Your workout groups, routines, training logs, custom exercises and settings are saved in your browser’s local storage on this device. Lift has no account system and no server that receives this data.</p><h3>What Lift does not do</h3><ul><li>No analytics, advertising or tracking scripts</li><li>No third-party services or network requests for your data</li><li>No access to your camera, microphone, contacts or location</li></ul><h3>Hosting</h3><p>The page itself is delivered by its host, which may keep standard web server logs under its own policies. Those logs do not include your workout data, because that never leaves your device.</p><h3>Backups and sharing</h3><p>Data leaves your device only if you copy a backup yourself and paste it somewhere.</p><h3>Deleting your data</h3><p>Use Erase all data in Settings, or clear this site’s data in your browser. Because nothing is stored elsewhere, that removes everything.</p><h3>Health information</h3><p>Weights, reps and body-training notes you log are your own information. Keep your backups private if you consider them sensitive.</p><h3>Changes</h3><p>If this policy changes, the updated version will appear here with a new date.</p>',
    },
    terms: {
        t: 'Terms of Use',
        h: () =>
            '<p class="mu">Last updated: November 2026</p><h3>Use at your own risk</h3><p>Lift is a logging tool, not medical or coaching advice. Exercise carries a risk of injury. Check with a doctor before starting a new training program, and stop if something hurts.</p><h3>No warranty</h3><p>Lift is provided as is, without guarantees of accuracy or availability. Your data lives in your browser and can be lost if you clear site data or switch devices, so back it up from Settings.</p><h3>Your content</h3><p>Your logs and custom exercises belong to you.</p><h3>Acceptable use</h3><p>Use Lift for personal training tracking. Don’t try to disrupt or misuse the page.</p>',
    },
    credits: {
        t: 'Credits',
        h: () =>
            '<h3>Exercise photos and instructions</h3><p>Exercise photos, names, muscle groups, equipment and how-to steps come from the Free Exercise DB by yuhonas, released into the public domain under the Unlicense. Thank you to everyone who contributed to it.</p><h3>Design</h3><p>Where an exercise has no photo, Lift draws an illustration. The logo, icons and interface were designed for Lift, which uses your device’s system fonts.</p>',
    },
};
