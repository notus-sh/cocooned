# frozen_string_literal: true

require 'cocooned/deprecation'
require 'cocooned/railtie'

module Cocooned # :nodoc:
  autoload :Association, 'cocooned/association'
  autoload :Helpers, 'cocooned/helpers'
  autoload :Tags, 'cocooned/tags'
  autoload :TagsHelper, 'cocooned/tags_helper'
end
