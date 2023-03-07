# frozen_string_literal: true

module Cocooned
  module Helpers
    module Tags
      # Helpers to generate action triggers to add items in a nested form.
      #
      # = Signatures
      #
      #   {method}(label, form, association, options = {})
      #     # Explicit name
      #
      #   {method}(form, association, options = {}) do
      #     # Name as a block
      #   end
      #
      #   {method}(form, association, options = {})
      #     # Use default name
      #
      # = Parameters
      #
      # `label` is the text to be used as the link label. See the main
      # documentation for Cocooned::Helpers::Tags for more about labelling.
      #
      # `form` is your form builder. Can be a SimpleForm::Builder,
      # Formtastic::Builder or a standard Rails FormBuilder.
      #
      # `association` is the name of the nested association.
      # Ex: cocooned_add_item_link "Add an item", form, :items
      #
      # = Options
      #
      # `options` can be any of the following.
      #
      # Association options:
      #
      # - **insertion_method** : the method to be used to insert new items.
      #   Can be any of `before`, `after`, `append`, `prepend`, `replaceWith`.
      #   Defaults to `before`
      # - **insertion_node** : a CSS selector to match new items insertion node.
      #   Can be any CSS selector supported by `document.querySelector`.
      #   For compatibility with the original Cocoon:
      #   * 'this' is supported as a special value to use the trigger itself as
      #     insertion node.
      #   * If no value is specified, the trigger's parent will be used.
      # - **count**: how many item will be inserted on click.
      #   Defaults to 1.
      #
      # Rendering options:
      #
      # - **partial**: the nested form partial.
      #   Defaults to `{association.singular_name}_fields`.
      # - **form_name**: name used to access the form builder in the nested form
      #   partial. Defaults to `:f`.
      # - **form_options**: options to be passed to the nested form builder. Can
      #   be used to specify a wrapper for simple_form_fields if you use its
      #   Bootstrap setup, for example. No defaults.
      # - **locals**: a hash of local variables to forward to the partial. No
      #   default.
      #
      # Building options:
      #
      # - **wrap_object**: anything responding to `call` to be used to wrap the
      #   newly build item instance. Can be useful with decorators or special
      #   initialisations. No default.
      #   Ex:
      #     cocooned_add_item_link "Add an item", form, :items,
      #       wrap_object: Proc.new { |comment| CommentDecorator.new(comment) })
      # - **force_non_association_create**: force to build instances of the
      #   nested model without calling association build methods
      #   (`build_{association}` or `{association}.build`). Can be usefull if,
      #   for some specific reason, you need an object to _not_ be created on
      #   the association, for example if you did not want `after_add` callbacks
      #   to be triggered. Defaults to false.
      #
      # Compatibility options:
      #
      # These options are supported for backward compatibility with the original
      # Cocoon. **Support for these options will be removed in the next major
      # release !**.
      #
      # - **insertion_traversal**: a jQuery DOM traversal method name to use in
      #   combination with **insertion_node** to find the insertion node from
      #   the trigger. Can be any of `closest`, `parent`, `prev`, `next` or
      #   `siblings`.
      #   Expressed in jQuery pseudo-code, the insertion node will be determined
      #   as the result of `$(trigger).{traversal}({insertion_node})`.
      # - **render_options**: A nested Hash originally used to pass locals and form
      #   builder options.
      module Add
        # Output a link to add an item in a nested form.
        #
        # = Signatures
        #
        #   cocooned_add_item_link(label, form, association, options = {})
        #     # Explicit name
        #
        #   cocooned_add_item_link(form, association, options = {}) do
        #     # Name as a block
        #   end
        #
        #   cocooned_add_item_link(form, association, options = {})
        #     # Use default name
        #
        # See Cocooned::Helpers::Tags::Add main documentation for a reference of
        # supported parameters.
        #
        # See the documentation of +ActionView::Base#link_to+ for additional
        # options.
        def cocooned_add_item_link(*args, &block)
          cocooned_link(Cocooned::Tags::Add, *args, &block)
        end

        # Output a button to add an item in a nested form.
        #
        # = Signatures
        #
        #   cocooned_add_item_button(label, form, association, options = {})
        #     # Explicit name
        #
        #   cocooned_add_item_button(form, association, options = {}) do
        #     # Name as a block
        #   end
        #
        #   cocooned_add_item_button(form, association, options = {})
        #     # Use default name
        #
        # See Cocooned::Helpers::Tags::Add main documentation for a reference of
        # supported options.
        def cocooned_add_item_button(*args, &block)
          cocooned_button(Cocooned::Tags::Add, *args, &block)
        end
      end
    end
  end
end
