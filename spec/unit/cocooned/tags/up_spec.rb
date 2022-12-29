# frozen_string_literal: true

require_relative './shared/tag'

describe Cocooned::Tags::Up, :tag do
  it_behaves_like 'an action tag builder', :up

  it 'have a default class' do
    expect(tag.attribute('class').value.split).to include('cocooned-move-up')
  end

  it 'supports more classes' do
    expect(tag(class: %i[one two]).attribute('class').value.split).to include('one', 'two', 'cocooned-move-up')
  end
end
