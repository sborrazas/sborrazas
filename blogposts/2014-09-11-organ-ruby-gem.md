:title: "Service applications with Organ"
:date: 2014-09-11
:slug: organ-ruby-gem
:description: "How I use the Organ gem to organize web applications into services"


Ever since I moved out of the MVC mindset for web I've been more inclined in
having services as a layer on software applications, which only manages some
input and does something about it.

It is usually a very common thing to have to coerce (format) the input given by
the user, validate it and then perform the actions the caller requested, and
possibly return some output. This is what these services are for, services are
doers, they make changes to the domain models with the given data. That is why
I always use a verb on the services name, like `CreateUser`, `GetArtist`,
`StoreFile`, `DeleteAlbum`, `NotifyAdmin`, etc.

Once these services validate the data, they can start calling external modules
from the domain to perform the actions. This could be an SQL DB client library,
an external API for which you have a client wrapper or simply some computation
you might want to do with the given input. All of these external services
(DB, APIs, FS, etc), are wrapped in their own clients with their own
abstractions and interfaces.

It is very important to make this services layer receive and return data
structures, in the communication between the caller and the service, no objects
from the domain should be present. By data structures, in Ruby, I mean hashes,
arrays containing integers, strings, floats, etc. These data structures don't
have any behavior, they are data abstractions, not behavior abstractions.

This is pretty much how I use [Organ](https://github.com/sborrazas/organ) for
web applications, I instantiate them with the request parameters, coerce the
values, validate them and perform the actions or return some data. For example:

<pre class="sh_ruby">
  # services/create_user.rb
  require "organ"
  require "models/user"

  module Services
    class CreateUser < Organ::Form

      PASSWORD_FORMAT = %r{stuff..}

      attr_reader :user

      attribute(:email, :type => :string)
      attribute(:password, :type => :string)

      def validate
        validate_email_format(:email)
        validate_format(:password, PASSWORD_FORMAT)
      end

      def perform
        @user = MyApp::User.create(attributes).to_hash
      end

    end
  end

  # routes/user.rb
  on post do
    service = Services::CreateUser.new(params[:user])
    if service.valid?
      service.perform
      res.redirect("...")
    else
      render("user/form", :user_form => service)
    end
  end
</pre>

I usually also add some extensions like having them respond to worker jobs
using Ost so I can have Worker services as well.

<pre class="sh_ruby">
  # services/extensions/worker.rb
  module Services
    module Extensions
      module Worker

        def self.queue_job(attributes)
          queue << JSON.generate(attributes)
        end

        def self.stop
          queue.stop
        end

        def self.watch_queue
          queue.each do |json_str|
            attributes = JSON.parse(json_str)
            new(attributes).perform
          end
        end

        private

        def self.queue
          Ost[self.name]
        end

      end
    end
  end

  # workers/email_notifier.rb
  module Workers
    class NotifyUser < Organ::Form

      include Extensions::Worker

      attribute(:email, :type => :string)
      attribute(:message, :type => :string)

      def perform
        # send message to email...
      end

    end
  end
</pre>

I would also use extensions on services that return data, possibly from a cache.

<pre class="sh_ruby">
  # services/extensions/presenter.rb
  module Services
    module Extensions
      module Presenter

        def data
          @data ||= get_cache(cache_key) { perform }
        end

        def get_cache(key, &block)
          Cache[key] || block.call
        end

      end
    end
  end

  # services/get_albums.rb
  module Services
    class GetAlbums < Organ::Form

      include Extensions::Presenters

      attribute(:user_id, :type => :integer)

      def perform
        music_client.get_user_albums(user_id)
      end

      def cache_key
        "user:#{user_id}:albums"
      end

    end
  end

  # routes/albums.rb
  on get, "albums" do
    service = Services::GetAlbums.new(session[:user_id])
    render("albums/list", :albums => service.data)
  end
</pre>

This are just a few of the examples of how I used Organ. Organ was inspired by
[soveran/scrivener](https://github.com/soveran/scrivener) and by many posts
on how to build a service based application.

Any comments or improvements for [Organ](https://github.com/sborrazas/organ) or
this blogpost are more than welcome.
