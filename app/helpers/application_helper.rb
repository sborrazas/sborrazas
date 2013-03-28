module ApplicationHelper
  def in_blog?
    /^\/blog/ =~ request.path_info
  end
end
