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

## Storage resilience

The baseline stops translating when localStorage quota, reads, writes, or property
access fail. The current wrapper mirrors successful reads and attempted writes in
page memory. The first localStorage exception switches the current instance to
memory for all subsequent reads and writes. This prevents old persisted language
settings from overriding a failed write. Normal reads still observe external
updates and remove the mirror when a persisted key is absent.

Storage scenarios are required passes, including in strict mode. They cover quota
exhaustion and cache reuse, separately blocked reads/writes/property access,
repeated language switches, failed writes overriding persisted values, external
updates/deletions, and persistence working again after a page reload.

Memory mode lasts for the instance lifetime, even if localStorage becomes available
again. It does not persist new values, observe subsequent direct localStorage
changes, or recover keys that were never mirrored. Reloading starts a fresh instance
and retries localStorage. Memory entries have no automatic eviction in this change.

## Existing runtime failures

### Nested iframe injection

The reproducer's top page does **not** load translate.js. Its middle iframe loads
the library and injects it into an inner iframe. The middle page translates, but
the inner page remains in Chinese and the baseline throws
`Cannot read properties of undefined (reading 'config')`.

The injector reads `parent.translate.config.get()` from the middle window, whose
parent has no `translate` object. PR #112 proposes a change for this case and
requires its own review.

The expanded [iframe regression matrix](IFRAME_REPORT.md) records additional
configuration, discovery, lifecycle and origin-boundary cases against the
unchanged runtime before evaluating that fix.

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
