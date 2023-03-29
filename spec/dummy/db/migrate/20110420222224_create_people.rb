# frozen_string_literal: true

class CreatePeople < ActiveRecord::Migration[6.0]
  def change
    create_table :people do |t|
      # Attributes
      t.string :name
      t.string :status

      t.timestamps null: false
    end

    create_table :people_people do |t|
      # Relations
      t.integer :contact_id, null: false
      t.integer :person_id, null: false

      t.timestamps null: false
    end
  end
end
