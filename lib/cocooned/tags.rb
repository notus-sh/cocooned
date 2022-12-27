# frozen_string_literal: true

module Cocooned
  module Tags
    autoload :Base, 'cocooned/tags/base'

    autoload :Add, 'cocooned/tags/add'
    autoload :MoveUp, 'cocooned/tags/move_up'
    autoload :MoveDown, 'cocooned/tags/move_down'
    autoload :Remove, 'cocooned/tags/remove'
  end
end
