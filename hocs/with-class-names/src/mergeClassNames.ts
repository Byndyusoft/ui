interface IMergeOptions {
    withReplace?: boolean;
}

const getDefaultOptions = (): IMergeOptions => ({
    withReplace: true
});

const joinClassNames = <CN extends object>(target: CN, source: CN): CN => {
    const result = Object.assign({}, target);

    for (const key in source) {
        if (!source[key]) {
            continue;
        }

        if (result[key]) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            result[key] = [result[key], source[key]].join(' ');
        } else {
            result[key] = source[key];
        }
    }

    return result;
};

export default function mergeClassNames<CN extends object>(target: CN, source: CN, options: IMergeOptions = {}): CN {
    const mergedOptions = Object.assign(getDefaultOptions(), options);

    if (mergedOptions.withReplace) {
        return Object.assign({}, target, source);
    }

    return joinClassNames(target, source);
}
