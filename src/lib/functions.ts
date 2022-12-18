import {join, parse} from 'path';

export const setProcessAndTermTitle = (title: string) => {
    process.title = title;
    process.stdout.write(`${String.fromCharCode(27)}]0;${title}${String.fromCharCode(7)}`);
};

/**
 * Derive the output file path from a source file.
 */
export const getOutputFilePath = (targetDir: string, featureFilePath: string) => {
    const {dir, name} = parse(featureFilePath);
    if (targetDir.length === 0) {
        return join(dir, `${name}.md`);
    }
    return join(targetDir, `${name}.md`);
};
