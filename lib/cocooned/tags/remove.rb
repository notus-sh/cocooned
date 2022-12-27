# frozen_string_literal: true

require 'cocooned/tags/base'

module Cocooned
  module Tags
    class Remove < Base
      protected

      def html_classes
        super + %w[cocooned-remove remove_fields]
      end
    end
  end
end
