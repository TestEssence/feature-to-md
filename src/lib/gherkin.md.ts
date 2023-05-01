/**
 * SimpleLogger implements base logger funtion to provide an ability to subsutute console with winston loggger 
 */
interface SimpleLogger {
        debug(...data: any[]): void;
        error(...data: any[]): void;
        info(...data: any[]): void;
        log(...data: any[]): void;
        warn(...data: any[]): void;
} 

export class GherkinMarkdown {
    private shouldCountScenario: boolean = false;
    private readonly featureCode: string;
    private readonly scenarioFooter: string;
    private readonly featureSummary: string;
    private readonly md: string = '';
    // @ts-ignore
    private scenariosNumber;
    // @ts-ignore
    private tablesNumber;
    private featureAbstract: string = '';
    private ScenarioNameWildcard = '{{SCENARIO_NAME}}';
    private logger: SimpleLogger;

    private regexpScenarioTitle =
        //   /(^\s*(Rule:|Background:|Scenario:|Scenario Outline:)(.*?)$)/gim;
        /(^((\s*@.*?)*)\s*(Rule:|Scenario:|Scenario Outline:)(.*?)$)/gim;

    private linebreakPlaceholder = '<LINEBREAK>';

    constructor(
        featureCode: string,
        scenarioFooter: string,
        featureSummary: string,
        logger:SimpleLogger = console,
    ) {
        this.logger = logger;
        this.featureCode = featureCode;
        this.featureSummary = featureSummary;
        this.scenariosNumber = 0;
        this.tablesNumber = 0;
        this.scenarioFooter = scenarioFooter;
        this.md = this.convertToMarkdown();
    }

    public getMarkdown() {
        return this.md;
    }

    private convertToMarkdown() {
        let text = this.featureCode;

        //removing all the leading spaces
        text = text.replace(/^[^\S\r\n]+(.*?)$/gm, '$1');
        text = this.extractFeatureAbstract(text);
        let scenarioCounter = 1;
        let previousScenarioName = '';
        let match;
        while ((match = this.regexpScenarioTitle.exec(text))) {
            const scenarioType = match[4] || '';
            const scenarioName = match[5] || '';
            const scenarioTags = match[2] || '';
            const scenarioHeader = match[1] || '';
            const scenarioCounterText = this.shouldCountScenario
                ? ` ${scenarioCounter}:`
                : '';
            let newScenarioHeader =
                `${GherkinMarkdown.formatTags(scenarioTags)}\r
## ${scenarioType}${scenarioCounterText}${scenarioName}`;
            if (scenarioCounter > 1 && this.scenarioFooter) {
                const footer = this.scenarioFooter.replace(
                    this.ScenarioNameWildcard,
                    previousScenarioName
                );
                newScenarioHeader = "\r\n" + footer + "\r\n" + newScenarioHeader;
            }

            text = text.replace(
                scenarioHeader,
                GherkinMarkdown.isolateFromGherkin(newScenarioHeader)
            );
            scenarioCounter++;
            previousScenarioName = scenarioName;
        }
        this.scenariosNumber = scenarioCounter - 1;
        text = `\`\`\`gherkin\r
${text}\`\`\``;

        text = text.replace(
            /^\s*(Background:.*?)$/gm,
            GherkinMarkdown.isolateFromGherkin('## $1')
        );
        text = text.replace(
            /^\s*(Examples:.*?)$/gm,
            GherkinMarkdown.isolateFromGherkin('### $1')
        );
        text = this.formatTables(text);
        // indent 'And' and 'But'
        text = text.replace(/^\s*(And|But)(.*?)$/gm, '\t$1$2');
        //add a footer to the last scenario
        if (this.scenarioFooter) {
            text +=
                `\r
${this.scenarioFooter.replace(
                    this.ScenarioNameWildcard,
                    previousScenarioName
                )}`;
        }
        text = GherkinMarkdown.removeEmptyGherkinBlocks(text);
        //restore feature abstract
        text = this.insertFeatureAbstract(text);

        return text;
    }

    private static removeEmptyGherkinBlocks(text: string) {
        text = text.replace(/^```gherkin\s*\r\n```/gim, '');
        text = text.replace(/(^```gherkin\r\n)\r\n/gim, '$1');
        text = text.replace(/\r\n(\r\n\r\n```)/gim, '$1');
        return text;
    }

    private static isolateFromGherkin(text: string) {
        return `\r
\`\`\`\r
${text} \r
\`\`\`gherkin\r
`;
    }

    private extractFeatureAbstract(text: string) {
        let result = text;
        this.logger.debug('// extractFeatureAbstract()');
        const regexFeatureTags = /^((\s*@.*?)*)\s*?Feature:/gs;
        let match = regexFeatureTags.exec(text);
        let tags = '';
        if (match) {
            this.logger.debug(`// extractFeatureAbstract() Tags:${match[1]}` || '');
            tags = GherkinMarkdown.formatTags(match[1] || '');
            //remove tags
            result = text.replace(regexFeatureTags, 'Feature:');
        }

        const regexpFeatureDescription = /\s*?((Feature:.*?$)(.*?))(?=^\s*?(Background:|Scenario:|Rule|Given|When|#|@|''"))/gsim;
        match = regexpFeatureDescription.exec(result);
        if (match) {
            this.logger.debug("// featureAbstract match:" + match[1] || '');
            this.featureAbstract = match[3] || '' + "\n";
            result = result.replace(regexpFeatureDescription, GherkinMarkdown.isolateFromGherkin(tags + "# $2 {{FEATURE_DESCRIPTION}}"));
            this.logger.debug("// extractFeatureAbstract() - Done.");
        } else {
            this.logger.debug("Feature Prefix not found");
        }
        return result;
    }

    private static formatTags(tagText: string) {
        let tags: string[] = [];
        const reg = new RegExp(/(@[\w-]+)/gim);
        let match;
        while ((match = reg.exec(tagText))) {
            tags.push(match[1] || '');
        }
        return tagText
            ? "<span class='gherkin_tag'>" + tags.join(", ") + "</span>\r\n"
            : '';
    }

    //highlight Feature as header and leave feature description as is
    private insertFeatureAbstract(text: string) {
        let featureAbstract = this.featureAbstract;
        if (this.featureSummary) {
            featureAbstract = `\r
${featureAbstract}\r
${this.featureSummary}\r
`;
        }
        return text.replace('{{FEATURE_DESCRIPTION}}', featureAbstract);
    }

    private formatTables(text: string) {
        let featureText = text.replace(
            /\|\s*$\s*\|/gim,
            `|${this.linebreakPlaceholder}|`
        );
        const tableRegex = /^\s*(\|.*?\|)\s*$/gim;
        let match;
        do {
            match = tableRegex.exec(featureText);
            if (match) {
                const tableText = match[1] || '';
                featureText = featureText.replace(
                    tableText,
                    this.formatTable(tableText)
                );
                this.tablesNumber++;
            }
        } while (match);
        return featureText;
    }

    private formatTable(tableText: string) {
        const tableRows = tableText.split(this.linebreakPlaceholder);
        if (tableRows.length == 0) {
            this.logger.debug('//table format seems to be broken...');
            return '';
        }
        let formattedTable = "\r\n```\r\n" + tableRows[0] + "\r\n";

        formattedTable +=
            GherkinMarkdown.getMdDividerRow(GherkinMarkdown.getColumnsNumber(tableRows[0] || '')) + "\r\n";
        for (let i = 1; i < tableRows.length; i++)
            formattedTable += `${tableRows[i]}\r\n`;
        return (`${formattedTable}\`\`\`gherkin\r\n`)
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    private static getMdDividerRow(columnsNumber: number) {
        let row = '|';
        for (let i = 0; i < columnsNumber; i++) {
            row += ' --- |';
        }
        return row;
    }

    private static getColumnsNumber(tableRow: string) {
        return (tableRow.match(/\|/g) || []).length - 1;
    }
}
