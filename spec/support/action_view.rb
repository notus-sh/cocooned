# frozen_string_literal: true

module ActionViewHelper
  def container(string)
    Nokogiri::HTML(string).at('div')
  end
end

RSpec.configure do |config|
  # Include deprecation helpers in tests tagged as helper tests.
  config.include ActionViewHelper, :action_view
end
