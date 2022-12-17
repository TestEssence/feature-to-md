@example
Feature: Gherkin example
  This example is used for feature-to-md testing

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
    |<input>|<output>|
    |one|two|
    |two|"three"|
    |three|7even |
