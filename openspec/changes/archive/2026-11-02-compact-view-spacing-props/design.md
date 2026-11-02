# Design

## Context

`View` currently maps a fixed list of long-form spacing props to CSS classes. The stylesheet already contains classes for all-side, horizontal, vertical, and individual-side spacing. `Flex` inherits `ICreatedViewProps` and forwards spacing props to its configured `View`. See `proposal.md` and the `configurable-layout` delta for motivation and behavior requirements.

The existing class resolver emits one class per non-empty prop. CSS rules are generated in `values` order, so their cascade cannot reliably implement the requested prop priority when overlapping props use different tokens. Class resolution must determine effective side values before emitting classes.

## Goals / Non-Goals

**Goals:**
- Make short and long prop forms type-equivalent and resolve aliases in the final props object's key order.
- Resolve margin and padding precedence independently of configuration order and CSS rule order.
- Emit only non-overlapping shorthand/side classes for effective values.
- Keep Flex behavior aligned through its inherited View props.

**Non-Goals:**
- Changing generated CSS rules, CSS variable behavior, style registration, or SSR delivery.
- Comparing tokens by their numeric multipliers; compaction uses exact token names.
- Forwarding spacing props as DOM attributes or changing custom `className` handling.

## Decisions

- **Normalize aliases before resolving precedence.** Map each long and short name to one semantic prop (`margin`/`m`, `marginTop`/`mt`, and so on). Traverse the final props object's own enumerable keys and let the last defined alias value update that semantic prop. An `undefined` value does not erase a previously defined alias. This follows the agreed observable key-order behavior; alternatively, a fixed preference for the long or short spelling would not follow JSX/object property order.

- **Compute effective values per physical side.** Resolve top/right/bottom/left independently after alias normalization. For each dimension, the all-side prop wins over axis and side props; horizontal wins over left/right; vertical wins over top/bottom. Apply the same resolution to padding. This explicit normalization is preferred to relying on CSS source order, which follows configuration token order rather than prop priority.

- **Emit a disjoint class cover.** If all four effective side tokens are defined and identical, emit the all-side class. Otherwise, for each axis emit its horizontal or vertical class only when both corresponding sides have the same defined token; emit side classes for remaining defined sides. Compare token strings, not multiplier values. Emit classes in a fixed order so output is deterministic. A shorthand never covers a side whose effective value is absent.

- **Reuse existing class generation and CSS.** The resolver uses existing prefixes and `getSpacingClassName`; no new CSS rule or style-registration path is needed. The aliases are stripped from DOM props just like the existing spacing props. Flex continues to pass them through its View wrapper.

- **Use the current utility API names.** View's utility barrel exposes `buildCss` and `registerStyles`; align stale references and tests to these names rather than restoring old aliases such as `buildSpacingCss` or `registerLayoutStyles`.

- **Keep `className` after generated spacing classes.** Preserve the current merge order between generated classes and consumer `className`; class compaction changes the generated portion only.

## Risks / Trade-offs

- [Generated class lists change for repeated/equivalent spacing props] → Add exact class-list tests and document the canonical class output; computed styles must match the resolved side values.
- [More resolver work on each render] → Keep resolution confined to the small fixed spacing prop set; the feature reduces per-element class tokens but does not reduce generated stylesheet size.
- [Unexpected alias ordering with spread props] → Use the final props object's enumerable-key order as the explicit rule and cover both key orders in tests.
- [View and Flex types or DOM filtering diverge] → Type aliases through `ICreatedViewProps`, and test View plus Flex forwarding and DOM prop stripping.

## Migration Plan

1. Add aliases and alias-to-semantic mapping to View's public spacing types and constants.
2. Replace per-prop class emission with alias normalization, side precedence resolution, and compact class generation.
3. Verify Flex forwards every alias and preserves layout props and custom classes.
4. Update type/runtime tests, Storybook examples, and both READMEs; add minor changesets for View and Flex.
5. Run package tests, lint, and builds with workspace dependencies.

## Open Questions

None.
