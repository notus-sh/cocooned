# frozen_string_literal: true

require 'active_support/deprecation'

module Cocooned
  # Custom deprecator to use with ActiveSupport::Deprecation methods
  class Deprecation < ActiveSupport::Deprecation
    @deprecators = {}

    def self.[](deprecation_horizon = nil)
      @deprecators[deprecation_horizon] ||= new(deprecation_horizon)
    end

    def initialize(deprecation_horizon = nil, gem_name = 'Cocooned')
      deprecation_horizon ||= format('%<major>d.0', major: Gem::Version.new(Cocooned::VERSION).segments.first + 1)
      super(deprecation_horizon, gem_name)
    end
  end

  # Deprecated methods
  module Deprecated # :nodoc:
    module Helpers # :nodoc:
      # @deprecated: Please use {#cocooned_add_item_link} instead
      def link_to_add_association(*args, &block)
        cocooned_add_item_link(*args, &block)
      end
      deprecate link_to_add_association: 'Use :cocooned_add_link instead', deprecator: Deprecation['3.0']

      # @deprecated: Please use {#cocooned_remove_item_link} instead
      def link_to_remove_association(*args, &block)
        cocooned_remove_item_link(*args, &block)
      end
      deprecate link_to_remove_association: 'Use :cocooned_remove_item_link instead', deprecator: Deprecation['3.0']
    end

    module TagsHelper # :nodoc:
      module DefaultLabel # :nodoc:
        protected

        def i18n_namespaces
          return super unless I18n.exists?(:cocoon)

          Deprecation['3.0'].warn 'Support for the :cocoon i18n namespace will be removed in 3.0', caller_locations(3)
          super + %w[cocoon]
        end
      end

      module DataAttributes # :nodoc:
        protected

        # Compatibility with the old way to pass data attributes to Rails view helpers
        # Has we use the :data key (introduced in Rails 3.1), they will not be looked up.
        def html_data
          return super unless data_keys.size.positive?

          Deprecation['3.0'].warn 'Compatibility with options named data-* will be removed in 3.0', caller_locations(3)
          html_data_normalize super.merge(data_options)
        end

        def data_keys
          options.keys.select { |k| k.to_s.match?(/data[_-]/) }
        end

        def data_options
          data_keys.each_with_object({}) do |original_key, extracted|
            key = original_key.to_s.gsub(/^data[_-]/, '')
            extracted[key] = options.delete(original_key)
          end
        end
      end

      module AssociationOptions # :nodoc:
        protected

        def association_options
          if options.key? :insertion_traversal
            Deprecation['3.0'].warn 'Support for the :insertion8traversal will be removed in 3.0', caller_locations(3)
          end

          super
        end
      end

      module Renderer # :nodoc:
        protected

        def renderer_options
          return super unless options.key?(:render_options)

          Deprecation['3.0'].warn 'Support for :render_options will be removed in 3.0', caller_locations(3)
          legacy_options = options.delete(:render_options)

          super.tap do |opts|
            opts[:locals] = legacy_options.delete(:locals) if legacy_options.key?(:locals)
            opts[:form_options] = legacy_options
          end
        end
      end
    end
  end
end
