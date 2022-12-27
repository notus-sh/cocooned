# frozen_string_literal: true

require 'cocooned/options'
require 'cocooned/association_builder'

module Cocooned
  # TODO: Remove in 3.0 (Only Cocoon class names).
  HELPER_CLASSES = {
    add: %w[cocooned-add add_fields],
    remove: %w[cocooned-remove remove_fields],
    up: %w[cocooned-move-up],
    down: %w[cocooned-move-down]
  }.freeze

  module Helpers # rubocop:disable Metrics/ModuleLength
    include Cocooned::Deprecated::Helpers

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
    # `label` is the text to be used as the link label.
    # Just as when you use the Rails builtin helper +link_to+, you can give an explicit
    # label to your link or use a block to build it.
    # If you provide neither an explicit label nor a block, Cocooned will try to use I18n
    # to find a suitable label. This lookup will check the following keys:
    #
    # - `cocooned.{association}.add`
    # - `cocooned.defaults.add`
    #
    # If none of these translation exist, it will fallback to 'Add'.
    #
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
    # Rendering options:
    #
    # - **partial**: the nested form partial.
    #   Defaults to `{association.singular_name}_fields`.
    # - **form_name**: name used to access the form builder in the nested form partial.
    #   Defaults to `:f`.
    # - **form_options**: options to be passed to the nested form builder. Can be used
    #   to specify a wrapper for simple_form_fields if you use its Bootstrap setup, for
    #   example.
    #   No defaults.
    # - **locals**: a hash of local variables, will be forwarded to the partial.
    #   No default.
    #
    # Association options:
    #
    # - **insertion_method** : the jQuery method to be used to insert new items.
    #   Can be any of `before`, `after`, `append`, `prepend`, `replaceWith`.
    #   Defaults to `before`
    # - **insertion_traversal** and **insertion_node** : respectively the jQuery
    #   traversal method and the jQuery compatible selector that will be used to find
    #   the insertion node, relative to the generated link.
    #   When both are specified, `$(addLink).{traversal}({node})` will be used.
    #   When only **insertion_node** is specified, `$({node})` will be used.
    #   When only **insertion_traversal** is specified, it will be ignored.
    #   When none is specified, `$(addLink).parent()` will be used.
    # - **count**: how many item will be inserted on click.
    #   Defaults to 1.
    # - **wrap_object**: anything responding to `call` to be used to wrap the newly build
    #   item instance. Can be useful with decorators or special initialisations.
    #   Ex: cocooned_add_item_link "Add an item", form, :items,
    #         wrap_object: Proc.new { |comment| CommentDecorator.new(comment) })
    #   No default.
    # - **force_non_association_create**: force to build instances of the nested model
    #   outside association (i.e. without calling `build_{association}` or `{association}.build`)
    #   Can be usefull if, for some specific reason, you need an object to _not_ be created
    #   on the association, for example if you did not want `after_add` callbacks to be triggered.
    #   Defaults to false.
    #
    # Link HTML options:
    #
    # You can pass any option supported by +link_to+. It will be politely forwarded.
    # See the documentation of +link_to+ for more informations.
    #
    # Compatibility options:
    #
    # These options are supported for backward compatibility with the original Cocoon.
    # **Support for these options will be removed in the next major release !**.
    #
    # - **render_options**: A nested Hash originaly used to pass locals and form builder
    #   options.
    #
    def cocooned_add_item_link(*args, &block)
      if block_given?
        cocooned_add_item_link(capture(&block), *args)

      elsif args.first.respond_to?(:object)
        association = args.second
        cocooned_add_item_link(cocooned_default_label(:add, association), *args)

      else
        name, form, association, html_options = *args
        html_options ||= {}
        html_options = html_options.dup.with_indifferent_access

        builder_options = cocooned_extract_builder_options!(html_options)
        render_options = cocooned_extract_render_options!(html_options)

        builder = Cocooned::AssociationBuilder.new(form, association, builder_options)
        rendered = cocooned_render_association(builder, render_options)

        data = cocooned_extract_data!(html_options).merge!(
          association: builder.singular_name,
          associations: builder.plural_name,
          association_insertion_template: CGI.escapeHTML(rendered.to_str).html_safe
        )

        html_options[:data] = (html_options[:data] || {}).merge(data)
        html_options[:class] = [Array(html_options.delete(:class)).collect { |k| k.to_s.split(' ') },
                                Cocooned::HELPER_CLASSES[:add]].flatten.compact.uniq.join(' ')

        link_to(name, '#', html_options)
      end
    end

    # Output an action link to remove an item (and an hidden field to mark
    # it as destroyed if it has already been persisted).
    #
    # ==== Signatures
    #
    #   cocooned_remove_item_link(label, form, html_options = {})
    #     # Explicit name
    #
    #   cocooned_remove_item_link(form, html_options = {}) do
    #     # Name as a block
    #   end
    #
    #   cocooned_remove_item_link(form, html_options = {})
    #     # Use default name
    #
    # See the documentation of +link_to+ for valid options.
    def cocooned_remove_item_link(name, form = nil, html_options = {}, &block)
      # rubocop:disable Style/ParallelAssignment
      html_options, form = form, nil if form.is_a?(Hash)
      form, name = name, form if form.nil?
      # rubocop:enable Style/ParallelAssignment

      return cocooned_remove_item_link(capture(&block), form, html_options) if block_given?

      association = form.object.class.to_s.tableize
      return cocooned_remove_item_link(cocooned_default_label(:remove, association), form, html_options) if name.nil?

      destroy = form.object.respond_to?(:marked_for_destruction?) && form.object.marked_for_destruction?

      link_options = html_options.dup
      link_options[:class] = [html_options[:class], Cocooned::HELPER_CLASSES[:remove]].flatten.compact
      link_options[:class] << (form.object.respond_to?(:new_record?) && form.object.new_record? ? :dynamic : :existing)
      link_options[:class] << :destroyed if destroy.present?

      form.hidden_field(:_destroy, value: destroy) << link_to(name, '#', link_options)
    end

    # Output an action link to move an item up.
    #
    # ==== Signatures
    #
    #   cocooned_move_item_up_link(label, form, html_options = {})
    #     # Explicit name
    #
    #   cocooned_move_item_up_link(form, html_options = {}) do
    #     # Name as a block
    #   end
    #
    #   cocooned_move_item_up_link(form, html_options = {})
    #     # Use default name
    #
    # See the documentation of +link_to+ for valid options.
    def cocooned_move_item_up_link(name, form = nil, html_options = {}, &block)
      Tags::MoveUp.create(self, cocooned_default_label(:up), *[name, form].compact, **html_options, &block).render
    end

    # Output an action link to move an item down.
    #
    # ==== Signatures
    #
    #   cocooned_move_item_down_link(label, html_options = {})
    #     # Explicit name
    #
    #   cocooned_move_item_down_link(html_options = {}) do
    #     # Name as a block
    #   end
    #
    #   cocooned_move_item_down_link(html_options = {})
    #     # Use default name
    #
    # See the documentation of +link_to+ for valid options.
    def cocooned_move_item_down_link(name, form = nil, html_options = {}, &block)
      Tags::MoveDown.create(self, cocooned_default_label(:down), *[name, form].compact, **html_options, &block).render
    end

    private

    def cocooned_default_label(action, association = nil)
      # TODO: Remove in 3.0
      Cocooned::Deprecation['3.0'].warn('Support for the :cocoon I18n scope will be removed in 3.0') if I18n.exists?(:cocoon)

      keys = ["cocooned.defaults.#{action}", "cocoon.defaults.#{action}"]
      keys.unshift("cocooned.#{association}.#{action}", "cocoon.#{association}.#{action}") unless association.nil?
      keys.collect!(&:to_sym)
      keys << action.to_s.humanize

      I18n.translate(keys.take(1).first, default: keys.drop(1))
    end

    def cocooned_render_association(builder, options = {})
      render_options = options.dup
      locals = (render_options.delete(:locals) || {}).symbolize_keys
      partial = render_options.delete(:partial) || "#{builder.singular_name}_fields"
      form_name = render_options.delete(:form_name)
      form_options = (render_options.delete(:form_options) || {}).symbolize_keys
      form_options.reverse_merge!(child_index: "new_#{builder.association}")

      builder.form.send(cocooned_form_method(builder.form),
                        builder.association,
                        builder.build_object,
                        form_options) do |form_builder|
        partial_options = { form_name.to_sym => form_builder, :dynamic => true }.merge(locals)
        render(partial, partial_options)
      end
    end

    def cocooned_form_method(form)
      ancestors = form.class.ancestors.map(&:to_s)
      if ancestors.include?('SimpleForm::FormBuilder')
        :simple_fields_for
      elsif ancestors.include?('Formtastic::FormBuilder')
        :semantic_fields_for
      else
        :fields_for
      end
    end

    def cocooned_extract_builder_options!(html_options)
      Options.new(html_options).slice(:wrap_object, :force_non_association_create)
    end

    def cocooned_extract_render_options!(html_options)
      render_options = { form_name: :f }

      # TODO: Remove in 2.0
      if html_options.key?(:render_options)
        Cocooned::Deprecation.warn 'Support for :render_options will be removed in 3.0'

        options = html_options.delete(:render_options)
        render_options[:locals] = options.delete(:locals) if options.key?(:locals)
        render_options[:form_options] = options
      end

      %i[locals partial form_name form_options].each_with_object(render_options) do |option_name, opts|
        opts[option_name] = html_options.delete(option_name) if html_options.key?(option_name)
      end
    end

    def cocooned_extract_data!(html_options)
      options = Options.new(html_options)

      data = {
        association_insertion_count: [options.fetch(:count, 0).to_i, 1].compact.max,
        association_insertion_node: options.fetch(:insertion_node),
        association_insertion_method: options.fetch(:insertion_method),
        association_insertion_traversal: options.fetch(:insertion_traversal)
      }

      # Compatibility with the old way to pass data attributes to Rails view helpers
      # Has we build a :data key, they will not be looked up.
      html_options.keys.select { |k| k.to_s.match?(/data[_-]/) }.each_with_object(data) do |data_key, d|
        key = data_key.to_s.gsub(/^data[_-]/, '')
        d[key] = html_options.delete(data_key)
      end

      # Compatibility with the old JavaScript option name
      data[:count] = data[:association_insertion_count]

      data.compact
    end
  end
end
