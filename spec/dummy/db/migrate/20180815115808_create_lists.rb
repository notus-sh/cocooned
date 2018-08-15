# frozen_string_literal: true

class CreateLists < (Rails.version.start_with?('5.') ? ActiveRecord::Migration[5.0] : ActiveRecord::Migration)
  def change
    create_table :lists do |t|
      t.string :name

      t.timestamps null: false
    end
  end
end
