# translate.js E2E harness

A deterministic Playwright harness for the translate.js core. It serves local
fixtures and a mocked `translate.json` / `language.json` API, so the checks do
not depend on any external translation provider.

## Requirements

- Node.js 18+
- Chromium for Playwright

```bash
cd dev/e2e
npm install
npx playwright install chromium
```

## Run

```bash
npm test
```

The command prints one line per check and writes screenshots to
`dev/e2e/report/screenshots/`. It returns exit code 0 by default because some
checks document known bugs. Use strict mode after the fixes land:

```bash
npm run test:strict
```

## What is covered

- Static translation and language selector rendering
- Ignore rules: class, id, tag, text
- `placeholder`, `title` and `alt` translation
- `input.value` translation through `translate.element.tagAttribute`
- Dynamic DOM: `childList` insertion and `characterData` changes
- Language switch and switch back without reload
- Translation cache hit on reload
- `localStorage` quota and disabled-storage behavior
- Same-origin and nested iframe injection
- Cross-origin `postMessage` language switching
- Shadow DOM behavior
- Public cache-clearing API

## Known failures

The harness currently documents five problems in core v4.1.0:

1. `localStorage` quota errors abort rendering of dynamically added text.
2. Disabled `localStorage` prevents translation from starting.
3. Nested iframes fail because the injector reads `parent.translate`.
4. Shadow DOM content is not translated.
5. There is no public API to clear the translation cache.

See [REPORT.md](REPORT.md) for evidence, screenshots and the proposed PRs.

## Notes

- The harness is intentionally outside the published npm package.
- The mocked API returns deterministic strings; it does not test translation
  quality, provider latency or every supported language.
- The fixture server binds to `127.0.0.1` on ports `8123` and `8124`.
