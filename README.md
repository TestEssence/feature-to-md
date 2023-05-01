[![StandWithUkraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md)

# Feature to Markdown

CLI for converting  Gherkin (.feature files) to Markdown format.

## Highlights

Generates a Markdown document from Gherkin with the following features:

- Table formatting
- Document template (Header and Footer) customization
- Feature Summary (Feature Summary Template) and Scenario Footer (Scenario Footer Template) customization

You can use other converters like [md-to-pdf](https://www.npmjs.com/package/md-to-pdf) to convert the resulting markdown into pdf or other formats you like  

## Installation

```sh
npm i -g feature-to-md
```

## Update

If you installed via npm, run npm i -g feature-to-md@latest in your CLI.

## Usage

```sh
$ feature-to-md [options] path/to/file.feature

Options:

-h, --help ............... Output usage information
-v, --version ............ Output version
--targetDir .............. Target directory for output files (note all files will be placed into the same directory  )
--config-file ............ Path to a JSON or JS configuration file
--scenario-footer-template ......... markdown (or html) snippet that is inserted after each scenario 
--feature-summary-template ......... markdown (or html) snippet that is appended to the feature abstract 
--debug ......... turn debug mode on
```

The markdown is generated into the same directory as the source file and uses the same filename (with .md extension) by default.
Multiple files can be specified by using shell globbing, e. g.:

```sh
feature-to-md [options] ./**/*.feature
```

## License

[MIT](/LICENSE)
