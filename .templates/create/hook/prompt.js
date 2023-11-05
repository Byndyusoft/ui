module.exports = [
    {
        type: 'input',
        name: 'name',
        message: 'Provide new hook name.'
    },
    {
        type: 'confirm',
        name: 'hasStories',
        initial: 'Y',
        message: 'Do you want to generate hook with stories?'
    },
    {
        type: 'confirm',
        name: 'hasDocs',
        initial: 'Y',
        message: 'Do you want to generate hook with docs?'
    },
    {
        type: 'confirm',
        name: 'hasTests',
        initial: 'Y',
        message: 'Do you want to generate hook with tests?'
    }
];
