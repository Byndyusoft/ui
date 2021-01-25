module.exports = [
    {
        type: 'input',
        name: 'name',
        message: 'Provide new component name.'
    },
    {
        type: 'confirm',
        name: 'withStory',
        initial: 'Y',
        message: 'Do you want to generate component with story?'
    }
];
