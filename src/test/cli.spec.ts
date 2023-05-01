import test from "ava";
import {parse, resolve} from 'path';
import { execSync } from 'child_process';
import { readFileSync, unlinkSync } from 'fs';
import { GlobSync } from 'glob';
import { logger } from "../lib/logger";

const TargetDir: string = 'markdowns';
const FeaturesDir: string = 'features';
test.beforeEach(() => {
    const filesToDelete = [
        resolve(__dirname, FeaturesDir, 'example.md'),
        resolve(__dirname, FeaturesDir,'subDir', 'sub-example.md'),
        resolve(__dirname, FeaturesDir,'subSubDir', 'example.md'),
        resolve(__dirname, TargetDir, 'example.md'),
        resolve(__dirname, TargetDir, 'sub-example.md')
    ];

    for (const file of filesToDelete) {
        try {
            unlinkSync(file);
        } catch (error) {
            if ((error as { code: string }).code !== 'ENOENT') {
                throw error;
            }
        }
    }
});

test('convert "example.feature" into markdown, using --targetdir', async (t) => {
  const cmd = [
    'ts-node', // ts-node binary
    resolve(__dirname, "..", "cli"), // feature-to-md cli script (typescript)
    resolve(__dirname, "features", "example.feature"), // file to convert
    '--targetdir',
        resolve(__dirname, TargetDir),
  ].join(" ");
  logger.info("command: " + cmd);
  t.notThrows(() => execSync(cmd));
  await new Promise((r) => setTimeout(r, 500));
  t.notThrows(() =>
    readFileSync(resolve(__dirname, TargetDir, "example.md"), "utf-8")
  );
});

test('convert "**/*.feature" files, recursively', async (t) => {
  const filesPatternToConvert =
    resolve(__dirname, FeaturesDir) + "/**/*.feature";
  const cmd = [
    'ts-node', // ts-node binary
    resolve(__dirname, "..", "cli"), // feature-to-md cli script (typescript)
    filesPatternToConvert,
  ].join(" ");
  logger.info("command: " + cmd);
  t.notThrows(() => execSync(cmd));
  await new Promise((r) => setTimeout(r, 500));
  t.notThrows(() =>
    readFileSync(resolve(__dirname, FeaturesDir, "example.md"), "utf-8")
  );
  t.notThrows(() =>
    readFileSync(
      resolve(__dirname, FeaturesDir, "subDir", "sub-example.md"),
      "utf-8"
    )
  );
  t.notThrows(() =>
    readFileSync(
      resolve(__dirname, FeaturesDir, "subDir", "subSubDir", "example.md"),
      "utf-8"
    )
  );
});


test('convert "**/*.feature" files, recursively,  using --targetdir with --debug loging', (t) => {
    logger.info("files from recursive dirs will be placed inot the single -targetDir directory");
    const filesPatternToConvert = resolve(__dirname, FeaturesDir) + '/**/*.feature';
    const cmd = [
        'ts-node', // ts-node binary
        resolve(__dirname, '..', 'cli'), // feature-to-md cli script (typescript)
        filesPatternToConvert,
        '--targetdir',
        resolve(__dirname, TargetDir),
        '--debug',
    ].join(' ');
    logger.info('command: '+cmd);
    t.notThrows(() => execSync(cmd));
    const globFiles = new GlobSync(filesPatternToConvert.replace(/\\/g, '/'));
    const files = globFiles.found.map(name=> resolve(__dirname,TargetDir, parse(name).name +'.md'));
    t.truthy(files.length>0)
    files.forEach((file) => {
        logger.info('assert file:' +file);
        t.notThrows(() =>readFileSync(file,"utf-8"));
    });

});