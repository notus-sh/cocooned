# frozen_string_literal: true

module Cocooned
  module TagsHelper # :nodoc:
    module DefaultLabel # :nodoc:
      protected

      def default_label
        keys = default_label_i18n_keys.collect(&:to_sym) + [action.to_s.humanize]
        I18n.t(keys.first, default: keys.drop(1))
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

    module AssociationLabel # :nodoc:
      protected

      def default_label_i18n_keys
        super + i18n_namespaces.collect { |ns| "#{ns}.#{association}.#{action}" }
      end

      # Extract association name from form's object_name.
      # Ex: 'items' from 'list[items_attributes][0]'
      def association
        matches = form.object_name.scan(/\[([^\]]+)\]\[[^\]]+\]\z/).flatten
        return matches.first.delete_suffix('_attributes') if matches.size.positive?

        form.object.class.to_s.tableize
      end
    end

    module DataAttributes # :nodoc:
      protected

      def html_data
        html_data_normalize(options.delete(:data) || {})
      end

      # Normalize keys as underscored symbol to ease future lookups (as we
      # won't need to check for dashed or underscored option names everytime)
      def html_data_normalize(data)
        data.transform_keys { |key| key.to_s.underscore.to_sym }
      end
    end

    module Renderer # :nodoc:
      protected

      def renderer
        Association::Renderer.new(template, form, association, builder.build, renderer_options)
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
