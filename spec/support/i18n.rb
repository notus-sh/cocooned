# frozen_string_literal: true

RSpec.configure do |config|
  config.after(:each) { I18n.reload! }
end
