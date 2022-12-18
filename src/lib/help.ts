import chalk from 'chalk';

const helpText = `
  ${chalk('$ feature-to-md')} [options] path/to/file.feature

  ${chalk.dim('Options:')}

-h, --help ${chalk.dim('...............')} Output usage information
-v, --version ${chalk.dim('............')} Output version
-w, --watch ${chalk.dim('..............')} Watch the current file(s) for changes
--watch-options ${chalk.dim('..........')} Options for Chokidar's watch call
--targetdir ${chalk.dim('................')} target directory for output files
--config-file ${chalk.dim('............')} Path to a JSON or JS configuration file
--feature-file-encoding ${chalk.dim('.......')} Set the file encoding for the feature file
--scenario-footer-template ${chalk.dim('............')} markdown (or html) snippet that is inserted after each scenario 
--feature-summary-template ${chalk.dim('............')} markdown (or html) snippet that is appended to the feature abstract


  ${chalk.dim('Examples:')}

  ${chalk.gray('–')} Convert ./file.feature and save to ./file.md

  ${chalk.cyan('$ feature-to-md file.feature')}

  ${chalk.gray('–')} Convert all markdown files in current directory

  ${chalk.cyan('$ feature-to-md ./*.feature')}

  ${chalk.gray('–')} Convert all markdown files in current directory recursively

  ${chalk.cyan('$ feature-to-md ./**/*.feature')}
 
  ${chalk.gray('–')} Convert path/to/file.md with a different target directory (all files will be placed into the same directory)

 ${chalk.cyan('$ md-to-pdf path/to/file.md --targetdir path')}

`;

export const help = () => console.log(helpText);
