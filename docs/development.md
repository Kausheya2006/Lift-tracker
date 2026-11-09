# Development

## Environment

| Task | Requirement |
| --- | --- |
| Edit and test the web app | A text editor and any current desktop browser |
| Run on Android | Android Studio with JDK 17 or newer, Android SDK Platform 34 |
| Format code | Node.js with `npx prettier` |

The web app is under `app/src/main/assets/`. Open `index.html` directly in a browser to run it. Data is stored in that browser's local storage and is separate from the data inside the Android app.

## Conventions

- Plain JavaScript, `'use strict'` at the top of each file, no modules (see [architecture.md](architecture.md#script-loading-and-shared-scope)).
- Declarations are global. Pick names that do not collide with browser globals. A top-level `const top` throws a `SyntaxError` because `window.top` cannot be redeclared; avoid other browser globals such as `name`, `status`, `length` and `event` as well, since they behave confusingly.
- Views and sheets return HTML strings. Escape every piece of user-provided text with `esc()`.
- Wire behaviour through attributes: `data-a="name"` on clickable elements, `data-f="name"` on inputs. Handlers live in `js/actions/` and `js/ui/inputs.js`.
- Persist only through the `S` object and `save()`. Keep transient state in `ui`.
- Formatting is Prettier with `.prettierrc.json` and `.editorconfig` (4 spaces, single quotes, 100 columns). Run `npx prettier --write "app/src/main/assets/{css,js}/**/*"` before committing. `js/data/instructions.js` is excluded in `.prettierignore`.
- One CSS file per screen or concern. New files must be added to `index.html`; later files override earlier ones at equal specificity, so `thumbs.css` is intentionally last.

## Recipes

### Add or rename an exercise

Edit `js/data/exercises.js`. See [exercise-library.md](exercise-library.md).

### Change a colour

Edit the custom properties in `css/tokens.css`. Update all three blocks (light, automatic dark, forced dark).

### Add an action

1. Add `data-a="myAction"` to the element in the relevant view.
2. Add the handler to the matching file in `js/actions/`:

```js
Object.assign(A, {
    myAction: (el) => {
        // read parameters from el.dataset
        save();
        render();
    },
});
```

### Add a sheet (full-screen panel)

1. Create `js/ui/sheets/mysheet.js` that registers a renderer:

```js
'use strict';
SHEETS.mysheet = function (s) {
    return wrap('Title', bodyOf('<p>Content</p>'), '<button class="btn pri" data-a="close">Done</button>');
};
```

2. Add the `<script>` tag after the other sheet scripts in `index.html`.
3. Open it from an action with `ui.stack.push({ type: 'mysheet' }); render();`.

### Add a tab

1. Create a view function in `js/ui/views/` that returns HTML, starting with `head('Title')`.
2. In `ui/render.js`, add it to the view map and to the tab list.
3. Add the stylesheet and script tags to `index.html`.

### Add a setting

Add a default to `fresh()` in `core/state.js`, show the control in `ui/sheets/settings.js`, and add the handler in `actions/settings.js`. Existing users receive the default automatically because stored data is merged over `fresh()`.

### Change the stored data format

Follow the compatibility rules in [data-model.md](data-model.md#compatibility-rules).

## Debugging

- In a desktop browser, use the developer tools console. All top-level names (`S`, `ui`, `lastPerf`, and so on) are accessible from the console.
- To inspect the WebView on a device, `MainActivity` must call `WebView.setWebContentsDebuggingEnabled(true)`. It does not do so by default. Enable it only in debug builds, then attach through `chrome://inspect`.

## Manual test checklist

The project has no automated test suite. Before a release, check:

1. First launch with empty data: Today offers workout groups or an empty workout; Settings opens.
2. Create a workout group through the picker, using search and a filter chip. Reorder and remove an exercise. Save.
3. Create a weekly routine and a rotating routine (for example 4 training plus 1 rest). Confirm that the active routine's Today suggestion is correct for several consecutive days, including the rest day.
4. Start a workout from the routine. Edit a weight, mark sets done, add and remove a set and a warm-up. A weight above the previous best produces a PR marker.
5. Switch an exercise to left and right tracking, enter different weights per side, and confirm each side has its own PR and previous-session values on the next day.
6. Open an exercise detail from the picker and from a logged exercise; both photos and steps appear.
7. Progress and History tabs render with and without data. Per-lift chart switches between top weight, estimated 1RM and volume.
8. Settings: unit, theme (auto, light, dark), backup text, restore from the same text, erase all data.
9. Android: back button closes dialogs and sheets before leaving the app; rotating the device keeps state; light and dark system themes both display correctly.
10. Open the app with the keyboard shown in a set row; the row stays visible.
