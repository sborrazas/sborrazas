require 'sinatra/content_for'
require root_path('app/helpers/application_helper')

class ApplicationController < Sinatra::Base

  helpers Sinatra::ContentFor
  helpers ApplicationHelper

  set :views, File.expand_path('../../templates', __FILE__)
  set :public_folder, File.expand_path('../../../public', __FILE__)
  set :static_cache_control, [:public, max_age: 60 * 60 * 24]
  enable :static

  configure :production, :development do
    enable :logging
  end

  not_found do
    erb :'general/not_found.html'
  end
end

require root_path('app/controllers/main_controller')
