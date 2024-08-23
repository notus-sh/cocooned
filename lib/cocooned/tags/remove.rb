# frozen_string_literal: true

module Cocooned
  module Tags
    class Remove < Base # :nodoc:
      include Cocooned::TagsHelper::AssociationLabel

      def render(as: :link)
        template.safe_join([hidden_field, super])
      end

      protected

      def hidden_field
        form.hidden_field(:_destroy, value: marked_for_destruction?)
      end

      def html_classes
        super + %w[cocooned-remove remove_fields]
      end

      def html_data
        super.merge(cocooned_trigger: :remove, cocooned_persisted: persisted?)
      end

      def persisted?
        !!form.object.try(:persisted?)
      end

      def marked_for_destruction?
        !!form.object.try(:marked_for_destruction?)
      end
    end
  end
end
