import { GherkinMarkdown } from './lib/gherkin.md';
import { promises as fs } from 'fs';
import { Config, defaultConfig } from './lib/config';
import { getDir, readFile } from './lib/path';

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
                                  featureSummaryTemplate: string | undefined){
    let gherkin = new GherkinMarkdown(
        text,
        scenarioFooterTemplate || "",
        featureSummaryTemplate || ""
    );
    let markdown =  gherkin.getMarkdown();

    if (filename) {
        if (filename === 'stdout') {
            process.stdout.write(markdown);
        } else {
            await fs.writeFile(filename, markdown);
        }
    }

    return filename;
}


export async function featureToMd(input: Input, config: Partial<Config> = {}): Promise<string> {
    if (!hasContent(input) && !hasPath(input)) {
        throw new Error('The input is missing one of the properties "content" or "path".');
    }

    if (!config.basedir) {
        config.basedir = 'path' in input ? getDir(input.path) : process.cwd();
    }

    if (!config.dest) {
        config.dest = '';
    }

    const mergedConfig: Config = {
        ...defaultConfig,
        ...config,
    };

    const featureFileContent =
        'content' in input
            ? input.content
            : await readFile(input.path, 'utf-8');
    const [markdown] = await Promise.all([convertFeatureToMd(featureFileContent,
        "tbd.md",
        config.scenarioFooterTemplate,
        config.featureSummaryTemplate
    )]);



    return markdown;
}

export default featureToMd;

export interface PackageJson {
    engines: {
        node: string;
    };
    version: string;
}


