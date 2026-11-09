'use strict';

// Workout groups
Object.assign(A, {
    newg: () => {
        ui.stack.push({ type: 'group', d: { name: '', items: [] } });
        render();
    },
    editg: (t) => {
        const g = gget(t.dataset.id);
        ui.stack.push({ type: 'group', d: JSON.parse(JSON.stringify(g)) });
        render();
    },
    gaddex: () => {
        const d = topSheet().d;
        openPicker(
            d.items.map((i) => i.ex),
            (ids) => {
                const old = new Map(d.items.map((i) => [i.ex, i]));
                d.items = ids.map((id) => old.get(id) || { ex: id, wu: 1, sets: 3, reps: '10' });
            },
            true
        );
    },
    gup: (t) => {
        const i = +t.dataset.i;
        swap(topSheet().d.items, i, i - 1);
        render();
    },
    gdn: (t) => {
        const i = +t.dataset.i;
        swap(topSheet().d.items, i, i + 1);
        render();
    },
    grm: (t) => {
        topSheet().d.items.splice(+t.dataset.i, 1);
        render();
    },
    gsave: () => {
        const d = topSheet().d;
        d.name = d.name.trim() || 'Untitled group';
        if (!d.items.length) {
            toast('Add at least one exercise');
            return;
        }
        if (d.id) {
            const i = S.groups.findIndex((g) => g.id === d.id);
            S.groups[i] = d;
        } else {
            d.id = uid('g');
            S.groups.push(d);
        }
        save();
        ui.stack.pop();
        render();
        toast('Group saved');
    },
    gdel: () => {
        const d = topSheet().d;
        ask('Delete “' + d.name + '”? It will also be removed from routines.', 'Delete', () => {
            S.groups = S.groups.filter((g) => g.id !== d.id);
            S.routines.forEach((r) => (r.days = r.days.map((x) => x.filter((id) => id !== d.id))));
            save();
            ui.stack.pop();
            render();
        });
    },
    seed,
});
