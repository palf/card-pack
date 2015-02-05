When(/^I take a screenshot$/) do
  save_screenshot('./screenshot.png')
end

When(/^I wait for (\d+) second(?:s*)$/) do |delay|
  sleep(delay)
end

Transform(/^\d$/) do |value|
  value.to_i
end

