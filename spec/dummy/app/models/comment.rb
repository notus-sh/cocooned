# frozen_string_literal: true

class Comment < ActiveRecord::Base
  belongs_to :post
  belongs_to :person
end
