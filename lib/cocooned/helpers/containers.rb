# frozen_string_literal: true

module Cocooned
  module Helpers
    # Cocooned containers helpers output container or item wrappers as expected by
    # the JavaScript companion package.
    module Containers
      # Wrap content with the expected markup for a Cocooned container.
      #
      # This is a wrapper around `ActionView::Base#content_tag` to automatically
      # add default classes and data-attributes that define a Cocooned
      # container.
      #
      # = Signatures
      #
      #   cocooned_container(*arguments, **options) do
      #     # Container content
      #   end
      #
      # = Parameters
      #
      # `cocooned_container` supports following options:
      #
      # - `:limit` [Integer]
      #   Enable the limit plugin and set the accepted maximum number of items
      # - `:reorderable` [Boolean|Hash]
      #   Enable the reorderable plugin. When a boolean, use plugin's default.
      #   You can also pass a Hash with explicit options (ex: `{ startAt: 1 }`).
      #
      # Any other argument or option supported by `ActionView::Base#content_tag`
      # will be forwarded.
      def cocooned_container(*args, &block)
        options = args.extract_options!.dup
        name = args.shift || :div
        defaults = cocooned_wrapper_defaults(options, %w[cocooned-container], :'cocooned-container')
        defaults[:data][:cocooned_options] = options.extract!(:limit, :reorderable).to_json

        content_tag(name, *args, **options.deep_merge(defaults), &block)
      end

      # Wrap content with the expected markup for a Cocooned item.
      #
      # This is a wrapper around `ActionView::Base#content_tag` to automatically
      # add default classes and data-attributes that define a Cocooned item.
      #
      # = Signatures
      #
      #   cocooned_item(*arguments, **options) do
      #     # Item content
      #   end
      #
      # = Parameters
      #
      # Any argument or option supported by `ActionView::Base#content_tag` will
      # be forwarded.
      def cocooned_item(*args, &block)
        options = args.extract_options!.dup
        name = args.shift || :div
        defaults = cocooned_wrapper_defaults(options, %w[cocooned-item nested-fields], :'cocooned-item')

        content_tag(name, *args, **options.deep_merge(defaults), &block)
      end

      protected

      def cocooned_wrapper_defaults(options, additional_classes, mark)
        # TODO: Replace with compact_blank when dropping support for Rails 6.0
        classes = Array.wrap(options.delete(:class)).flat_map { |k| k.to_s.split }.reject(&:blank?)

        { class: (classes + additional_classes), data: { mark => true } }
      end
    end
  end
end
