# frozen_string_literal: true

module TagHelper
  module LinkHelper
    def html(*args, **options, &block)
      tag = described_class.create(template, *(args + [form, try(:association)].compact), **options, &block)
      Nokogiri::HTML5.fragment(tag.render(as: :link))
    end

    def tag(*args, **options, &block)
      html(*args, **options, &block).at('a')
    end
  end

  module ButtonHelper
    def html(*args, **options, &block)
      tag = described_class.create(template, *(args + [form, try(:association)].compact), **options, &block)
      Nokogiri::HTML5.fragment(tag.render(as: :button))
    end

    def tag(*args, **options, &block)
      html(*args, **options, &block).at('button')
    end
  end
end

RSpec.configure do |config|
  config.include TagHelper::LinkHelper, tag: :link
  config.include TagHelper::ButtonHelper, tag: :button
end
