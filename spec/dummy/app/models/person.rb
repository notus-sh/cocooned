# frozen_string_literal: true

class Person < ApplicationRecord
  has_one :biography, class_name: 'Post', dependent: :destroy

  has_many :posts, inverse_of: :author, dependent: :destroy
  accepts_nested_attributes_for :posts, reject_if: :all_blank, allow_destroy: true

  # rubocop:disable Rails/HasAndBelongsToMany
  has_and_belongs_to_many :contacts, class_name: 'Person'
  has_and_belongs_to_many :alumni, -> { where status: :student }, class_name: 'Person'
  # rubocop:enable Rails/HasAndBelongsToMany
end
