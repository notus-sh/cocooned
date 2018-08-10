# frozen_string_literal: true

class CreatePeople < (Rails.version.start_with?('5.') ? ActiveRecord::Migration[5.0] : ActiveRecord::Migration)
  def change
    create_table :people do |t|
      # Attributes
      t.string :name

      t.timestamps null: false
    end

    create_table :people_people do |t|
      # Relations
      t.integer :child_id, null: false
      t.integer :person_id, null: false

      t.timestamps null: false
    end
  end
end
