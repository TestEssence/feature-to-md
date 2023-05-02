@example
Feature: Emty table cell
      This example is used for feature-to-md testing

      @example @scenario @invalid
      Scenario: scenario with empty table should be parsed
      """
      This is a simple Scenario Outline example
      """
    Given the application is started
      | empty |
      |       |
    When someone uses single cell table for unknown reason:
    | single  |
    And  someone uses empty  cell table for unknown reason:
    | |
    Then "feature-to-md" DOES not hang
