[![StandWithUkraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md)
# Feature to Markdown
CLI for converting  Gherkin (.feature files) to Markdown format. 

## Highlights
Generates a Markdown document from Gherkin with the following features:
- Table formatting
- Document template (Header and Footer) customization
- Feature Summary (Feature Summary Template) and Scenario Footer (Scenario Footer Template) customization

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
-w, --watch .............. Watch the current file(s) for changes
--config-file ............ Path to a JSON or JS configuration file
--scenario-footer-template ......... markdown (or html) snippet that is inserted after each scenario 
--feature-summary-template ......... markdown (or html) snippet that is appended to the feature abstract 
```

The markdown is generated into the same directory as the source file and uses the same filename (with .pdf extension) by default.
Multiple files can be specified by using shell globbing, e. g.:
```sh
feature-to-md [options] ./**/*.feature
```

## License

[MIT](/license).
