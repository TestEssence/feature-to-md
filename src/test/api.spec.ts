import { featureToMd } from '..';
import test from 'ava';
import { readFileSync } from 'fs';
import {basename, resolve} from "path";

test('convert the feature example to markdown @api', async (t) => {
    const markdown = await featureToMd({ path: resolve(__dirname, 'features', 'example.feature') });
    t.is(basename(markdown.filename!), 'example.md');
    t.truthy(markdown.content);
    t.notThrows(() => readFileSync(resolve(__dirname, 'features', 'example.feature'), 'utf-8'));
});