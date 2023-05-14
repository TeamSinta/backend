Rails.application.routes.draw do
  get '/current_user', to: 'api/v1/users/current_user#index'
  devise_for :users, path: '', path_names: {
    sign_in: 'login',
    sign_out: 'logout',
    registration: 'signup'
  },
  controllers: {
    sessions: 'api/v1/users/sessions',
    registrations: 'api/v1/users/registrations',
    omniauth_callbacks: 'api/v1/users/omniauth_callbacks'
  }

  namespace :api do
    namespace :v1 do
      devise_scope :user do
        get '/users/auth/google_oauth2/callback', to: 'users/omniauth_callbacks#google_oauth2'
      end
    end
  end
end
