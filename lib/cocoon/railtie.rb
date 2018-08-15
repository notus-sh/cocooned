# frozen_string_literal: true

require 'rails'
require 'cocoon/helpers'

module Cocoon
  class Railtie < ::Rails::Engine
    initializer 'cocoon.initialize' do |_app|
      ActiveSupport.on_load :action_view do
        ActionView::Base.send :include, Cocoon::Helpers
      end
    end
  end
end
