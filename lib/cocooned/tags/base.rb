# frozen_string_literal: true

module Cocooned
  module Tags
    class Base
      class << self
        def create(template, default_label, *args, **kwargs, &block)
          return new(template, template.capture(&block), *args, **kwargs) if block_given?
          return new(template, default_label, *args, **kwargs) unless args.first.is_a?(String)

          new(template, *args, **kwargs)
        end
      end

      attr_reader :template, :label, :form, :options

      def initialize(template, label, form, **options)
        @template = template
        @label = label
        @form = form
        @options = options.dup.with_indifferent_access
      end

      def render
        template.link_to label, '#', html_options
      end

      protected

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

      def html_data
        options.delete(:data)
      end
    end
  end
end
