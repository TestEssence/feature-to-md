@example
Feature: Second Gherkin Example

  *This example is used for feature-to-md testing*
  | makrdown table |
  | -- |
  | one |
  | one |
  | one |

  Background: setup
    Given setup is set up

  @example @scenario
  Scenario Outline: Application should perform the requested function
      """
      This is a simple Scenario Outline example
      """
    Given the application is started
      And the inputs are provided
    When the requested function is invoked with <input>
    Then the result is <output>
    Examples: inputs/outputs
      | <input> | <output> |
      | one     | two      |
      | two     | "three"  |
      | three   | 7even    |

@one @two
  Scenario Outline: One two three 
    Given one
    When two
      And three
    Then six
Examples: inputs/outputs
      | <input> | <output> |
      | one     | two      |
      | two     | "three"  |
      | three   | 7even    |