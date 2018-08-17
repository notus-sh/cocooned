# frozen_string_literal: true

require 'nokogiri'

def parse_html(html)
  Nokogiri::HTML(html)
end

def parse_link(html)
  Nokogiri::HTML(html).at('a')
end
