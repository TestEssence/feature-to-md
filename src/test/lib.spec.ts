import test, { before } from 'ava';
import { posix, resolve, sep } from 'path';
import {getOutputFilePath} from "../lib/functions";
import { readFile } from '../lib/path';
test('getOutputFilePath should return the same path but with different extension', (t) => {
    const mdFilePath = posix.join('/', 'var', 'foo', 'bar.md');

    t.is(getOutputFilePath(mdFilePath), `${sep}var${sep}foo${sep}bar.md`);
});


