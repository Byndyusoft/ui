# @byndyusoft/ui

## Generating templates

To generate templates we are using [plop.js](https://github.com/plopjs/plop 'plop')
Browse templates with command: `yarn plop`

**NOTE**: Template generator has force flag enabled, means that it overwrite files. Please, be ensure that you have committed all changes before using it to prevent file loss.

##### Example

Create component with test and stories files.
`yarn plop component Button yes yes`
Same but shorter:
`yarn plop component Button y y`

##### Component

`yarn plop component`

_All params:_
`yarn plop component componentName withTest withStory`

##### Hook

`yarn plop hook`

_All params:_
`yarn plop hook hookName withTest`

## Develop

`yarn && yarn start`

## Build

`yarn build`

## Test

`yarn test` or `yarn test:watch` for watching changes
