class CreateItems < ActiveRecord::Migration
  def self.up
    create_table :items do |t|
      t.text :value
      t.belongs_to :section

      t.timestamps
    end
  end

  def self.down
    drop_table :items
  end
end
