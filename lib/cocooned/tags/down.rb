# frozen_string_literal: true

module Cocooned
  module Tags
    class Down < Base # :nodoc:
      protected

      def html_classes
        super + %w[cocooned-move-down]
      end
    end
  end
end
