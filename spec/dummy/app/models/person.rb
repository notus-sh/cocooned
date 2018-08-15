# frozen_string_literal: true

class Person < ApplicationRecord
  has_one :biography, class_name: 'Post'

  has_many :posts, inverse_of: :author
  accepts_nested_attributes_for :posts, reject_if: :all_blank, allow_destroy: true

  has_and_belongs_to_many :contacts, class_name: 'Person'
  has_and_belongs_to_many :alumni, -> { where status: :student }, class_name: 'Person'
end
