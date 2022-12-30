# frozen_string_literal: true

require_relative './shared/tag'

describe Cocooned::Tags::Down, :tag do
  it_behaves_like 'an action tag builder', :down

  it 'has a default class' do
    expect(tag.attribute('class').value.split).to include('cocooned-move-down')
  end

  it 'supports more classes' do
    expect(tag(class: %i[one two]).attribute('class').value.split).to include('one', 'two', 'cocooned-move-down')
  end
end
