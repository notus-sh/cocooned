# frozen_string_literal: true

module Cocooned
  module Tags
    class Up < Base # :nodoc:
      protected

      def html_classes
        super + %w[cocooned-move-up]
      end
    end
  end
end
