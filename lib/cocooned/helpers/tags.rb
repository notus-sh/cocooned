# frozen_string_literal: true

module Cocooned
  module Helpers
    # Cocooned tags helpers output action link to interact with a dynamic nested form.
    #
    # Each action has its dedicated helpers:
    #
    # - `cocooned_add_item_link` / `cocooned_add_item_button` to add an item
    # - `cocooned_remove_item_link` / `cocooned_remove_item_button` to remove
    #   an item
    # - `cocooned_move_item_up_link` / `cocooned_move_item_up_button` to move
    #   an item up (in a reorderable form)
    # - `cocooned_move_item_down_link` / `cocooned_move_item_down_link` to move
    #   an item down (in a reorderable form)
    #
    # Labelling action links
    #
    # The label of any action links can be given explicitly as helper's first
    # argument or as a block, just as you can do on ActionView's `link_to` or
    # similar helpers.
    #
    # Additionally, Cocooned helpers will lookup I18n translations for a default
    # label based on the action name (`add`, `remove`, `up`, `down`) and the
    # association name.
    #
    # For `add` action links, the association name used is the same as passed as
    # argument. On other action triggers, it is extracted from nested form
    # #object_name.
    #
    # You can declare default labels in your translation files with following
    # keys:
    #
    # - `cocooned.{association}.{action}` (Ex: `cocooned.items.add`)
    # - `cocooned.defaults.{action}`
    #
    # If no translation is found, the default label will be the humanized action
    # name.
    module Tags
      autoload :Add, 'cocooned/helpers/tags/add'
      autoload :Down, 'cocooned/helpers/tags/down'
      autoload :Remove, 'cocooned/helpers/tags/remove'
      autoload :Up, 'cocooned/helpers/tags/up'

      include Cocooned::Deprecated::Helpers::Tags

      protected

      def cocooned_link(klass, *args, &)
        options = args.extract_options!
        klass.create(self, *args, **options, &).render(as: :link)
      end

      def cocooned_button(klass, *args, &)
        options = args.extract_options!
        klass.create(self, *args, **options, &).render(as: :button)
      end
    end
  end
end
