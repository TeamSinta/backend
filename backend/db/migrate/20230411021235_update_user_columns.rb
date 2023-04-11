class UpdateUserColumns < ActiveRecord::Migration[7.0]
  def change
    remove_column :users, :encrypted_password, :string
    remove_column :users, :reset_password_token, :string
    remove_column :users, :reset_password_sent_at, :datetime
    remove_column :users, :remember_created_at, :datetime
    add_column :users, :name, :string
    add_column :users, :provider, :string
    add_column :users, :username, :string
    add_column :users, :role, :string
  end
end
