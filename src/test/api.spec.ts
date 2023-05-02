import { featureToMd } from '..';
import test from 'ava';
import { readFileSync } from 'fs';
import {basename, resolve} from "path";
import { Config } from '../lib/config';

test('convert the feature example to markdown @api', async (t) => {
    const markdown = await featureToMd({ path: resolve(__dirname, 'features', 'example.feature') });
    t.is(basename(markdown.filename!), 'example.md');
    t.truthy(markdown.content);
    t.notThrows(() => readFileSync(resolve(__dirname, 'features', 'example.md'), 'utf-8'));
});

test('convert the feature example to markdown with debug log @api', async (t) => {
    let config: Config = {
        featureSummaryTemplate: "",
        scenarioFooterTemplate: "",
        feature_file_encoding: "utf-8",
        targetDir: "",
        debugMode: true,
        highlightTags: false,
    };
    
    const markdown = await featureToMd({ path: resolve(__dirname, 'features', 'second.example.feature') }, config );
    t.truthy(markdown.content);
    t.notThrows(() => readFileSync(resolve(__dirname, 'features', 'second.example.md'), 'utf-8'));
});

test('empty cell feature file should be converted @api', async (t) => {
    let config: Config = {
        featureSummaryTemplate: "Feature Summary",
        scenarioFooterTemplate: "Scenario Footer",
        feature_file_encoding: "utf-8",
        targetDir: "",
        debugMode: true,
        highlightTags: false,
    };
    const markdown = await featureToMd({ path: resolve(__dirname, 'features', 'empty.cell.feature') }, config);
    t.truthy(markdown.content);
    t.notThrows(() => readFileSync(resolve(__dirname, 'features', 'empty.cell.md'), 'utf-8'));
});