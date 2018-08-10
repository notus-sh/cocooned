# frozen_string_literal: true

require 'cocoon/view_helpers'

module Cocoon
  class Engine < ::Rails::Engine
    config.before_initialize do
      config.action_view.javascript_expansions[:cocoon] = %w[cocoon] if config.action_view.javascript_expansions
    end

    # configure our plugin on boot
    initializer 'cocoon.initialize' do |_app|
      ActiveSupport.on_load :action_view do
        ActionView::Base.send :include, Cocoon::ViewHelpers
      end
    end
  end
end
