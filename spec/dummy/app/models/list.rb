# frozen_string_literal: true

class List < ApplicationRecord
  has_many :items, -> { order('position') }, dependent: :destroy
  accepts_nested_attributes_for :items, reject_if: :all_blank, allow_destroy: true
end
