# Iframe regression baseline

Baseline runtime: `c081148730ce89c428a354e7a79b359c2d0bbe64`.
The test contribution changes no runtime code. Both checked-out release files
are exercised in local headless Chromium with mocked translation responses.

`iframe.spec.js` adds 22 scenarios to the existing 21. A complete `test.bat`
run therefore executes 43 checks per artifact, 86 in total. The normal runner
reports reproduced known failures separately; they are unresolved defects, not
successful behavior. `test.bat --no-pause --strict --grep iframe` disables those
exceptions and runs 24 iframe checks per artifact, including the original two
in `run.js`. The existing two cross-origin message tests also run in the full suite.

## Baseline results

The source and minified artifacts produced identical results. Before any runtime
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

## Scope of the proposed configuration-source fix

The pending change from `parent.translate.config.get()` to
`translate.config.get()` should repair the four new configuration-source cases
and the original nested-frame reproducer. It must be validated with this same
matrix after the change. It does not address the six other failing iframe
scenarios or the two Shadow DOM limitations in the full suite.

No unlimited recursive iframe injection is promised: an actual injector enables
iframe translation itself. Cross-origin pages and sandbox origins remain separate
browser security boundaries. These checks cover Chromium and the explicit
scenarios above, not every possible frame hierarchy, timing, or browser.
