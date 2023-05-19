# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Clear DB
RefreshToken.delete_all
puts "All refresh tokens deleted."

User.delete_all
puts "All users deleted."
