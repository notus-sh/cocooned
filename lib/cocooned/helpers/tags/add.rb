# frozen_string_literal: true

module Cocooned
  module Helpers
    module Tags
      module Add
        # Output an action link to add an item in a nested form.
        #
        # ==== Signatures
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
        # ==== Parameters
        #
        # `label` is the text to be used as the link label. See the main documentation
        # for Cocooned::Helpers for more about labelling an action link.
        #
        # `form` is your form builder. Can be a SimpleForm::Builder, Formtastic::Builder
        # or a standard Rails FormBuilder.
        #
        # `association` is the name of the nested association.
        # Ex: cocooned_add_item_link "Add an item", form, :items
        #
        # ==== Options
        #
        # `options` can be any of the following.
        #
        # Association options:
        #
        # - **insertion_method** : the jQuery method to be used to insert new items.
        #   Can be any of `before`, `after`, `append`, `prepend`, `replaceWith`.
        #   Defaults to `before`
        # - **insertion_traversal** and **insertion_node** : respectively the jQuery
        #   traversal method and the jQuery compatible selector that will be used to
        #   find the insertion node, relative to the generated link.
        #   When both are specified, `$(addLink).{traversal}({node})` will be used.
        #   When only **insertion_node** is specified, `$({node})` will be used.
        #   When only **insertion_traversal** is specified, it will be ignored.
        #   When none is specified, `$(addLink).parent()` will be used.
        # - **count**: how many item will be inserted on click.
        #   Defaults to 1.
        #
        # Rendering options:
        #
        # - **partial**: the nested form partial.
        #   Defaults to `{association.singular_name}_fields`.
        # - **form_name**: name used to access the form builder in the nested form partial.
        #   Defaults to `:f`.
        # - **form_options**: options to be passed to the nested form builder. Can be
        #   used to specify a wrapper for simple_form_fields if you use its Bootstrap
        #   setup, for example.
        #   No defaults.
        # - **locals**: a hash of local variables, will be forwarded to the partial.
        #   No default.
        #
        # Building options:
        #
        # - **wrap_object**: anything responding to `call` to be used to wrap the newly
        #   build item instance. Can be useful with decorators or special initialisations.
        #   Ex: cocooned_add_item_link "Add an item", form, :items,
        #         wrap_object: Proc.new { |comment| CommentDecorator.new(comment) })
        #   No default.
        # - **force_non_association_create**: force to build instances of the nested
        #   model outside association (i.e. without calling `build_{association}` or
        #   `{association}.build`). Can be usefull if, for some specific reason, you
        #   need an object to _not_ be created on the association, for example if you
        #   did not want `after_add` callbacks to be triggered.
        #   Defaults to false.
        #
        # Compatibility options:
        #
        # These options are supported for backward compatibility with the original Cocoon.
        # **Support for these options will be removed in the next major release !**.
        #
        # - **render_options**: A nested Hash originally used to pass locals and form
        #   builder options.
        def cocooned_add_item_link(*args, &block)
          cocooned_link(Cocooned::Tags::Add, *args, &block)
        end
      end
    end
  end
end
