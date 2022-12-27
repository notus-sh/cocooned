# frozen_string_literal: true

require 'cocooned/tags/base'

module Cocooned
  module Tags
    class MoveUp < Base
      protected

      def html_classes
        super + %w[cocooned-move-up]
      end
    end
  end
end
