# frozen_string_literal: true

module Cocooned
  module Helpers
    module Tags
      # Helpers to generate action triggers to remove items in a nested form.
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
      module Remove
        # Output a link to remove an item (and an hidden field to mark
        # it as destroyed if it has already been persisted).
        #
        # = Signatures
        #
        #   cocooned_remove_item_link(label, form, options = {})
        #     # Explicit name
        #
        #   cocooned_remove_item_link(form, options = {}) do
        #     # Name as a block
        #   end
        #
        #   cocooned_remove_item_link(form, options = {})
        #     # Use default name
        #
        # See Cocooned::Helpers::Tags::Remove main documentation for a reference
        # of supported parameters.
        #
        # See the documentation of +ActionView::Base#link_to+ for additional
        # options.
        def cocooned_remove_item_link(...)
          cocooned_link(Cocooned::Tags::Remove, ...)
        end

        # Output a button to remove an item (and an hidden field to mark
        # it as destroyed if it has already been persisted).
        #
        # = Signatures
        #
        #   cocooned_remove_item_link(label, form, options = {})
        #     # Explicit name
        #
        #   cocooned_remove_item_link(form, options = {}) do
        #     # Name as a block
        #   end
        #
        #   cocooned_remove_item_link(form, options = {})
        #     # Use default name
        #
        # See Cocooned::Helpers::Tags::Remove main documentation for a reference
        # of supported parameters.
        #
        # See the documentation of +ActionView::Base#link_to+ for additional
        # options.
        def cocooned_remove_item_button(...)
          cocooned_button(Cocooned::Tags::Remove, ...)
        end
      end
    end
  end
end
