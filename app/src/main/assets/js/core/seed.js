'use strict';
// Example workout groups and routine.

function seed() {
    const mk = (name, list) => ({
        id: uid('g'),
        name,
        items: list.map(([ex, wu, sets, reps]) => ({ ex, wu, sets, reps })),
    });
    const G = [
        mk('Chest', [
            ['e0', 1, 4, '8'],
            ['e4', 0, 3, '10'],
            ['e6', 0, 3, '12'],
        ]),
        mk('Back', [
            ['e16', 0, 3, '8'],
            ['e12', 1, 4, '8'],
            ['e18', 0, 3, '10'],
            ['e19', 0, 3, '12'],
        ]),
        mk('Shoulders', [
            ['e23', 1, 4, '8'],
            ['e28', 0, 4, '15'],
            ['e30', 0, 3, '15'],
        ]),
        mk('Biceps', [
            ['e35', 1, 3, '10'],
            ['e39', 0, 3, '12'],
            ['e40', 0, 3, '12'],
        ]),
        mk('Triceps', [
            ['e44', 1, 3, '8'],
            ['e49', 0, 3, '12'],
            ['e46', 0, 3, '12'],
        ]),
        mk('Legs', [
            ['e57', 2, 4, '6'],
            ['e66', 1, 3, '8'],
            ['e63', 0, 3, '12'],
            ['e69', 0, 3, '12'],
            ['e77', 0, 4, '15'],
        ]),
    ];
    S.groups.push(...G);
    const id = (n) => G.find((g) => g.name === n).id;
    const r = {
        id: uid('r'),
        name: 'Example split',
        mode: 'week',
        days: [
            [id('Chest'), id('Triceps')],
            [id('Back'), id('Biceps')],
            [],
            [id('Shoulders')],
            [id('Legs')],
            [],
            [],
        ],
    };
    S.routines.push(r);
    if (!S.active) S.active = r.id;
    save();
    render();
    toast('Examples added');
}
