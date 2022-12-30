# frozen_string_literal: true

module Cocooned
  module Association
    class Renderer # :nodoc:
      def initialize(template, form, association, object, options = {})
        @template = template
        @form = form
        @association = association
        @object = object
        @options = options.dup.symbolize_keys
      end

      def render
        form.public_send(form_method, association, object, form_options) do |form|
          template.render(partial, **render_options(form))
        end
      end

      protected

      attr_reader :template, :form, :association, :object, :options

      def singular_association
        association.to_s.singularize
      end

      def form_method
        ancestors = form.class.ancestors.map(&:to_s)
        return :simple_fields_for if ancestors.include?('SimpleForm::FormBuilder')
        return :semantic_fields_for if ancestors.include?('Formtastic::FormBuilder')

        :fields_for
      end

      def form_options
        options.fetch(:form_options, {}).symbolize_keys.reverse_merge(child_index: "new_#{singular_association}")
      end

      def partial
        options.fetch(:partial, "#{singular_association}_fields")
      end

      def render_options(form)
        options.fetch(:locals, {}).merge(form_name => form)
      end

      def form_name
        options.fetch(:form_name, :f).to_sym
      end
    end
  end
end
