# frozen_string_literal: true

module Cocooned
  module Helpers
    module Tags
      # Output an action link to move an item up.
      #
      # = Signatures
      #
      #   cocooned_move_item_up_link(label, form, options = {})
      #     # Explicit name
      #
      #   cocooned_move_item_up_link(form, options = {}) do
      #     # Name as a block
      #   end
      #
      #   cocooned_move_item_up_link(form, options = {})
      #     # Use default name
      #
      # = Parameters
      #
      # `label` is the text to be used as the link label. See the main
      # documentation for Cocooned::Helpers::Tags for more about labelling.
      #
      # `form` is your form builder. Can be a SimpleForm::Builder,
      # Formtastic::Builder or a standard Rails FormBuilder.
      module Up
        # Output a link to move an item up.
        #
        # = Signatures
        #
        #   cocooned_move_item_up_link(label, form, options = {})
        #     # Explicit name
        #
        #   cocooned_move_item_up_link(form, options = {}) do
        #     # Name as a block
        #   end
        #
        #   cocooned_move_item_up_link(form, options = {})
        #     # Use default name
        #
        # See Cocooned::Helpers::Tags::Up main documentation for a reference of
        # supported parameters.
        #
        # See the documentation of +ActionView::Base#link_to+ for additional
        # options.
        def cocooned_move_item_up_link(...)
          cocooned_link(Cocooned::Tags::Up, ...)
        end

        # Output a button to move an item up.
        #
        # = Signatures
        #
        #   cocooned_move_item_up_button(label, form, options = {})
        #     # Explicit name
        #
        #   cocooned_move_item_up_button(form, options = {}) do
        #     # Name as a block
        #   end
        #
        #   cocooned_move_item_up_button(form, options = {})
        #     # Use default name
        #
        # See Cocooned::Helpers::Tags::Up main documentation for a reference of
        # supported parameters.
        #
        # See the documentation of +ActionView::Helpers::FormBuilder#button+ for
        # valid options.
        def cocooned_move_item_up_button(...)
          cocooned_button(Cocooned::Tags::Up, ...)
        end
      end
    end
  end
end
