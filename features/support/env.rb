require 'capybara/cucumber'
require 'capybara/poltergeist'
require 'json'

Capybara.app_host = 'localhost:3000'
Capybara.default_selector = :css
Capybara.default_driver = :poltergeist
Capybara.javascript_driver = :poltergeist

APP_PATH = 'http://localhost:3000'
@app_query = ''

Before('@debug') do
  @app_query = '?debug'
end

