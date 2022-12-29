# frozen_string_literal: true

module Cocooned
  module Tags
    class Add < Base
      include Cocooned::TagsHelper::Renderer
      include Cocooned::Deprecated::TagsHelper::Renderer

      def initialize(template, form, association, **options, &block)
        @association = association
        super(template, form, **options, &block)
      end

      protected

      attr_reader :association

      def html_classes
        super + %w[cocooned-add add_fields]
      end

      def html_data
        super.merge(association_options)
      end

      def association_options
        {
          association: association,
          association_insertion_count: [options.delete(:count).to_i, 1].compact.max,
          association_insertion_node: options.delete(:insertion_node),
          association_insertion_method: options.delete(:insertion_method),
          association_insertion_traversal: options.delete(:insertion_traversal),
          association_insertion_template: CGI.escapeHTML(renderer.render).html_safe
        }.compact
      end

      def default_label_i18n_keys
        super + i18n_namespaces.collect { |ns| "#{ns}.#{association}.#{action}" }
      end
    end
  end
end
