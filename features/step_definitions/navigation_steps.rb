When(/^I navigate to the '(\/.+)' page$/) do |route|
  visit(APP_PATH + route + @app_query)
end

Given(/^I am on the '(\/.+)' page$/) do |route|
  visit(route)
end

When(/^I click the '(.+)' button$/) do |buttontext|
  pending # express the regexp above with the code you wish you had
end

