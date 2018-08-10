# frozen_string_literal: true

require 'cocoon/view_helpers'

module Cocoon
  class Railtie < ::Rails::Railtie
    initializer 'cocoon.initialize' do |_app|
      ActiveSupport.on_load :action_view do
        ActionView::Base.send :include, Cocoon::ViewHelpers
      end
    end
  end
end
