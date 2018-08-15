# frozen_string_literal: true

class JasmineController < ApplicationController
  def show
    @list = List.first_or_create(name: 'List')
    @list.items.clear unless @list.items.empty?
    @list.items.create(label: 'Item', position: 0)
    @list.items.reload
  end
end
