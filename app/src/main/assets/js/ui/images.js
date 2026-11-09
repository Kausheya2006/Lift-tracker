'use strict';
// Exercise photo helpers (fall back to the illustration when there is no photo).

// Photos live in img/NNN-0.webp (start position) and img/NNN-1.webp (end position).
const imgSrc = (i, k) => 'img/' + String(i).padStart(3, '0') + '-' + k + '.webp';
const exImg = (ex) =>
    ex.i >= 0
        ? '<img alt="" loading="lazy" decoding="async" src="' + imgSrc(ex.i, 0) + '">'
        : iconFor(ex);
const exThumb = (ex, cls) => '<div class="' + (cls || 'th') + '">' + exImg(ex) + '</div>';
