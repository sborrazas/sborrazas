def root_path(*args)
  File.join(File.dirname(__FILE__), *args)
end

require "sinatra/base"

require root_path("app/controllers/application_controller")
