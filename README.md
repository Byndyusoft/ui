# ui

React-based UI library

1. Lerna `npm install --global lerna`
2. Чтобы добавить в зависимости одного пакета другой, нужно сделать `lerna add package-to-add --scope package-where-to-add`

## Заметки

### Вопросы

- Для внешней ссылки используем сторибук на облачком хостинге, или свой сайт на gihub pages?
- Чем собирать отдельные пакеты?

### Storybook

Есть 2 варианта использования storybook в монорепе. Sorybook-in-root или storybook-as-a-packages. Я пока за второй вариант, подробнее в заметке вот [тут](https://richsoni.com/posts/2019-01-24-comparing-lerna-storybook-architectures/)

### TODO

1. Настроить билд отдельных пакетов.
2. Настроить сторибук
3. Настроить github actions

### Ссылки

[Monorepos: Lerna, TypeScript, CRA and Storybook combined](https://dev.to/shnydercom/monorepos-lerna-typescript-cra-and-storybook-combined-4hli)
[Next.js, Storybook, and Lerna: Build a Monorepo Structure](https://buttercms.com/blog/nextjs-storybook-and-lerna-build-a-monorepo-structure)
[Writing your first React UI Library - Part 1: Lerna](https://dev.to/davixyz/writing-your-first-react-ui-library-part-1-lerna-17kc)

[Boost your create-react-app workflow with esbuild / swc](https://dev.to/pradel/boost-your-create-react-app-workflow-with-esbuild-swc-3a8m)

[Zero-Config Monorepo for a React Component Library in 2019](https://medium.com/@MattBlackDev/zero-config-monorepo-for-a-react-component-library-in-2019-dd9137bdd0a6)

[Component Library in Tetrisly.com](https://medium.com/sketch-app-sources/how-we-organized-the-component-library-in-tetrisly-com-part-1-introduction-a2eb5ff61395)
[Starter Kit to create Design System and Wireframes in Figma](https://tetrisly.com/figma/)

Пакеты:

[Линтер для монореп](https://github.com/Thinkmill/manypkg)

[Microbundle](https://github.com/developit/microbundle)

Стартеры с монорепой на github

[react-workspaces-playground](https://github.com/react-workspaces/react-workspaces-playground)

Свежая репа примером[tsdx-monorepo](https://github.com/jaredpalmer/tsdx-monorepo)

---

###TODO 

 -[x] посмотреть tsdx? **штука хорошая, но пока непонятно, как это работает с глобальным сторибуком. Посмотрю в отдельной ветке попозже**
 -[ ] Выбрать способ стилизации, темы. Дефолтные кастомизируемые стили
 -[ ] Опубликовать 1 компонент со стилями
 -[ ] Опубликовать хук в npm
 -[ ] Попробовать хук на реальном проекте


---
###История

 1. Попробовал сделать по этому [гайду](https://dev.to/shnydercom/monorepos-lerna-typescript-cra-and-storybook-combined-4hli) и [хэтому гайду](https://medium.com/@MattBlackDev/zero-config-monorepo-for-a-react-component-library-in-2019-dd9137bdd0a6) все заработало.
 2. Накатил в корне монорепы `storybook`, он стал конфликтовать с `cra`. Думаю между отказаться от `cra` или накатить сверху шаблон сторибука.
 
