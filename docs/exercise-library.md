# Exercise library

## Source

Exercise names, primary muscles, equipment, photos and instructions are derived from the [Free Exercise DB](https://github.com/yuhonas/free-exercise-db) by yuhonas (Unlicense, public domain). The data was filtered and normalised for Lift:

- Excluded categories: stretching, cardio and plyometrics.
- Excluded individual entries that are sprint or agility drills, strongman implements that are not practical in a gym, and similar items.
- Primary muscle mapped to the 13 groups in `MUSCLES`: Chest, Back, Shoulders, Traps, Biceps, Triceps, Forearms, Abs, Quads, Hamstrings, Glutes, Calves, Hips. Lats, middle back and lower back map to Back; abductors and adductors map to Hips; neck maps to Shoulders.
- Equipment mapped to the keys in `EQ` (see below). Names containing "Smith" map to Smith machine.
- Selected entries were renamed to make attachment or variant explicit (for example `Triceps Pushdown - Straight Bar`, `Pec Deck Fly`).

The result is 637 imported exercises plus 4 project additions.

## Files

| File | Content |
| --- | --- |
| `js/data/exercises.js` | `MUSCLES`, `MALIAS` (muscle search words), `EQ` (equipment labels) and the `LIB` array |
| `js/data/instructions.js` | `INS`: an array of instruction step lists, indexed by photo index |
| `img/NNN-0.webp`, `img/NNN-1.webp` | Start and end photo for photo index `NNN`, zero-padded to three digits |

## `LIB` rows

```js
[id, name, muscleIndex, equipmentKey, photoIndex]
```

| Field | Description |
| --- | --- |
| `id` | Stable identifier, see below |
| `name` | Display name |
| `muscleIndex` | Index into `MUSCLES` |
| `equipmentKey` | Key of `EQ` |
| `photoIndex` | Number `N` for `img/N-0.webp` and `img/N-1.webp`, and for `INS[N]`. `-1` means no photo |

Equipment keys:

| Key | Label | Key | Label |
| --- | --- | --- | --- |
| `B` | Barbell | `K` | Kettlebell |
| `D` | Dumbbell | `R` | Bands |
| `M` | Machine | `W` | Bodyweight |
| `C` | Cable | `Z` | EZ-bar |
| `S` | Smith machine | `O` | Other |

`core/library.js` turns each row into an object `{ id, name, m, e, i }` and builds the lookup table `EXI` by id.

## Identifiers

Identifiers are referenced from saved groups and logs and must never be changed or reused.

| Prefix | Meaning |
| --- | --- |
| `e<n>` | Entries from the original curated list (`e0` to `e88`). Each was re-pointed at the matching imported exercise so that data saved before the imported library existed stays valid |
| `f<n>` | Imported exercises, where `n` is the position in the sorted import list. It equals the photo index |
| `x<n>` | Additions made by this project |
| `c<...>` | User-created exercises. These live in saved data, not in `LIB` |

Renaming an exercise (changing `name`) is safe. Removing a row is not, because saved logs would lose their reference.

Several rows may share a photo index when a variant has no photo of its own (for example an attachment change). The row `x3`, `Overhead Triceps Extension - Cable Straight Bar`, reuses the photo and instructions of the rope version.

## Photos

Each photo index has two frames showing the start and end position. Both were produced from the source images with:

```python
from PIL import Image
im = Image.open(src).convert("RGB")
im.thumbnail((256, 256))
im.save(dst, "WEBP", quality=55, method=6)
```

The result is about 4 KB per frame, 5.4 MB for the full set.

To add a photo for a new exercise:

1. Prepare two frames as above.
2. Name them with the next unused index: `img/638-0.webp` and `img/638-1.webp`.
3. Add the instruction steps as the element at that index in `INS` (`js/data/instructions.js`). `INS` must stay aligned with photo indices.
4. Add a `LIB` row whose last value is `638`.

## Adding an exercise without a photo

Append a row with photo index `-1` and a new `x<n>` id:

```js
['x4', 'Forearm Machine - Reverse Wrist Curl', 6, 'M', -1],
```

The exercise appears in the picker and logs with a generated illustration.

## Search

The picker and the Progress tab share one matcher (`core/library.js`):

1. The query is lower-cased, normalised (`flyes`, `flies` become `fly`; `push down` becomes `pushdown`; `t-bar` becomes `tbar`), split into words and stemmed by dropping a trailing `s` from words longer than three letters.
2. Each exercise has a search text built from its name, muscle, muscle aliases (`MALIAS`), equipment label and any matching entries in `ALIAS` (regular expression to extra words), processed the same way.
3. An exercise matches when every query word is a prefix of some word in its search text. Word order does not matter.
4. Muscle and equipment filter chips are applied on top. Results are paginated 60 at a time.

To make an exercise findable by a name that does not appear in its own name, add an entry to `ALIAS`, for example `[/straight-arm.*pulldown/i, 'lat prayer wings']`.

## Generated illustrations

`ui/illustrations.js` draws a stick figure for exercises with photo index `-1`:

- `poseKey(exercise)` maps the name, muscle and equipment to one of 46 movement patterns (44 side-view patterns in `POSE` and 2 front-view patterns in `FRONT`) using ordered regular expressions, falling back to a pattern per muscle group.
- `POSE` holds joint angles for each pattern. `figure()` computes joint positions, adds furniture (bench, seat, bar) and the implement for the equipment type, highlights the working muscle in the accent colour, and fits the result to the viewBox.
- Lateral raise and hip abduction use a front-view variant (`frontFig`).

Add a new pattern by adding an entry to `POSE` and a matching rule in `poseKey`.
