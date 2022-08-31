export const defaultConfig: Config = {
    featureSummaryTemplate: "",
    scenarioFooterTemplate: "",
    basedir: process.cwd()
};

/**
 * In config keys, dashes of cli flag names are replaced with underscores.
 */
export type Config = BasicConfig;

interface BasicConfig {
    /**
     * Base directory to be served by the file server.
     */
    basedir: string;

    /**
     * Optional destination path for the output file.
     */
    dest?: string;

    scenarioFooterTemplate: string;

    featureSummaryTemplate: string;
}
