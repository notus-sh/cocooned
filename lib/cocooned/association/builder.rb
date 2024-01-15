# frozen_string_literal: true

module Cocooned
  module Association
    class Builder # :nodoc:
      attr_reader :association, :record

      def initialize(record, association, options = {})
        @record = record
        @association = association
        @options = options.dup.symbolize_keys.reverse_merge(force_non_association_create: false, wrap_object: false)
      end

      def build
        model = reflection ? build_with_reflection : build_without_reflection
        model = options[:wrap_object].call(model) if options[:wrap_object].respond_to?(:call)
        model
      end

      protected

      attr_reader :options

      def model
        record.class
      end

      def reflection
        @reflection ||= model.try(:reflect_on_association, association)
      end

      def build_with_reflection
        return build_with_conditions if should_use_conditions?

        # Assume ActiveRecord or compatible
        # We use a clone of the current form object to not link
        # object together (even if unsaved)
        dummy = record.dup
        model = if reflection.collection?
                  dummy.send(association).build
                else
                  dummy.send(:"build_#{association}")
                end
        model = model.dup if model.frozen?
        model
      end

      def build_without_reflection
        methods = %W[build_#{association.to_s.pluralize} build_#{association.to_s.singularize}]
        available_methods = methods.select { |m| record.respond_to?(m) }
        raise "Association #{association} doesn't exist on #{model}" unless available_methods.any?

        record.send(available_methods.first)
      end

      def should_use_conditions?
        reflection.class.name.starts_with?('Mongoid::') || options[:force_non_association_create]
      end

      def build_with_conditions
        conditions = reflection.respond_to?(:conditions) ? reflection.conditions.flatten : []
        reflection.klass.new(*conditions)
      end
    end
  end
end
