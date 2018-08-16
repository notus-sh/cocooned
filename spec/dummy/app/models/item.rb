# frozen_string_literal: true

class Item < ApplicationRecord
  # Relations
  belongs_to :list

  # Validations
  validates :label,
            presence: true

  # We dont validate position uniqueness as it
  # doesn't work with batch updates
  validates :position,
            presence: true,
            numericality: true
end
