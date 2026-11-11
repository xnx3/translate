# Iframe regression baseline

Baseline runtime: `c081148730ce89c428a354e7a79b359c2d0bbe64`.
The test contribution changes no runtime code. Both checked-out release files
are exercised in local headless Chromium with mocked translation responses.

The original matrix added 22 scenarios to the existing 21, for 43 checks per
artifact, 86 in total. Two navigation checks and three no-`src` rescan checks
now bring a complete `test.bat` run to 48 checks per artifact, 96 in total. The normal runner
reports reproduced known failures separately; they are unresolved defects, not
successful behavior. `test.bat --no-pause --strict --grep iframe` disables those
exceptions and runs 29 iframe checks per artifact, including the original two
in `run.js`. The existing two cross-origin message tests also run in the full suite.

## Baseline results

The source and minified artifacts produced identical results in the original
43-check baseline below. Before any runtime
fix, each full suite has 29 normal passes, 13 known failures and one optional API
skip. The new matrix alone has 12 normal passes and 10 known failures per artifact.

| New scenario | Baseline result |
| --- | --- |
| Static `src`, parent starts before the child load event | Known: initial element is not discovered |
| Static `src`, parent starts after child loading | Known: existing document is not injected |
| Dynamically appended same-origin `src` | Pass |
| No `src`, writable same-origin document | Pass |
| Already loaded `srcdoc` | Known: no injection |
| Multiple dynamically added siblings | Pass |
| Child loads its own library and configuration | Pass, no duplicate injection or configuration overwrite |
| Repeated scans of an injected `src` frame | Pass, exactly one script |
| Navigation to another same-origin document | Pass |
| Child document reload | Pass |
| Element removal and recreation | Pass |
| Dynamic DOM content after injection | Pass |
| Repeated language changes after injection | Pass |
| Middle injector with an ancestor that has no library | Known: reads the wrong window |
| Middle injector and ancestor have different configurations | Known: child inherits the ancestor configuration |
| More than one ancestor without the library | Known: reads the wrong window |
| Already cross-origin child is discovered | Pass, remains untouched |
| Cross-origin ancestor, injector and its child share an origin | Known: forbidden ancestor-window access |
| Automatic iframe translation disabled | Pass, dynamically discovered child remains untouched |
| Injected child navigates from same-origin to cross-origin | Known: installed load handler accesses the cross-origin window |
| Sandbox permits scripts but has an opaque origin | Known: load handler accesses the opaque-origin window |
| Repeated scans of a no-`src` frame | Known: four scripts and three duplicate-load errors |

## Failure classification

Each exception applies only after a real assertion fails and its specific DOM and
browser-error signature matches. Fixture initialization, a different assertion,
additional browser errors, or a wrong library artifact still fail the command.
Every library response is checked against the selected on-disk file's SHA256.

A temporary unexpected runtime error was also injected into the static-frame
case. Both artifacts reported unexpected failures and the launcher returned a
nonzero exit code. The test file was then restored byte for byte. This verifies
that the known missing-injection failure cannot hide a new browser error.

- Missing injection requires a ready child, both original Chinese strings, no
  library script, and no runtime errors.
- Wrong-window failures require the original untranslated child, exactly one
  library script, and the exact single reproduced `get`, `config`, or cross-origin
  `translate` access error for that specific scenario.
- Wrong configuration requires exactly `owner=outer`, `show=true`, and
  `ignored=false`, plus the known translated content. The desired result remains
  the middle injector's settings and ignored original text.
- Cross-origin navigation and sandbox cases first verify that the target has no
  library and remains untranslated, then classify only the exact single forbidden
  `translate` property-access error from port 8123.
- Repeated no-`src` injection requires exactly four scripts, translated content,
  and exactly three complete duplicate-library error messages.

The DOM element with `id="translate"` creates a named `window.translate` property
even without the library. Negative tests check the library version and script
elements rather than treating that named DOM property as a loaded library.

## Configuration-source fix

Commit `aca3710` changes `parent.translate.config.get()` to
`translate.config.get()` in both release files. The complete 86-check comparison
confirmed that the four new configuration-source cases and the original nested
reproducer became ordinary passes in both files. All previous passes remained
passes, with no unexpected failures. Each file had 34 normal passes, eight known
failures and one skip. The remaining failures were six other iframe scenarios
and two Shadow DOM limitations.

## Iframe load access checks

Two additional cases exercise a same-origin URL that redirects to the other
local origin and the same iframe navigating same-origin, cross-origin, then
back to same-origin. The round trip must resume translation, inject exactly one
script into the replacement document and translate later DOM additions.

These cases assert the actual final frame origin and content. The redirect case
also confirms that the iframe's `src` still points to the same-origin URL. Both
classify a known failure only after their DOM assertions pass and exactly one
recorded forbidden `translate` property-access error is present. Extra errors
and failed setup remain unexpected failures.

Against `aca3710`, the expanded 90-check baseline produced 34 normal passes,
10 known failures and one skip per file. The source-only load-handler fix checks
`iframeTag.contentDocument` before reading the child window's `translate`.
It skips the current load when the browser cannot expose the document and leaves
the listener attached so a later same-origin navigation can still translate.

| Artifact | Before: pass / known / skip | After: pass / known / skip |
| --- | --- | --- |
| `translate.js` | 34 / 10 / 1 | 38 / 6 / 1 |
| `translate.min.js` (unchanged) | 34 / 10 / 1 | 34 / 10 / 1 |

Exactly four source cases became normal passes: cross-origin navigation, the
cross-origin redirect, the round trip and the opaque sandbox. Those four also
passed in the source `strict` project without known-failure exceptions. All
previous passes and remaining known-failure signatures stayed unchanged, with
no unexpected failures. The same test files were used before and after.
The minified file was deliberately left byte-for-byte unchanged in this step.
The six source failures remaining after that fix were static discovery (two cases), `srcdoc`,
repeated no-`src` injection and the two Shadow DOM limitations.

## Loaded no-src iframe rescans

Source version `4.1.0.20261111` adds a check only to the no-`src` branch. When the
child document is accessible and its library version exists, it reuses that
library, synchronizes the parent configuration and current language, schedules
the existing translation call after 10 ms, and returns before script injection.
The change adds no shared state or new helper function.

The original repeated-scan case and three additional regressions check that
rescanning does not add a script or throw a duplicate-load error. The additional
checks verify manual translation with listening disabled, parent configuration
updates, and static translation after `document.open/write` replaces the root
while retaining the library. They also verify that the library instance is
preserved. Known-failure classification requires all functional assertions to
pass and the exact duplicate-error and script-count signature to match.

The same 48 source cases were run before and after: 38 pass / 9 known / 1 skip
became 42 pass / 5 known / 1 skip. Only those four rescan cases improved; all
previous passes and remaining known-failure signatures were preserved. The
complete after run also checked the unchanged minified file separately: 34 pass,
13 known, one skip. There were no unexpected failures in either file. All four
source rescan cases also passed in the `strict` project without known-failure
exceptions.

This step handles rescans after the library has loaded. Concurrent scans while
the script is still downloading retain the existing behavior. Rebinding dynamic
listeners after `document.open/write` is also outside this change; the rewrite
test requires static translation only.

No unlimited recursive iframe injection is promised: an actual injector enables
iframe translation itself. Cross-origin pages and sandbox origins remain separate
browser security boundaries. These checks cover Chromium and the explicit
scenarios above, not every possible frame hierarchy, timing, or browser.
