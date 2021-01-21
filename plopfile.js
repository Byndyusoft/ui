const outputs = {
    componentsFolder: './src/components',
    hooksFolder: './src/hooks'
};

/* 
    template: string
    key: Array <string, value: string>
*/

const transformTemplateKeys = (template, list) => {
    let transformedTemplate = template;

    list.forEach(element => {
        transformedTemplate = transformedTemplate.split(element.key).join(element.value);
    });

    return transformedTemplate;
};

module.exports = function (plop) {
    plop.setGenerator('component', {
        description: 'Generate Component',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Component name'
            },
            {
                type: 'confirm',
                name: 'withTest',
                message: 'Init test file'
            },
            {
                type: 'confirm',
                name: 'withStory',
                message: 'Init story file'
            }
        ],
        actions: data => {
            let actions = [
                {
                    type: 'add',
                    path: `${outputs.componentsFolder}/{{name}}/{{name}}.tsx`,
                    templateFile: './plop-templates/generators/component/TemplateName.tsx',
                    force: true,
                    transform(template) {
                        const { name, withTest } = data;
                        return transformTemplateKeys(template, [{ key: 'TemplateName', value: name }]);
                    }
                }
            ];

            if (data.withTest) {
                actions.push({
                    type: 'add',
                    path: `${outputs.componentsFolder}/{{name}}/{{name}}.test.tsx`,
                    templateFile: './plop-templates/generators/component/TemplateName.test.tsx',
                    force: true,
                    transform(template) {
                        const { name } = data;
                        return transformTemplateKeys(template, [{ key: 'TemplateName', value: name }]);
                    }
                });
            }

            if (data.withStory) {
                actions.push({
                    type: 'add',
                    path: `${outputs.componentsFolder}/{{name}}/{{name}}.stories.tsx`,
                    templateFile: './plop-templates/generators/component/TemplateName.stories.tsx',
                    force: true,
                    transform(template) {
                        const { name } = data;
                        return transformTemplateKeys(template, [{ key: 'TemplateName', value: name }]);
                    }
                });
            }

            return actions;
        }
    });

    plop.setGenerator('hook', {
        description: 'Generate Hook',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Hook name'
            },
            {
                type: 'confirm',
                name: 'withTest',
                message: 'Init test file'
            }
        ],
        actions: data => {
            let actions = [
                {
                    type: 'add',
                    path: `${outputs.hooksFolder}/{{name}}/{{name}}.tsx`,
                    templateFile: './plop-templates/generators/hook/TemplateName.ts',
                    force: true,
                    transform(template, props) {
                        const { name } = props;
                        return transformTemplateKeys(template, [
                            { key: 'TemplateName', value: name },
                            { key: 'TypeName', value: String(name[0]).toUpperCase() + String(name).slice(1) }
                        ]);
                    }
                },
                {
                    type: 'add',
                    path: `${outputs.hooksFolder}/{{name}}/index.ts`,
                    templateFile: './plop-templates/generators/hook/index.ts',
                    force: true,
                    transform(template, props) {
                        const { name } = props;
                        return transformTemplateKeys(template, [{ key: 'TemplateName', value: name }]);
                    }
                }
            ];

            if (data.withTest) {
                actions.push({
                    type: 'add',
                    path: `${outputs.hooksFolder}/{{name}}/{{name}}.test.tsx`,
                    templateFile: './plop-templates/generators/hook/TemplateName.test.ts',
                    force: true,
                    transform(template, props) {
                        const { name } = props;

                        return transformTemplateKeys(template, [{ key: 'TemplateName', value: name }]);
                    }
                });
            }

            return actions;
        }
    });
};
