require root_path("lib/blog")

class MainController < ApplicationController

  articles = Sborrazas::Blog.get_article_list.sort_by do |article|
    article[:date]
  end.reverse

  get "/" do
    cache_control :public, :must_revalidate, max_age: 60 * 60 * 24
    erb(:"main/index.html", :locals => { :articles => articles },
        :layout => :"layout.html")
  end

  articles.each do |article|
    get "/blog/#{article[:slug]}" do
      cache_control :public, :must_revalidate, max_age: 60 * 60 * 24 * 30
      erb(:"main/blogpost.html", :locals => { article: article },
          :layout => :"layout.html")
    end
  end
end
