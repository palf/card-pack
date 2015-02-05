Then(/^I track a '(\w+)' event$/) do |eventname|
  ga_pushes.should include(["_trackEvent", category, action, value])
end
