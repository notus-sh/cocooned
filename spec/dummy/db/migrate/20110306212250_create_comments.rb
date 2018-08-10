# frozen_string_literal: true

class CreateComments < (Rails.version.start_with?('5.') ? ActiveRecord::Migration[5.0] : ActiveRecord::Migration)
  def change
    create_table :comments do |t|
      # Attributes
      t.text :body
      t.string :author

      # Relations
      t.integer :post_id, null: false, index: true
      t.integer :person_id, null: false, index: true

      t.timestamps null: false
    end
  end
end
