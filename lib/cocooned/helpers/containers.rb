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
      def cocooned_container(*args, &)
        options = args.extract_options!.dup
        name = args.shift || :div

        content_tag(name, *args, **cocooned_container_options(options), &)
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
      def cocooned_item(*args, &)
        options = args.extract_options!.dup
        name = args.shift || :div

        content_tag(name, *args, **cocooned_item_options(options), &)
      end

      protected

      def cocooned_container_options(options)
        options.deep_merge(
          class: token_list(options.delete(:class), %w[cocooned-container]),
          data: {
            controller: [options.dig(:data, :controller), :cocooned].compact_blank.map(&:to_s).join(' '),
            cocooned_container: true,
            cocooned_options: options.extract!(:limit, :reorderable).to_json
          }
        )
      end

      def cocooned_item_options(options)
        options.deep_merge(
          class: token_list(options.delete(:class), %w[cocooned-item nested-fields]),
          data: {
            cocooned_item: true
          }
        )
      end
    end
  end
end
