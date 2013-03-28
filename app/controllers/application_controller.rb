class ApplicationController < Sinatra::Base

  helpers UserHelper

  set :views, File.expand_path('../../templates', __FILE__)
  set :public_folder, File.expand_path('../../../public', __FILE__)
  enable :sessions
  enable :static

  configure :production, :development do
    enable :logging
  end

  get '/' do
    File.read(File.join('public', 'index.html'))
  end

  not_found do
    erb :'general/not_found'
  end
end
