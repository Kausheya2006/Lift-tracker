# Security and privacy

## Summary

Lift runs entirely on the device. It declares no Android permissions, does not request network access, and sends nothing to any server.

## Permissions and network

`AndroidManifest.xml` contains no `<uses-permission>` entries. In particular the `INTERNET` permission is absent, so the application cannot open network connections. `android:usesCleartextTraffic` is set to `false`.

All code, images and data files are loaded from the application package (`file:///android_asset/`). No script, font or image is fetched from a remote origin.

## Data handling

| Data | Location | Notes |
| --- | --- | --- |
| Workouts, routines, logs, custom exercises, settings | WebView `localStorage` in the app's private storage | Single document `lift.v1`, see [data-model.md](data-model.md) |
| Backups | Created only when the user taps Show backup and copies the text | Contains the full document in plain text. Treat it as personal data |
| Exercise library, photos | Read-only application assets | Public domain content |

Deleting data: Settings, Erase all data clears the document. Uninstalling the app or clearing its storage in Android settings also removes it.

`android:allowBackup` is `true` in the manifest, so Android's automatic backup may include the app's private data on supported devices. Set it to `false` in `AndroidManifest.xml` to opt out.

## WebView configuration

Set in `MainActivity.onCreate`:

| Setting | Value | Reason |
| --- | --- | --- |
| JavaScript | enabled | The application is JavaScript |
| DOM storage | enabled | Required for `localStorage` |
| File access | enabled | Required to load `file:///android_asset/` pages and assets |
| Content access | disabled | The app does not use content providers |
| Zoom and zoom controls | disabled | Fixed mobile layout |

Not enabled: file access from file URLs, universal access from file URLs, JavaScript interfaces (`addJavascriptInterface`), and remote debugging.

Navigation: `LiftClient` allows `file:` URLs inside the WebView and passes every other URL to the system with `ACTION_VIEW`. The application currently contains no external links.

## Input handling

User-provided strings (exercise names, group and routine names, routine and group content) are inserted into pages as HTML strings. Every such value passes through `esc()`, which escapes `&`, `<`, `>` and `"`. New code that interpolates user text into HTML must do the same.

Restoring a backup replaces stored data after a structural check only (`v === 1` and an object `logs`). Free-text values are escaped on output, but identifiers that are placed in `data-*` attributes (group, routine and exercise ids) are not. A hand-crafted backup could therefore inject markup. The WebView exposes no JavaScript interface and the application has no network access, so the effect is limited to the application's own data. Only restore backups that you created yourself.

## Third-party content

The application bundles no third-party libraries. The exercise photos and text come from the Free Exercise DB (Unlicense).
