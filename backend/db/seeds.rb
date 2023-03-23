# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

User.create(
  [{
    first_name: "Mohamed",
    last_name: "Shegow",
    role: "BDR",
    email: "shegowmo@gmail.com",
  }]
)

User.create(
  [{
    first_name: "Mattias",
    last_name: "ToCool-Velamsson",
    role: "LGTM",
    email: "LOVE@IKEA.COM",
  }]
)
