# frozen_string_literal: true

class Comment < ActiveRecord::Base
  belongs_to :post

  attr_protected :author unless Rails.rails4?
end
