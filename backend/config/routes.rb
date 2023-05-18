Rails.application.routes.draw do
  get '/current_user', to: 'api/v1/users/current_user#index'

  devise_for :users, path: '', path_names: {
    sign_in: 'login',
    sign_out: 'logout',
  },
  controllers: {
    omniauth_callbacks: 'api/v1/users/omniauth_callbacks',
    users: 'api/v1/users/users'
  }

  namespace :api do
    namespace :v1 do
      devise_scope :user do
          namespace :users do
          get 'profile', to: 'users#profile'
          get '/auth/google_oauth2/callback', to: 'omniauth_callbacks#google_oauth2'
          post '/refresh_token', to: 'omniauth_callbacks#update_token'
          delete '/logout', to: 'omniauth_callbacks#logout'
        end
      end
    end
  end
end
