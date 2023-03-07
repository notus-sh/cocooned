# frozen_string_literal: true

module Cocooned
  module Helpers
    module Tags
      # Helpers to generate action triggers to move items down in a nested form.
      #
      # = Signatures
      #
      #   {method}(label, form, options = {})
      #     # Explicit name
      #
      #   {method}(form, options = {}) do
      #     # Name as a block
      #   end
      #
      #   {method}(form, options = {})
      #     # Use default name
      #
      # = Parameters
      #
      # `label` is the text to be used as the link label. See the main
      # documentation for Cocooned::Helpers::Tags for more about labelling.
      #
      # `form` is your form builder. Can be a SimpleForm::Builder,
      # Formtastic::Builder or a standard Rails FormBuilder.
      module Down
        # Output a link to move an item down.
        #
        # = Signatures
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
        # See Cocooned::Helpers::Tags::Down main documentation for a reference
        # of supported parameters.
        #
        # See the documentation of +ActionView::Base#link_to+ for additional
        # options.
        def cocooned_move_item_down_link(*args, &block)
          cocooned_link(Cocooned::Tags::Down, *args, &block)
        end

        # Output a button to move an item down.
        #
        # = Signatures
        #
        #   cocooned_move_item_down_button(label, form, options = {})
        #     # Explicit name
        #
        #   cocooned_move_item_down_button(form, options = {}) do
        #     # Name as a block
        #   end
        #
        #   cocooned_move_item_down_button(form, options = {})
        #     # Use default name
        #
        # See Cocooned::Helpers::Tags::Add main documentation for a reference of
        # supported parameters.
        #
        # See the documentation of +ActionView::Helpers::FormBuilder#button+ for
        # valid options.
        def cocooned_move_item_down_button(*args, &block)
          cocooned_button(Cocooned::Tags::Down, *args, &block)
        end
      end
    end
  end
end
