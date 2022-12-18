#!/usr/bin/env node

// --
// Packages

import chalk from 'chalk';
import { watch, WatchOptions } from 'chokidar';
import getStdin from 'get-stdin';
import Listr from 'listr';
import path from 'path';
import { GlobSync } from 'glob';
import { PackageJson } from '.';
import { Config, defaultConfig } from './lib/config';
import { help } from './lib/help';
import { setProcessAndTermTitle } from './lib/functions';
import { featureToMd, cliFlags } from './index';
import { validateNodeVersion } from './lib/validate-node-version';

// --
// Run

main(cliFlags, defaultConfig).catch((error) => {
    console.error(error);
    process.exit(1);
});

// --
// Define Main Function

async function main(args: typeof cliFlags, config: Config) {
    setProcessAndTermTitle('feature-to-md');

    if (!validateNodeVersion()) {
        throw new Error('Please use a Node.js version that satisfies the version specified in the engines field.');
    }

    if (args['--version']) {
        return console.log((require('../package.json') as PackageJson).version);
    }

    if (args['--help']) {
        return help();
    }

    if (!args._[0]) {
        return help();
    }

    /**
     * 1. Get input. replacing windows-style file separator with posix one
     */
    const pattern: string = args._[0].replace(/\\/g, '/');
    const globFiles = new GlobSync(pattern);


    const files = globFiles.found;

    const stdin = await getStdin();

    if (files.length === 0 && !stdin) {
        console.log('no files found for pattern: '+ pattern);
        return help();
    }

    /**
     * 2. Read config file and merge it into the config object.
     */

    if (args['--config-file']) {
        try {
            const configFile: Partial<Config> = require(path.resolve(args['--config-file']));

            config = {
                ...config,
                ...configFile,
            };
        } catch (error) {
            console.warn(chalk.red(`Warning: couldn't read config file: ${path.resolve(args['--config-file'])}`));
            console.warn(error instanceof SyntaxError ? error.message : error);
        }
    }

    /**
     * 3. set up target directory.
     */

    if (args['--targetdir']) {
        config.targetDir = args['--targetdir'];
    }

    /**
     * 4. Either process stdin or create a Listr task for each file.
     */

    if (stdin) {
        await featureToMd({ content: stdin }, config, args)
            .finally(async () => {
                console.log("done");
            })
            .catch((error: Error) => {
                throw error;
            });

        return;
    }


    const getListrTask = (file: string) => ({
        title: `generating Markdown from ${chalk.underline(file)}`,
        task: async () => featureToMd({ path: file }, config, args),
    });

    await new Listr(files.map(getListrTask), { concurrent: true, exitOnError: false })
        .run()
        .then(async () => {
            if (args['--watch']) {
                console.log(chalk.bgBlue('\n watching for changes \n'));

                const watchOptions = args['--watch-options']
                    ? (JSON.parse(args['--watch-options']) as WatchOptions)
                    : config.watch_options;

                watch(files, watchOptions).on('change', async (file) =>
                    new Listr([getListrTask(file)], { exitOnError: false }).run().catch(console.error),
                );
            } else {
                console.log("done");
            }
        })
        .catch((error: Error) => {
            /**
             * In watch mode the error needs to be shown immediately because the `main` function's catch handler will never execute.
             *
             * @todo is this correct or does `main` actually finish and the process is just kept alive because of the file server?
             */
            if (args['--watch']) {
                return console.error(error);
            }

            throw error;
        });
}
