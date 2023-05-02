import { GherkinMarkdown } from './lib/gherkin.md';
import { promises as fs } from 'fs';
import { Config, defaultConfig } from './lib/config';
import { readFile } from './lib/path';
import {getOutputFilePath} from "./lib/functions";
import {MarkdownOutput} from "./lib/output";
import arg from "arg";
import { logger } from './lib/logger';

export const cliFlags = arg({
    '--help': Boolean,
    '--version': Boolean,
    '--watch': Boolean,
    '--watch-options': String,
    '--targetdir': String,
    '--config-file': String,
    '--feature-file-encoding': String,
    '--debug': Boolean,
// aliases
    '-h': '--help',
    '-v': '--version',
});

type CliArgs = typeof cliFlags;

type Input = ContentInput | PathInput;

interface ContentInput {
    content: string;
}

interface PathInput {
    path: string;
}

const hasContent = (input: Input): input is ContentInput => 'content' in input;
const hasPath = (input: Input): input is PathInput => 'path' in input;


/**
 * Convert a markdown file to PDF.
 */

async function convertFeatureToMd(text: string,
                                  filename: string,
                                  scenarioFooterTemplate: string | undefined,
                                  featureSummaryTemplate: string | undefined,
                                  highlightTags:boolean){
    let gherkin = new GherkinMarkdown(
        text,
        scenarioFooterTemplate || "",
        featureSummaryTemplate || "", 
        logger,
        highlightTags
    );
    let markdown =  gherkin.getMarkdown();

    if (filename) {
        if (filename === 'stdout') {
            process.stdout.write(markdown);
        } else {
            await fs.writeFile(filename, markdown);
        }
    }

    return  { filename: filename, content: markdown };
}

export const featureToMd = async(input: { path: string } | { content: string },
                                  config: Partial<Config> = {},
                                  args: CliArgs = {} as CliArgs): Promise<MarkdownOutput> => {
    if (!hasContent(input) && !hasPath(input)) {
        throw new Error('The input is missing one of the properties "content" or "path".');
    }
    const mergedConfig: Config = {
        ...defaultConfig,
        ...config,
    };

    logger.level = args['--debug'] || config.debugMode ? "debug" : "info";
    // @ts-ignore
    const featureFileContent =
        'content' in input
            ? input.content
            : await readFile(input.path, args['--feature-file-encoding'] ?? mergedConfig.feature_file_encoding);

    // set output destination
    if (mergedConfig.dest === undefined) {
        if ('path' in input) {
            logger.info("path:"+input.path);
            logger.debug(
            "getOutputFilePath: " +
              getOutputFilePath(mergedConfig.targetDir || "", input.path)
          );
        }
        mergedConfig.dest = 'path' in input ? getOutputFilePath(mergedConfig.targetDir|| "", input.path) : 'stdout';
    }


    logger.debug ("Destination: " + mergedConfig.dest);
    const [markdown] = await Promise.all([convertFeatureToMd(featureFileContent,
        mergedConfig.dest,
        mergedConfig.scenarioFooterTemplate,
        mergedConfig.featureSummaryTemplate,
        mergedConfig.highlightTags
    )]);

    return markdown;
}



export interface PackageJson {
    engines: {
        node: string;
    };
    version: string;
}


