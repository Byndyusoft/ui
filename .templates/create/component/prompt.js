module.exports = [
    {
        type: 'input',
        name: 'name',
        message: 'Provide new component name.'
    },
    {
        type: 'input',
        name: 'folderName',
        message: 'Provide new component folder name (kebab-case).'
    },
    {
        type: 'input',
        name: 'authorName',
        message: 'Provide your surname and name.'
    },
    {
        type: 'input',
        name: 'authorEmail',
        message: 'Provide your email address.'
    },
    {
        type: 'input',
        name: 'packageKeywords',
        message: 'Provide keywords specialized for this component (divide them by spaces) (may be skipped).'
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
