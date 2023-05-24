class AddExpirationDateToRefreshTokens < ActiveRecord::Migration[7.0]
  def change
    add_column :refresh_tokens, :expiration_date, :datetime
  end
end
