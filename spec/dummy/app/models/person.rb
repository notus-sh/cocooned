# frozen_string_literal: true

class Person < ActiveRecord::Base
  has_one :biography, class_name: 'Post'
  has_and_belongs_to_many :children, class_name: 'Person'
  has_many :posts, as: :author
  has_many :comments
end
