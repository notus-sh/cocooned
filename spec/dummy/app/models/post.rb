# frozen_string_literal: true

class Post < ApplicationRecord
  belongs_to :author, class_name: 'Person'
  belongs_to :person, class_name: 'Person', optional: true
end
