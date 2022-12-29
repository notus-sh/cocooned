# frozen_string_literal: true

module Cocooned
  module Association
    class Renderer
      attr_reader :template, :builder, :options

      def initialize(template, builder, options = {})
        @template = template
        @builder = builder
        @options = options
      end

      def render
        builder.form.public_send(form_method, association, object, form_options) do |form|
          template.render(partial_name, form_name => form, dynamic: true, **(options.delete(:locals) || {}))
        end
      end

      protected

      delegate :association, to: :builder, private: true

      def object
        builder.build_object
      end

      def form_method
        ancestors = builder.form.class.ancestors.map(&:to_s)
        if ancestors.include?('SimpleForm::FormBuilder')
          :simple_fields_for
        elsif ancestors.include?('Formtastic::FormBuilder')
          :semantic_fields_for
        else
          :fields_for
        end
      end

      def form_options
        (options.delete(:form_options) || {}).symbolize_keys.reverse_merge!(child_index: "new_#{association}")
      end

      def form_name
        options.delete(:form_name).to_sym
      end

      def partial_name
        options.delete(:partial) || "#{builder.singular_name}_fields"
      end
    end
  end
end
