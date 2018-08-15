# frozen_string_literal: true

class PostDecorator
  def initialize(post)
    @post = post
  end

  def formatted_created_at
    @post.created_at.to_formatted_s(:short)
  end

  def method_missing(method, *args)
    @post.respond_to?(method) ? @post.send(method, *args) : super
  end

  def respond_to_missing?(method, include_private = false)
    @post.respond_to?(method, include_private) || super
  end
end
