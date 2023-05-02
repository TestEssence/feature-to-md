import { WatchOptions } from 'chokidar';

export const defaultConfig: Config = {
    featureSummaryTemplate: "",
    scenarioFooterTemplate: "",
    feature_file_encoding: "utf-8",
    targetDir: "",
    debugMode: false,
    highlightTags: true,
};

/**
 * In config keys, dashes of cli flag names are replaced with underscores.
 */
export type Config = BasicConfig;

interface BasicConfig {
    /**
     * Base directory to be served by the file server.
     */
    targetDir?: string;

    /**
     * Optional destination path for the output file.
     */
    dest?: string;

    scenarioFooterTemplate: string;
    feature_file_encoding: string;

    featureSummaryTemplate: string;
    debugMode: boolean;
    highlightTags: boolean;
    /**
     * Options to pass to Chokidar's `watch` call.
     *
     * This is specifically useful when running into issues when editor plugins trigger additional saves after the initial save.
     */
    watch_options?: WatchOptions;
}
