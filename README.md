# Byndyusoft UI Library

## Development

1. Choose main development branch - `next`
2. Install npm packages by running `npm install`
3. Initiate some tools for development by command `npx postinstall`

### Npm commands

-   `build` - build production version of all entities to folder
-   `clean` - remove folder with production version of all entities
-   `lint` - check all entities files for errors by linters
-   `test` - start all entities tests
-   `postinstall` - initiate some tools for development
-   `build:storybook` - build `storybook` with all entities stories to folder
-   `prettier:check` - check all files by `prettier`
-   `prettier:write` - fix all files by `prettier`
-   `start` - start `storybook` server with all entities stories on [localhost:6009](http://localhost:6009)

### Create a new entity

1. To add a new entity create a new branch `feature/new-entity-name` from branch `next`
2. By using `hygen` create a folder with files for a new entity<br>
   4.1. If you are using `hygen` at first time, you need to install (`npm install -global hygen`) and initialize it (`npx hygen init self`). [More about `hygen`](https://www.hygen.io/docs/quick-start/) <br>
   4.2. To create a folder for your entity, use command `npx hygen create entity-type` (entity types: `component`, `hook`)
3. Develop new entity with tests and stories
4. Check that building production version, tests, stories and linters run without problems
5. Push your branch and create a PR on GitHub to merge it to the `next` branch

#### Npm commands provided by `hygen` entities templates

-   `build` - build production version of entity to folder
-   `clean` - remove folder with production version of entity
-   `lint` - check entity files for errors by linters
-   `test` - start tests inside entity folder
