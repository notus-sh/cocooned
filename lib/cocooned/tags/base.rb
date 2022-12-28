# frozen_string_literal: true

module Cocooned
  module Tags
    class Base
      class << self
        def create(template, *args, **kwargs, &block)
          return new(template, *args, **kwargs, &block) if block_given?
          return new(template, *args, **kwargs) unless args.first.is_a?(String)

          label = args.shift
          new(template, *args, **kwargs) { label }
        end
      end

      attr_reader :template, :form, :options

      def initialize(template, form, **options, &block)
        @template = template
        @form = form
        @options = options.dup.with_indifferent_access
        @label_block = block if block_given?
      end

      def action
        self.class.name.demodulize.underscore
      end

      def render
        template.link_to('#', html_options) { label }
      end

      def label
        return default_label unless label_block.present?

        label_block.call
      end

      protected

      attr_reader :label_block

      def default_label
        keys = default_label_i18n_keys.collect(&:to_sym) + [action.to_s.humanize]
        I18n.translate(keys.first, default: keys.drop(1))
      end

      def default_label_i18n_keys
        ["cocooned.defaults.#{action}", "cocoon.defaults.#{action}"]
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

      def html_data
        options.delete(:data)
      end
    end
  end
end
