# frozen_string_literal: true

module Cocooned
  module Association
    class Builder
      attr_accessor :association, :form, :options

      def initialize(form, association, options = {})
        self.form = form
        self.association = association
        self.options = options.reverse_merge(force_non_association_create: false, wrap_object: false)
      end

      def build_object
        model = reflection ? build_with_reflection : build_without_reflection
        model = @options[:wrap_object].call(model) if @options[:wrap_object].respond_to?(:call)
        model
      end

      def singular_name
        association.to_s.singularize
      end

      def plural_name
        association.to_s.pluralize
      end

      private

      def reflection
        @reflection ||= begin
          klass = form.object.class
          klass.respond_to?(:reflect_on_association) ? klass.reflect_on_association(association) : nil
        end
      end

      def build_with_reflection
        return build_with_conditions if should_use_conditions?

        # Assume ActiveRecord or compatible
        # We use a clone of the current form object to not link
        # object together (even if unsaved)
        dummy = form.object.dup
        model = if reflection.collection?
                  dummy.send(association).build
                else
                  dummy.send("build_#{association}")
                end
        model = model.dup if model.frozen?
        model
      end

      def build_without_reflection
        methods = %W[build_#{plural_name} build_#{singular_name}].select { |m| form.object.respond_to?(m) }
        raise "Association #{association} doesn't exist on #{form.object.class}" unless methods.any?

        form.object.send(methods.first)
      end

      def should_use_conditions?
        reflection.class.name.starts_with?('Mongoid::') || @options[:force_non_association_create]
      end

      def build_with_conditions
        conditions = reflection.respond_to?(:conditions) ? reflection.conditions.flatten : []
        reflection.klass.new(*conditions)
      end
    end
  end
end
