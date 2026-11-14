/**
 * Build the editable 22-slide deck, draft PPTX, renders and speaker notes.
 * Usage: node src/build.mjs [build-directory]
 * Native Keynote conversion and the final offline preview are separate steps:
 *   node src/keynote/export-keynote.mjs <build-directory>
 *   node src/keynote/preview.mjs <build-directory>
 */
await import('./keynote/build.mjs');
