# frozen_string_literal: true

module Cocooned
  module Helpers
    module Tags
      module Down
        # Output an action link to move an item down.
        #
        # ==== Signatures
        #
        #   cocooned_move_item_down_link(label, form, options = {})
        #     # Explicit name
        #
        #   cocooned_move_item_down_link(form, options = {}) do
        #     # Name as a block
        #   end
        #
        #   cocooned_move_item_down_link(form, options = {})
        #     # Use default name
        #
        # ==== Parameters
        #
        # `label` is the text to be used as the link label. See the main documentation
        # for Cocooned::Helpers for more about labelling an action link.
        #
        # `form` is your form builder. Can be a SimpleForm::Builder, Formtastic::Builder
        # or a standard Rails FormBuilder.
        #
        # See the documentation of +link_to+ for valid options.
        def cocooned_move_item_down_link(*args, &block)
          cocooned_link(Cocooned::Tags::Down, *args, &block)
        end
      end
    end
  end
end
