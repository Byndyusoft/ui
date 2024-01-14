module.exports = [
    {
        type: 'input',
        name: 'name',
        message: 'Provide new component name.'
    },
    {
        type: 'confirm',
        name: 'hasStories',
        initial: 'Y',
        message: 'Do you want to generate component with stories?'
    },
    {
        type: 'confirm',
        name: 'hasDocs',
        initial: 'Y',
        message: 'Do you want to generate component with docs?'
    },
    {
        type: 'confirm',
        name: 'hasTests',
        initial: 'Y',
        message: 'Do you want to generate component with tests?'
    }
];
