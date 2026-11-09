# Version history

Lift follows [semantic versioning](https://semver.org/). Entries are listed newest first. Each release records the git commit it corresponds to.

Two numbers identify an Android build:

- `versionName`, for example `1.4.1`, shown to users. It must match `APPV` in `app/src/main/assets/js/core/util.js`.
- `versionCode`, an integer in `app/build.gradle` that must increase with every distributed APK.

The stored data format has its own version, the `v` field of the saved document (currently `1`). It is independent of the application version and changes only for incompatible data changes. See [data-model.md](data-model.md#compatibility-rules).

## Summary

| Version | Date | Commit | Summary |
| --- | --- | --- | --- |
| 1.5.0 | Unreleased | not yet committed | Left and right tracking, README, MIT license, technical documentation |
| 1.4.2 | 2026-11-10 | `2254088` | Exercise list additions and renames |
| 1.4.1 | 2026-11-10 | `d06eb25` | Real exercise photos, modular `assets/` layout |
| 1.3.0 | 2026-11-09 | `ea2ff40` | Initial release |

## How to add an entry

1. Add a section directly under this paragraph, above the previous version, with the heading `## x.y.z - YYYY-MM-DD`.
2. Group changes under **Added**, **Changed**, **Fixed** and **Removed**. Omit empty groups.
3. State the commit hash after the release is committed, and add a row to the summary table.
4. Record any change to the stored data format or to exercise identifiers explicitly, because they affect existing users.

Use the `Unreleased` heading for work in progress and rename it when releasing.

---

## 1.5.0 - Unreleased

Commit: not yet committed.

### Added

- Left and right tracking per exercise. A switch on every exercise card splits the sets into separate Left and Right lists. Each side has its own weights, reps, warm-ups, set count, PR and previous-session values. The choice is remembered per exercise (`splitPref`), so the exercise starts split the next time it is added.
- Per-side PR detection: a new left-side PR does not depend on right-side history.
- `README.md` with project overview, stack badges and screenshots.
- `LICENSE` (MIT).
- Technical documentation in `docs/`: architecture, data model, exercise library, development guide, build and release, security and privacy, and this version history.

### Changed

- `stats`, `lastPerf` and `mkSets` in `core/stats.js` accept a side. Log entries gain an optional `split` flag and sets gain an optional `side` field. Existing logs are unchanged and behave as before.
- Progress charts use the heavier side of a split exercise for each session. Volume and set counts include both sides.

### Data format

Saved data version `v` is unchanged. New optional fields: `splitPref` (top level), `split` (log entry), `side` (set). They default to absent or empty for existing data.

---

## 1.4.2 - 2026-11-10

Commit: `2254088` "Added/modified exercises in exercises.js".

### Added

- Exercise `Overhead Triceps Extension - Cable Straight Bar` (`x3`), which reuses the photo and instructions of the rope version.

### Changed

- `Standing Low-Pulley Deltoid Raise` (`f565`) renamed to `Cable Lateral Raise (Standing, One Arm)`.

### Data format

Exercise identifiers are unchanged. `x3` is a new identifier.

---

## 1.4.1 - 2026-11-10

Commit: `d06eb25` "Added real photos inplace of logos + modularised assets/".

### Added

- Real exercise photos (two frames per exercise, start and end position) for 637 exercises, stored as WebP files in `assets/img/`.
- Exercise detail screen with both photos and step-by-step instructions, opened from the information button in the picker or the photo in a logged exercise.
- Search aliases (for example "lat prayer", "pec deck", "forearm machine") and a two-column picker that shows full exercise names.
- Forearm machine entries (`x1`, `x2`), bringing the library to 640 entries.

### Changed

- `assets/` split from a single HTML file into `css/`, `js/` and `img/`, with scripts organised into `data`, `core`, `ui` and `actions`. Behaviour is unchanged.
- Generated pose illustrations are kept only as a fallback for exercises without a photo.
- Exercise names made explicit about the variant or attachment: Pec Deck Fly, Low Cable Fly, Chest-Supported T-Bar Row, Straight-Arm Lat Pulldown (bar and rope), Triceps Pushdown (straight bar, rope, V-bar, reverse grip) and Overhead Triceps Extension (cable rope, barbell, dumbbell).

### Fixed

- The group editor displayed a generated figure instead of the exercise photo.

### Data format

Exercise identifiers are unchanged. `x1` and `x2` are new identifiers.

---

## 1.3.0 - 2026-11-09

Commit: `ea2ff40` "Initial commit: Lift workout tracker (Android WebView app)". Android `versionCode` 1.

### Added

- Android WebView host application with a Gradle project, release signing through `keystore.properties`, and an adaptive launcher icon.
- Workout groups with warm-up sets, working sets and target reps.
- Weekly routines and rotating splits (training and rest days with a configurable cycle).
- Daily logging with prefill from the last session, warm-up sets, personal records and a history of days.
- Progress tab with weekly volume, workouts per week, muscle balance and per-lift charts.
- Settings: kilograms or pounds, light, dark or automatic theme, text backup and restore, erase all data.
- About, Help, Privacy Policy, Terms of Use and Credits screens.
- Exercise library of 638 entries (637 imported from the Free Exercise DB plus Mountain Climber) with generated pose illustrations. The identifiers `e0` to `e88` of the original curated list were preserved and re-pointed at the matching imported exercises so earlier saved data stayed valid.
