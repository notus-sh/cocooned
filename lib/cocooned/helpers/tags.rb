# frozen_string_literal: true

module Cocooned
  module Helpers
    # Cocooned tags helpers output action link to interact with a dynamic nested form.
    #
    # Each action has its dedicated helper:
    #
    # - `cocooned_add_item_link` to add an item
    # - `cocooned_remove_item_link` to remove an item
    # - `cocooned_move_item_up_link` to move an item up (in a reorderable form)
    # - `cocooned_move_item_down_link` to move an item down (in a reorderable form)
    #
    # Labelling action links
    #
    # The label of any action links can be given explicitly as helper's first argument
    # or as a block, just as you can do on ActionView's `link_to` or similar helpers.
    # Additionally, Cocooned helpers will lookup I18n translations for a default label
    # based on the action name (`add`, `remove`, `up`, `down`) and the association name.
    #
    # For `add` action links, the association name used is the same as passed as
    # argument. On other action links, it is extracted from nested form's
    # #object_name.
    #
    # You can declare default labels in your translation files with following keys:
    #
    # - `cocooned.{association}.{action}` (Ex: `cocooned.items.add`)
    # - `cocooned.defaults.{action}`
    #
    # If no translation is found, the default label will be the humanized action name.
    #
    # Link HTML options
    #
    # You can pass any option supported by +link_to+. It will be politely forwarded.
    # See the documentation of +link_to+ for more information.
    module Tags
      include Cocooned::Deprecated::Helpers::Tags

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
      #
      def cocooned_add_item_link(*args, &block)
        cocooned_link(Cocooned::Tags::Add, *args, &block)
      end

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

      # Output an action link to move an item up.
      #
      # ==== Signatures
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
      # ==== Parameters
      #
      # `label` is the text to be used as the link label. See the main documentation
      # for Cocooned::Helpers for more about labelling an action link.
      #
      # `form` is your form builder. Can be a SimpleForm::Builder, Formtastic::Builder
      # or a standard Rails FormBuilder.
      #
      # See the documentation of +link_to+ for valid options.
      def cocooned_move_item_up_link(*args, &block)
        cocooned_link(Cocooned::Tags::Up, *args, &block)
      end

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

      protected

      def cocooned_link(klass, *args, &block)
        options = args.extract_options!
        klass.create(self, *args, **options, &block).render
      end
    end
  end
end
