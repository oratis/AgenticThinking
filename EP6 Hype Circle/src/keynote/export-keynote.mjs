// macOS + Keynote + Poppler. Import editable objects, verify notes, then render.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';

const exec = promisify(execFile);
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const build = path.resolve(process.argv[2] || '/private/tmp/ep6-keynote-build');
const input = path.resolve(process.argv[3] || path.join(build, 'candidate.pptx'));
const output = path.join(root, 'EP6-Hype-Circle.key');
const staging = await fs.mkdtemp(path.join(build, 'native-'));
const nativeKey = path.join(staging, 'EP6-Hype-Circle.key');
const pdf = path.join(staging, 'EP6-Hype-Circle.pdf');
const app = process.env.KEYNOTE_APP || 'Keynote Creator Studio';
// Only a known application name is interpolated. Paths are passed as argv.
if (!['Keynote Creator Studio', 'Keynote'].includes(app)) throw new Error('KEYNOTE_APP must be Keynote or Keynote Creator Studio');
await exec('open', ['-a', app]);
const script = `on run argv
  with timeout of 600 seconds
    tell application "${app}"
      launch
      set doc to open POSIX file (item 1 of argv)
      if doc is missing value then error "Keynote could not open the deck. Unlock the Mac and inspect the import window."
      if (count of slides of doc) is not 22 then error "Expected 22 slides"
      set report to ""
      repeat with n from 1 to 22
        set currentSlide to slide n of doc
        set noteText to presenter notes of currentSlide as text
        if (length of noteText) < 30 then error "Missing presenter notes"
        set textCount to count of text items of currentSlide
        set shapeCount to count of shapes of currentSlide
        if textCount + shapeCount < 4 then error "Slide has no editable objects"
        set report to report & n & tab & textCount & tab & shapeCount & tab & (length of noteText) & linefeed
      end repeat
      save doc in POSIX file (item 2 of argv)
      export doc to POSIX file (item 3 of argv) as PDF
      close doc saving no
    end tell
  end timeout
  return report
end run`;
const result = await exec('osascript', ['-e', script, input, nativeKey, pdf], { timeout: 660000 });
await fs.writeFile(path.join(build, 'keynote-object-audit.tsv'), 'slide\ttext_items\tshapes\tnote_characters\n' + result.stdout);
await exec('pdftoppm', ['-png', '-scale-to-x', '1920', '-scale-to-y', '1080', pdf, path.join(staging, 'slide')], { timeout: 120000 });
await fs.mkdir(path.join(build, 'render'), { recursive: true });
for (let i = 1; i <= 22; i++) {
  const filename = 'slide-' + String(i).padStart(2, '0') + '.png';
  await fs.copyFile(path.join(staging, filename), path.join(build, 'render', filename));
}
await fs.copyFile(nativeKey, output);
console.log('Saved editable Keynote: ' + output);
console.log('Verified 22 slides and presenter notes. Native renders: ' + path.join(build, 'render'));
