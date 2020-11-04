# frozen_string_literal: true

class CreateItems < ActiveRecord::Migration[5.0]
  def change
    create_table :items do |t|
      t.string :label
      t.integer :position

      t.belongs_to :list, index: true

      t.timestamps null: false
    end
  end
end
