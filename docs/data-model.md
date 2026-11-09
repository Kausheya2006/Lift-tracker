# Data model

All user data is one JSON document stored in `localStorage` under the key `lift.v1`. The same document, serialised as text, is what the Settings backup produces and restores.

## Top-level object

| Field | Type | Description |
| --- | --- | --- |
| `v` | number | Schema version, currently `1`. Data with any other value is ignored on load |
| `custom` | array | User-created exercises |
| `groups` | array | Workout groups |
| `routines` | array | Training plans |
| `active` | string or null | `id` of the routine used to suggest today's workout |
| `logs` | object | Training days keyed by local date `YYYY-MM-DD` |
| `unit` | `"kg"` or `"lb"` | Display unit. Stored numbers are not converted when it changes |
| `theme` | `"auto"`, `"light"` or `"dark"` | Appearance |
| `splitPref` | object | Map of exercise id to boolean: track left and right separately |

On load, a stored document is merged over the defaults (`Object.assign(fresh(), stored)`), so fields added in later versions get default values for existing users.

## Entities

### Custom exercise

```json
{ "id": "c1k3f9a2b", "name": "Cable Pullover", "m": "Back", "e": "C" }
```

`m` is a muscle name from `MUSCLES`; `e` is an equipment key from `EQ`. Custom exercises have no photo index and use a generated illustration.

### Workout group

```json
{
  "id": "g1k3f9a2b",
  "name": "Chest + Triceps",
  "items": [
    { "ex": "e0", "wu": 1, "sets": 4, "reps": "8" }
  ]
}
```

`ex` is an exercise id, `wu` the number of warm-up sets, `sets` the number of working sets, and `reps` a string (the leading integer is used when sets are generated).

### Routine

```json
{
  "id": "r1k3f9a2b",
  "name": "4-day split",
  "mode": "cycle",
  "days": [["g1"], ["g2"], ["g3"], ["g4"], []],
  "tr": 4,
  "rs": 1,
  "start": "2026-11-09"
}
```

| Field | Meaning |
| --- | --- |
| `mode` | `"week"` or `"cycle"`. A missing value is treated as `"week"` |
| `days` | One array of group ids per day. An empty array is a rest day. `week` routines have 7 entries, Monday first. `cycle` routines have `tr + rs` entries |
| `tr`, `rs` | Training and rest day counts (cycle only; used by the editor) |
| `start` | Calendar date on which `days[0]` falls (cycle only) |

Resolution of a date to a day (`slotFor` in `core/routines.js`):

- Week: index is the Monday-based weekday of the date.
- Cycle: `k = ((daysBetween(start, date) mod n) + n) mod n`, where `n = days.length`. Days before `start` resolve correctly because of the double modulo.

### Log (one training day)

```json
{
  "groups": ["g1"],
  "entries": [
    {
      "ex": "e0",
      "sets": [
        { "wu": 1, "w": 27.5, "r": 8, "d": 1 },
        { "w": 65, "r": 8, "d": 1 }
      ]
    }
  ]
}
```

A rest day is `{ "rest": true, "groups": [], "entries": [] }`.

| Entry field | Meaning |
| --- | --- |
| `ex` | Exercise id |
| `split` | `true` when left and right are tracked separately |
| `sets` | Ordered list of sets |

| Set field | Meaning |
| --- | --- |
| `w`, `r` | Weight and reps. Stored as numbers or numeric strings (they come from text inputs); always read through `num()` |
| `d` | `1` when the set is marked done. Only done sets count towards PRs, volume and charts |
| `wu` | `1` for a warm-up set. Warm-ups never count towards PRs or volume |
| `side` | `"L"` or `"R"`. Present only when the entry has `split: true`. Sets of one side are kept contiguous |

## Derived values

None of these are stored; they are recomputed from `logs`.

| Value | Definition | Source |
| --- | --- | --- |
| Volume of a day | Sum of `w * r` over done, non-warm-up sets | `vol` in `core/stats.js` |
| Estimated 1RM of a set | `w * (1 + r / 30)` (Epley formula) | `sessions` |
| Session (per exercise and day) | Top set (highest `w`, ties broken by `r`), set count, volume, best estimated 1RM, PR flag | `sessions` |
| Personal record | Best done, non-warm-up set by weight, ties broken by reps | `stats` |
| New PR flag on a set | A done, non-warm-up set whose weight is strictly greater than every earlier such set in the same bucket. The first ever set only establishes the baseline and is not flagged | `stats` |
| PR bucket | Sets with `side` are compared only with sets of the same side. Sets without `side` form their own bucket | `stats` |
| Last performance | Best done set of the most recent earlier day that has any, preferring the same side when a side is given | `lastPerf` |
| Muscle balance | Count of done working sets per muscle over the last 30 days | `muscleSets` |
| Weekly volume | Volume summed per Monday-based week | `volWeeks` |

The overall PR shown for an exercise is the best set across all buckets.

## Dates

Dates are local calendar dates in `YYYY-MM-DD` form, produced by `ds()` and parsed by `pd()` without time zones. Weekdays are Monday-based (`wdi`).

## Backup and restore

- **Backup:** Settings, Show backup, serialises `S` with `JSON.stringify`.
- **Restore:** Settings, Restore from text, parses the pasted text and accepts it only if it is an object with `v === 1` and an object `logs`. After confirmation it replaces the entire document. No field-level validation is performed.

## Compatibility rules

- Never change the meaning of an existing field. Add new optional fields and give them defaults in `fresh()`.
- Exercise ids are permanent references from `groups` and `logs`. See [exercise-library.md](exercise-library.md).
- Increment `v` only for an incompatible change, and add a migration in `load()` at the same time.
