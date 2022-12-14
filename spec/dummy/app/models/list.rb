# frozen_string_literal: true

class List < ApplicationRecord
  # Relations
  has_many :items,
           -> { order('position') },
           inverse_of: :list,
           dependent: :destroy

  accepts_nested_attributes_for :items, reject_if: :all_blank, allow_destroy: true

  # Validations
  validates :name,
            presence: true
end
