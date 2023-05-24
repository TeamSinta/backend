Rails.application.routes.draw do
  devise_for :users, path: '', path_names: {
    sign_in: 'login',
    sign_out: 'logout',
    destroy: 'destroy'
  },
  controllers: {
    omniauth_callbacks: 'api/v1/users/omniauth_callbacks',
    sessions: 'api/v1/users/sessions',
    users: 'api/v1/users/users'
  }

  namespace :api do
    namespace :v1 do
      devise_scope :user do
        namespace :users do
          get 'profile', to: 'users#profile'
          get '/auth/google_oauth2/callback', to: 'omniauth_callbacks#google_oauth2'
          post '/refresh_token', to: 'sessions#update_token'
          delete '/logout', to: 'sessions#logout'
          delete '/destroy', to: 'users#destroy'
        end
      end
    end
  end
end
