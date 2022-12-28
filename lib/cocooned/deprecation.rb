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
  module Deprecated
    module Helpers
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
  end
end
