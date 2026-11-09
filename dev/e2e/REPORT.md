# translate.js DOM runtime observations

Baseline core: `4.1.0.20260526`

Method: local headless Chromium fixtures with mocked translation responses.

The original PR #111 runner reported 16/21 checks passing. Its committed
`report/test-output-after-fixes.txt` records a different run with proposed fixes
applied. Those counts describe the original runner and do not describe the revised
tests or establish that PR #112 or #113 is ready to merge.

The revised runner uses ordinary assertions, checks for specific known failure
signatures, and a skipped optional feature check. `npm test` fails on unexpected
failures; a known scenario becomes an expected failure only when its assertion
fails and its observed signature matches. A repaired scenario passes normally.
`npm run test:strict` disables these expected-failure exceptions for evaluating
fixes. Current results are generated in `report/results.json`; the following
observations do not substitute for a run.

## Existing runtime failures

### Storage quota exhaustion

When writes for `hash_*` translation entries throw `QuotaExceededError`, dynamically
appended text remains untranslated. The baseline `translate.storage.set()` calls
`localStorage.setItem()` without guarding the exception. This is an existing core
problem; the test-only changes do not repair it.

The regression test requires the appended content to translate without a page
error. Expected-failure handling is limited to this scenario.

### Unavailable storage

Throwing from `Storage.prototype.setItem` before initialization prevents the
baseline fixture from translating. Storage can also be unavailable on reads or
when accessing `window.localStorage`; these are separate cases and are tested
separately rather than treating a write-only simulation as complete coverage.

### Nested iframe injection

The reproducer's top page does **not** load translate.js. Its middle iframe loads
the library and injects it into an inner iframe. The middle page translates, but
the inner page remains in Chinese and the baseline throws
`Cannot read properties of undefined (reading 'config')`.

The injector reads `parent.translate.config.get()` from the middle window, whose
parent has no `translate` object. PR #112 proposes a change for this case and
requires its own review.

## Existing limitation: Shadow DOM

Open Shadow DOM content is not translated by the baseline implementation. The
tests check the initial node and a separately identified newly appended node.
Checking the original node again after insertion would not prove that dynamic
Shadow DOM works. Supporting this requires a separate implementation decision.

## Optional feature: translation-cache clearing

The baseline has `translate.language.clearCacheLanguage()` but does not provide
`translate.storage.clearCache()`. This is a missing feature, not a newly introduced
runtime failure, so its test is skipped while the API is absent.

If the API is present, the test calls it and checks the proposed contract:
`hash_*` localStorage entries are removed while all pre-existing unrelated values
remain. This checks persisted browser storage, not an in-memory cache or the
method's return value. Function existence alone, or the presence of
`storage.remove()`, does not establish correct cache clearing.

PR #113 proposes storage resilience and additional cache APIs. These tests do not
approve its implementation or imply that it must be merged with the harness.

## Existing message-origin policy

The baseline defaults `translate.postMessage.allowedOrigins` to `[]` and explicitly
allows all origins under that configuration. A parent on `127.0.0.1:8123` can
therefore send a language-change message to an iframe on `127.0.0.1:8124`.

This reproduces the existing compatibility behavior. It does not demonstrate
arbitrary code execution or data disclosure. The tests also exercise an explicit
allowlist, including rejection of a sender outside it. Changing the default
policy would change compatibility and should be reviewed separately.

## Scope

The harness exercises the checked-out core without changing it. Local API mocks
cover deterministic DOM behavior; translation quality, provider latency, broad
browser compatibility and all possible website integrations need other checks.
The retained historical screenshots illustrate the original contribution's
scenarios and should not be used as evidence that a current checkout passes.
