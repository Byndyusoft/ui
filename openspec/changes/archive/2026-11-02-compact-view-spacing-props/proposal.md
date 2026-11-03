# Proposal

## Why

`View` currently requires verbose spacing props and emits one class per supplied prop, even when several props resolve to the same spacing token. A compact prop API and canonical class composition will make layout declarations shorter and reduce redundant class names while defining predictable behavior for overlapping margin and padding props.

## What Changes

- Add short aliases for every existing margin and padding prop: `m`, `mt`, `mr`, `mb`, `ml`, `mh`, `mv`, and `p`, `pt`, `pr`, `pb`, `pl`, `ph`, `pv`.
- Resolve each physical side by precedence: the all-sides prop overrides axis and side props; horizontal/vertical props override their corresponding side props. Apply the same rules to padding.
- When both long and short aliases of the same prop are supplied, use the value of the alias appearing last in the final props object's enumerable-key order. An `undefined` value is treated as absent.
- Compose spacing classes from the effective per-side tokens, using shorthand classes when tokens match. Token equality is based on the token name, not equal numeric multipliers.
- Pass the same behavior and typed props through `Flex`, which extends View props.
- Update tests, Storybook examples, README documentation, and package changesets.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `configurable-layout`: define short spacing aliases, conflict precedence, alias ordering, and minimal class composition.

## Impact

- `components/view`: public `ISpacingProps`, spacing prop resolution, generated DOM class lists, tests, Storybook, and README.
- `components/flex`: inherited spacing prop API, tests, and README.
- No new CSS rules or runtime dependencies are required; the existing shorthand classes are sufficient.
- Changesets: `minor` for `@byndyusoft-ui/view` and `@byndyusoft-ui/flex`.
