# frozen_string_literal: true

module Cocooned
  module Tags
    class Up < Base # :nodoc:
      include Cocooned::TagsHelper::AssociationLabel

      protected

      def html_classes
        super + %w[cocooned-move-up]
      end

      def html_data
        super.merge(cocooned_trigger: :up)
      end
    end
  end
end
