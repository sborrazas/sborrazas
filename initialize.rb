def root_path(*args)
  File.join(File.dirname(__FILE__), *args)
end

require 'rubygems'
require 'bundler'
require 'sinatra/base'

ENV['BUNDLE_GEMFILE'] = root_path('Gemfile')
Bundler.setup

require root_path('app/controllers/application_controller')
