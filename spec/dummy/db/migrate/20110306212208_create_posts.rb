# frozen_string_literal: true

class CreatePosts < ActiveRecord::Migration[6.0]
  def change
    create_table :posts do |t|
      # Attributes
      t.string :title
      t.text :body

      # Relations
      t.belongs_to :author, index: true
      t.belongs_to :person, index: true, null: true

      t.timestamps null: false
    end
  end
end
