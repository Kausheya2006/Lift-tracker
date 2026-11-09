# Architecture

## Overview

Lift has two layers:

1. **Android host.** A single `Activity` that creates a `WebView` and loads `file:///android_asset/index.html`. It contains no application logic.
2. **Web application.** Plain HTML, CSS and JavaScript stored in `app/src/main/assets`. All features live here.

There is no backend, no bundler and no framework. Files in `assets/` are shipped to the device unchanged.

```
+------------------------------------------------------+
| Android process                                      |
|  MainActivity --> WebView --> file:///android_asset/ |
|                                  index.html          |
|                                    css/*.css         |
|                                    js/**/*.js        |
|                                    img/*.webp        |
|  localStorage ("lift.v1")  <--  state object S       |
+------------------------------------------------------+
```

## Android host

Source: `app/src/main/java/com/lift/tracker/`.

| File | Responsibility |
| --- | --- |
| `MainActivity.java` | Configures and hosts the `WebView`; saves and restores WebView state across configuration changes; maps the system back button to the web app |
| `LiftClient.java` | `WebViewClient` that keeps `file:` navigation inside the app and sends every other URL to the system via `ACTION_VIEW` |
| `BackCb.java` | `ValueCallback` used by the back button: finishes the activity when the web app reports it has nothing to close |

Back button behaviour: `MainActivity.onBackPressed` evaluates a short script that clicks the confirm dialog's cancel button if one is open, otherwise the top sheet's close button. The script returns `1` if it closed something and `0` otherwise; on `0` the activity finishes.

`configChanges` in the manifest covers orientation, screen size, keyboard and UI mode, so the activity is not recreated on rotation or when dark mode changes.

Theming of the system bars is handled by resource qualifiers: `values/` (light), `values-v27/` (light navigation bar icons) and `values-night/` (dark). The launcher icon is an adaptive icon with a legacy PNG fallback.

## Web application

### Directory layout

```
assets/
├── index.html          Stylesheet and script tags only
├── css/                13 stylesheets
├── img/                1274 WebP files
└── js/
    ├── data/           exercises.js, instructions.js
    ├── core/           util, library, state, stats, routines, workout, seed
    ├── ui/             illustrations, images, icons, charts, components, docs, render, inputs
    │   ├── views/      today, workouts, routines, history, progress
    │   └── sheets/     picker, group, routine, exercise, settings
    ├── actions/        actions, log, picker, progress, groups, routines, settings
    └── main.js
```

### Script loading and shared scope

Scripts are classic scripts, not ES modules. ES modules cannot be loaded from `file://` URLs in an Android `WebView` because of the opaque origin, so every file shares the global lexical scope and the load order in `index.html` is significant.

Order, with the reason for each position:

| Group | Files | Why here |
| --- | --- | --- |
| Data | `data/exercises.js`, `data/instructions.js` | Declare `LIB`, `MUSCLES`, `EQ`, `INS` used by everything below |
| Core | `core/library.js`, `util.js`, `state.js`, `stats.js`, `routines.js`, `workout.js`, `seed.js` | Build the library index, helpers, saved state (`S`) and domain logic |
| UI foundations | `ui/illustrations.js`, `images.js`, `icons.js`, `charts.js`, `components.js`, `docs.js` | Pure functions that return HTML or SVG strings; `components.js` creates the `SHEETS` registry |
| Views | `ui/views/*.js` | One render function per tab |
| Sheets | `ui/sheets/*.js` | Each file registers entries in `SHEETS` |
| Rendering | `ui/render.js`, `ui/inputs.js` | Render loop and input handlers |
| Actions | `actions/actions.js` first, then the rest | `actions.js` declares `A`; the others extend it with `Object.assign` |
| Start | `main.js` | Click listener, theme, first render |

Top-level `const` and `let` declarations in classic scripts are visible to later scripts. Function declarations become properties of `window`.

Naming constraint: a top-level `const` or `let` must not share a name with a non-configurable `window` property. `top` is one such name, which is why the sheet stack accessor is called `topSheet`.

### State

A single object `S` holds all persisted data (see [data-model.md](data-model.md)). `save()` writes it to `localStorage` under `lift.v1`. A second object, `ui`, holds transient state that is never persisted: current tab, selected date, the stack of open sheets, search text, chart selections and the pending confirm dialog.

### Rendering model

Rendering is a full redraw:

1. `render()` in `ui/render.js` chooses the view function for `ui.tab`, writes its HTML string into `#app`, rewrites the tab bar, and rewrites `#sheets` by mapping every entry of `ui.stack` through `sheetHTML`.
2. Before replacing the DOM it records scroll positions of open sheets and of the picker's chip rows, and restores them afterwards. Setting `ui.reset = 1` skips restoration (used when filters change).
3. Views build HTML by string concatenation. All user-provided text passes through `esc()`.

Consequences:

- Anything typed into an input must be written to state on the `input` event. It cannot depend on a later re-render, which would destroy the focused element. Handlers are in `ui/inputs.js` and keyed by the input's `data-f` attribute.
- Actions that change state call `save()` and then `render()`.
- The picker search box only re-renders its result list (`pkRefresh`) so the field keeps focus while typing.

### Event handling

`main.js` registers one `click` listener on `document`. It finds the nearest ancestor with a `data-a` attribute and calls `A[name](element, event)`. Parameters travel as other `data-*` attributes (for example `data-e` for entry index, `data-s` for set index, `data-side` for left or right).

Because lookup uses the nearest `data-a` element, a nested control wins over its parent. The information button on picker cards relies on this.

### Sheets

Full-screen panels (picker, editors, details, settings) are entries in `ui.stack`, each an object with a `type`. `SHEETS[type](entry)` returns its HTML. Opening a sheet pushes onto the stack; closing pops. Sheets that edit data work on a copy (`draft`) and write to `S` only on save.

| Type | File |
| --- | --- |
| `picker`, `newex` | `ui/sheets/picker.js` |
| `group`, `gpick` | `ui/sheets/group.js` |
| `routine` | `ui/sheets/routine.js` |
| `exview`, `prog` | `ui/sheets/exercise.js` |
| `settings`, `doc` | `ui/sheets/settings.js` |

### Theming

Colours are CSS custom properties defined in `css/tokens.css`. Three blocks exist: the light defaults, a dark block inside `@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme="light"])`, and an explicit `:root[data-theme="dark"]`. The Settings theme control sets or removes `data-theme` on `<html>` (`applyTheme` in `core/state.js`).

### Exercise imagery

Exercises with a photo index render `img/NNN-0.webp` (start) and `img/NNN-1.webp` (end). Exercises without one, including user-created exercises, render a generated SVG figure from `ui/illustrations.js`, chosen by matching the exercise name against a table of movement patterns. See [exercise-library.md](exercise-library.md).

## Design decisions and trade-offs

| Decision | Reason | Cost |
| --- | --- | --- |
| WebView plus web app instead of native views | Fast iteration, single UI codebase, easy to test in a browser | Less native feel; performance depends on the system WebView |
| No framework or bundler | Nothing to install or build for UI work; files are the shipped artifact | Manual HTML templating; shared global scope requires discipline |
| Full re-render on every change | Simple and predictable at this data size | Not suitable for very large lists without virtualisation; the picker paginates for this reason |
| Single JSON document in `localStorage` | Atomic read and write, trivial backup | Whole document is rewritten on every save; size is bounded by the WebView storage quota |
| Photos bundled as files | No network, fast load | About 6 MB of assets |
