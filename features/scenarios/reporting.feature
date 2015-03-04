@debug
Feature: Reporting
  As a site owner
  I want to track user behaviours in the application
  So I can better prioritise features

	Scenario: Tracking page views
		When I navigate to the '/solitaire' page
		And I wait for 5 seconds
		And I take a screenshot
		Then I track a 'pageview' event

	Scenario: Tracking new games
		Given I am on the '/solitaire' page
		When I click the 'New Game' button
		Then I track a 'newgame' event

	Scenario: Tracking restarting games
		Given I am on the '/solitaire' page
		When I click the 'Reset Game' button
		Then I track a 'resetgame' event

	Scenario: Tracking completing games
		Given I am on the '/solitaire' page
		When I complete the game
		Then I track a 'completegame' event

