# frozen_string_literal: true

module Cocooned
  module Helpers
    module Tags
      module Remove
        # Output an action link to remove an item (and an hidden field to mark
        # it as destroyed if it has already been persisted).
        #
        # ==== Signatures
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
        # ==== Parameters
        #
        # `label` is the text to be used as the link label. See the main documentation
        # for Cocooned::Helpers for more about labelling an action link.
        #
        # `form` is your form builder. Can be a SimpleForm::Builder, Formtastic::Builder
        # or a standard Rails FormBuilder.
        #
        # See the documentation of +link_to+ for valid options.
        def cocooned_remove_item_link(*args, &block)
          cocooned_link(Cocooned::Tags::Remove, *args, &block)
        end
      end
    end
  end
end
