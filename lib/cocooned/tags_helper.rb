# frozen_string_literal: true

module Cocooned
  module TagsHelper
    module DefaultLabel
      protected

      def default_label
        keys = default_label_i18n_keys.collect(&:to_sym) + [action.to_s.humanize]
        I18n.translate(keys.first, default: keys.drop(1))
      end

      def default_label_i18n_keys
        i18n_namespaces.collect { |ns| "#{ns}.defaults.#{action}" }
      end

      def i18n_namespaces
        %w[cocooned]
      end

      def action
        self.class.name.demodulize.underscore
      end
    end

    module AssociationLabel
      protected

      def default_label_i18n_keys
        super + i18n_namespaces.collect { |ns| "#{ns}.#{association}.#{action}" }
      end

      def association
        raise NotImplementedError, '#association must be defined in subclasses'
      end
    end

    module DataAttributes
      protected

      def html_data
        html_data_normalize(options.delete(:data) || {})
      end

      # Normalize keys as underscored symbol to ease future lookups (as we
      # won't need to check for dashed or underscored option names everytime)
      def html_data_normalize(data)
        data.each_with_object({}) do |(key, value), normalized|
          normalized[key.to_s.underscore.to_sym] = value
        end
      end
    end

    module Renderer
      protected

      def renderer
        Association::Renderer.new(template, form, builder, renderer_options)
      end

      def renderer_options
        extract_options(:locals, :partial, :form_name, :form_options)
      end

      def builder
        Association::Builder.new(form.object, association, builder_options)
      end

      def builder_options
        extract_options(:wrap_object, :force_non_association_create)
      end

      def extract_options(*names)
        names.each_with_object({}) do |name, extracted|
          extracted[name] = options.delete(name) if options.key?(name)
        end
      end
    end
  end
end
