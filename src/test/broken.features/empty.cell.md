
<span class='gherkin_tag'>@example</span>
# Feature: Emty table cell 
This example is used for feature-to-md testing
 

<span class='gherkin_tag'>@example, @scenario, @invalid</span>

## Scenario: scenario with empty table should be parsed
 
```gherkin
"""
This is a simple Scenario Outline example
"""
Given the application is started
```

| empty |
| --- |
|       |
```gherkin
When someone uses single cell table for unknown reason:
```

| single  |
| --- |
```gherkin
And  someone uses empty  cell table for unknown reason:
```

| |
| --- |
```gherkin
Then "feature-to-md" DOES not hang

When the requested function is invoked with <input>
Then the result is <output>
```
