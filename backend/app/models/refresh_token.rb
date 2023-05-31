# Model for the refresh_token table
class RefreshToken < ApplicationRecord
  belongs_to :user
end
