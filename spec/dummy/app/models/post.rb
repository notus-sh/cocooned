# frozen_string_literal: true

class Post < ActiveRecord::Base
  has_many :people
  has_many :comments
  has_many :admin_comments, -> { where author: 'Admin' }, class_name: 'Comment'
end
