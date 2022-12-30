# frozen_string_literal: true

module TagHelper
  def html(*args, **options, &block)
    tag = described_class.create(template, *(args + [form, try(:association)].compact), **options, &block)
    Nokogiri::HTML(tag.render)
  end

  def link(*args, **options, &block)
    html(*args, **options, &block).at('a')
  end

  alias tag link
end

RSpec.configure do |config|
  # Include deprecation helpers in tests tagged as helper tests.
  config.include TagHelper, :tag
end
