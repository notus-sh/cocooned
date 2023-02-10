# frozen_string_literal: true

module Cocooned
  module Tags
    class Base # :nodoc:
      include Cocooned::TagsHelper::DefaultLabel
      include Cocooned::Deprecated::TagsHelper::DefaultLabel

      include Cocooned::TagsHelper::DataAttributes
      include Cocooned::Deprecated::TagsHelper::DataAttributes

      class << self
        def create(template, *args, **kwargs, &block)
          return new(template, *args, **kwargs, &block) if block_given?
          return new(template, *args, **kwargs) unless args.first.is_a?(String)

          label = args.shift
          new(template, *args, **kwargs) { label }
        end
      end

      def initialize(template, form, **options, &block)
        @template = template
        @form = form
        @options = options.dup.symbolize_keys
        @label_block = block if block_given?
      end

      def render(as: :link)
        return template.link_to('#', html_options) { label } if as == :link
        return form.button(html_options) { label } if as == :button

        raise ArgumentError, "Unsupported value for :as. Expected :link or :button, got #{as}."
      end

      protected

      attr_reader :template, :form, :options, :label_block

      def label
        return default_label if label_block.blank?

        label_block.call
      end

      def html_options
        @html_options ||= begin
          options[:class] = html_classes
          options[:data] = html_data
          options.compact_blank
        end
      end

      def html_classes
        Array.wrap(options.delete(:class)).flat_map { |k| k.to_s.split(' ') }.compact_blank
      end
    end
  end
end
