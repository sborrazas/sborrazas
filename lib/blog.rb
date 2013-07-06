require 'time'
require 'yaml'

module Sborrazas
  module Blog

    module_function

    def get_article_list
      article_list = []
      Dir.glob("#{root_path('blogposts')}/*.md").each do |file|
        article_list << parse_article(File.read(file))
      end
      article_list
    end

    def parse_article(text)
      meta, content = text.split("\n\n", 2)

      YAML.load(meta).merge(content: content)
    end
  end
end
