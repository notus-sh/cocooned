# frozen_string_literal: true

module Cocooned
  module Association
    class Renderer
      attr_reader :template, :builder, :form, :options

      def initialize(template, form, builder, options = {})
        @template = template
        @form = form
        @builder = builder
        @options = options.dup.symbolize_keys.reverse_merge(form_name: :f)
      end

      def render
        form.public_send(form_method, association, object, form_options) do |form|
          template.render(partial_name, form_name => form, dynamic: true, **(options.delete(:locals) || {}))
        end
      end

      protected

      delegate :association, to: :builder, private: true

      def object
        builder.build
      end

      def form_method
        ancestors = form.class.ancestors.map(&:to_s)
        if ancestors.include?('SimpleForm::FormBuilder')
          :simple_fields_for
        elsif ancestors.include?('Formtastic::FormBuilder')
          :semantic_fields_for
        else
          :fields_for
        end
      end

      def form_options
        (options.delete(:form_options) || {}).symbolize_keys.reverse_merge(child_index: "new_#{association}")
      end

      def form_name
        options.delete(:form_name).to_sym
      end

      def partial_name
        options.delete(:partial) || "#{association.to_s.singularize}_fields"
      end
    end
  end
end
