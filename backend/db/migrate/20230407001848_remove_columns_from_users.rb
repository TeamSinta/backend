# This is a cleanup for the users table to remove unwanted columns created by devise.
# Since we will be using google auth.
class RemoveColumnsFromUsers < ActiveRecord::Migration[7.0]
  def change
    remove_column :users, :encrypted_password, :string
    remove_column :users, :reset_password_token, :string
    remove_column :users, :remember_created_at, :datetime
    remove_column :users, :reset_password_sent_at, :datetime
  end
end
