# frozen_string_literal: true

require 'cocooned/tags/base'

module Cocooned
  module Tags
    class Add < Base
      protected

      def html_classes
        super + %w[cocooned-add add_fields]
      end
    end
  end
end
