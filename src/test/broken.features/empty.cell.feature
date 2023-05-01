@example
Feature: Emty table cell
      This example is used for feature-to-md testing

      @example @scenario @invalid
      Scenario : scenario with empty table should be parsed
      """
      This is a simple Scenario Outline example
      """
    Given the application is started
      |  |
      And the inputs are provided
    When the requested function is invoked with <input>
    Then the result is <output>
