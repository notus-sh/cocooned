# frozen_string_literal: true

require 'cocooned/deprecation'
require 'cocooned/railtie'

module Cocooned
  autoload :Association, 'cocooned/association'
  autoload :Helpers, 'cocooned/helpers'
  autoload :Tags, 'cocooned/tags'
  autoload :TagsHelper, 'cocooned/tags_helper'
end
