# frozen_string_literal: true

class CreateItems < (Rails.version.start_with?('5.') ? ActiveRecord::Migration[5.0] : ActiveRecord::Migration)
  def change
    create_table :items do |t|
      t.string :label
      t.integer :position

      t.belongs_to :list, index: true

      t.timestamps null: false
    end
  end
end
