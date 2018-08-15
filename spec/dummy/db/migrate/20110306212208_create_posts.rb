# frozen_string_literal: true

class CreatePosts < (Rails.version.start_with?('5.') ? ActiveRecord::Migration[5.0] : ActiveRecord::Migration)
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
