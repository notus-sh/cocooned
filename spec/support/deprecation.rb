# frozen_string_literal: true

module DeprecationHelper
  def with_deprecation_as_exception(deprecator)
    behavior = deprecator.behavior
    begin
      deprecator.behavior = :raise
      yield
    ensure
      deprecator.behavior = behavior
    end
  end
end

RSpec.configure do |config|
  # Disable deprecation warnings in all tests
  # Due to use of specific per-future-release deprecator, we have to silence each of them.
  config.before(:all) do
    Cocooned::Deprecation['4.0'].behavior = :silence
  end

  # Include deprecation helpers in tests tagged with `deprecation: 'version'`.
  config.include DeprecationHelper, :deprecation
end
