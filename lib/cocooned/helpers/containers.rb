# frozen_string_literal: true

module Cocooned
  module Helpers
    module Containers
      def cocooned_container(*args, &block)
        options = args.extract_options!.dup
        defaults = cocooned_wrapper_defaults(options, %w[cocooned-container], :'cocooned-container')
        defaults[:data][:cocooned_options] = options.extract!(:limit, :reorderable).to_json

        content_tag(:div, *args, **options.deep_merge(defaults), &block)
      end

      def cocooned_item(*args, &block)
        options = args.extract_options!.dup
        defaults = cocooned_wrapper_defaults(options, %w[cocooned-item nested-fields], :'cocooned-item')

        content_tag(:div, *args, **options.deep_merge(defaults), &block)
      end

      protected

      def cocooned_wrapper_defaults(options, additional_classes, mark)
        classes = Array.wrap(options.delete(:class)).flat_map { |k| k.to_s.split(' ') }.compact_blank

        { class: (classes + additional_classes), data: { mark => true } }
      end
    end
  end
end
