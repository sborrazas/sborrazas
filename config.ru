require 'rubygems'
require 'sinatra/base'

Dir.glob('./app/{helpers,controllers}/*.rb').each {|file| require file }

run ApplicationController