:title: Building an API Client
:date: 2013-06-08
:slug: building-and-api-client
:description: The way I like to build API clients

Most of the times in my web project I'm building API clients. These clients will probably use other clients, and therefore it becomes other API clients wrappers.
It doesnt really matter whether it is for an internal API like our DB storage or some external API like twitter.
We shold always build wrappers around them. By doing so an API client can really improve our application design and file structure.

This pattern for building clients was inspired by the [Octokit Gem](https://github.com/octokit/octokit.rb) from
[@pengwynn](https://twitter.com/pengwynn) (an amazing developer).

Here's an example of how I would create a client on some project of mine:

<pre class="sh_ruby">
# lib/myapp/client.rb
require 'myapp/client/notifications'
require 'myapp/client/publications'

module MyApp
  class Client

    include MyApp::Client::Notifications
    include MyApp::Client::Publications
    # ..

    attr_reader :user

    # Initialize a Client instance
    #
    # @param [User] user
    #   the user responsible for triggering the client actions
    def initialize(user)
      @user = user
    end

  end
end

# lib/myapp/client/publications.rb
module MyApp
  module Client
    module Publications

      # Creates a publication
      #
      # @param attributes [Hash]
      #   the new publication attributes
      #
      # @raise [MyApp::InvalidRecordError]
      #   if any validation errors occur
      #
      # @return [Publication]
      def create_publication(attributes)
        form = Forms::Publication.new(attributes, context: :create, user: user)
        form.save
      end

    end
  end
end
</pre>

This is a (shortened) sample Sinatra application making use of this client:
<pre class="sh_ruby">
# webapp/controllers/publications.rb
require 'json'
require 'myapp/client'

module WebApp
  # WebApp main Sinatra controller
  # You should probably add this on some other controller
  class Main &lt; Sinatra::Base

    helpers do
      def current_user
        MyApp::User.get(session[:user_id])
      end

      def client
        @client ||= MyApp::Client.new(current_user)
      end
    end

    before do
      content_type :json
    end

    get '/publications' do
      client.publications(params[:filters]).to_json
    end

    post '/publications' do
      client.create_publication(params[:publication]).to_json
    end

    error MyApp::InvalidRecordError do
      status 422 # Or w/e
      ex = env['sinatra.error']
      { errors: ex.errors }.to_json
    end

  end
end
</pre>

This is an example of how I would elaborate a Ruby application. It might not be the best approach, but it works for me!

The only downside I found with this way of implementing clients is that is it rather hard to test.
To test each client extension (Publications, Notifications) you need to create a fake class which includes it.
If you have any suggestions on how to do this in a better way, please let me know! I'm dying to know!

You should also check [@pengwynn blogpost](http://wynnnetherland.com/journal/what-makes-a-good-api-wrapper) regarding building these types of clients, it was of great help to me.

Please submit a pull request on [this blog](https://github.com/sborrazas/sborrazas) or [tweet me](https://twitter.com/sborrazas) if you have any suggestions/improvements, I would really appreciate it.
