# frozen_string_literal: true

module TagHelper
  def html(*args, **options, &block)
    tag_template = try(:template) || ActionView::Base.empty
    tag_form = try(:form) || double
    tag_association = try(:association)
    tag = described_class.create(tag_template, *(args + [tag_form, tag_association].compact), **options, &block)

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
