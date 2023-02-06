# frozen_string_literal: true

module Cocooned
  module Tags
    class Add < Base # :nodoc:
      module AssociationOptions # :nodoc:
        protected

        def association_options
          {
            association: association,
            template: html_template_name,
            association_insertion_count: [options.delete(:count).to_i, 1].compact.max,
            association_insertion_node: options.delete(:insertion_node),
            association_insertion_method: options.delete(:insertion_method),
            association_insertion_traversal: options.delete(:insertion_traversal)
          }.compact_blank
        end
      end

      include Cocooned::TagsHelper::AssociationLabel

      include Cocooned::TagsHelper::Renderer
      include Cocooned::Deprecated::TagsHelper::Renderer
      include AssociationOptions
      include Cocooned::Deprecated::TagsHelper::AssociationOptions

      def initialize(template, form, association, **options, &block)
        @association = association
        super(template, form, **options, &block)
      end

      def render
        template.safe_join([super, html_template])
      end

      protected

      attr_reader :association

      def html_template
        template.content_tag(:template, data: { name: html_template_name }) do
          renderer.render.html_safe # rubocop:disable Rails/OutputSafety
        end
      end

      def html_template_name
        @html_template_name ||= SecureRandom.uuid
      end

      def html_classes
        super + %w[cocooned-add add_fields]
      end

      def html_data
        super.merge(association_options, cocooned_trigger: :add)
      end
    end
  end
end
