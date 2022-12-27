# frozen_string_literal: true

require 'cocooned/tags/base'

module Cocooned
  module Tags
    class MoveDown < Base
      protected

      def html_classes
        super + %w[cocooned-move-down]
      end
    end
  end
end
