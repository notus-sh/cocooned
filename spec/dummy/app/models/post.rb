# frozen_string_literal: true

class Post < ApplicationRecord
  has_one :review, class_name: 'Person'
  has_many :comments
  has_many :admin_comments, -> { where author: 'Admin' }, class_name: 'Comment'
end
