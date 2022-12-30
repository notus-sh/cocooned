# frozen_string_literal: true

module Cocooned
  module Tags
    class Down < Base # :nodoc:
      include Cocooned::TagsHelper::AssociationLabel

      protected

      def html_classes
        super + %w[cocooned-move-down]
      end
    end
  end
end
