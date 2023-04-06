Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      namespace :users do
        get 'current_user/index'
      end
    end
  end
  Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      namespace :users do
        get 'current_user/index'
      end
    end
  end
    devise_for :users, path: '', path_names: {
      sign_in: 'login',
      sign_out: 'logout',
      registration: 'signup'
    },
    controllers: {
      sessions: 'api/v1/users/sessions',
      registrations: 'api/v1/users/registrations'
    }

    namespace :api do
      namespace :v1 do
        resources :users
      end
    end
  end
end
