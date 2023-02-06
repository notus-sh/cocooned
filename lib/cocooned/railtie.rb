# frozen_string_literal: true

require 'rails'
require 'cocooned/helpers'

module Cocooned
  class Railtie < ::Rails::Engine # :nodoc:
    initializer 'cocooned.initialize' do |_app|
      ActiveSupport.on_load :action_view do
        ActionView::Base.include Cocooned::Helpers::Tags, Cocooned::Helpers::Containers
      end
    end
  end
end
