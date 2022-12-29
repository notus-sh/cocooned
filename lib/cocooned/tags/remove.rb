# frozen_string_literal: true

module Cocooned
  module Tags
    class Remove < Base
      include Cocooned::TagsHelper::AssociationLabel

      def render
        template.safe_join([hidden_field, super])
      end

      protected

      def hidden_field
        form.hidden_field(:_destroy, value: marked_for_destruction?)
      end

      def html_classes
        (super + %w[cocooned-remove remove_fields]).tap do |classes|
          classes << (new_record? ? :dynamic : :existing)
          classes << :destroyed if marked_for_destruction?
        end
      end

      # Extract association name from form's object_name.
      # Ex: 'items' from 'list[items_attributes][0]'
      def association
        matches = form.object_name.scan(/\[([^\]]+)\]\[[^\]]+\]\z/).flatten
        return matches.first.gsub(/_attributes\z/, '') if matches.size.positive?

        # TODO: Remove this fallback once helpers tests have been rewrote
        form.object.class.to_s.tableize
      end

      def new_record?
        !!form.object.try(:new_record?)
      end

      def marked_for_destruction?
        !!form.object.try(:marked_for_destruction?)
      end
    end
  end
end
