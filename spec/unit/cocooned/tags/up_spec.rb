# frozen_string_literal: true

require_relative './shared/tag'

describe Cocooned::Tags::Up do
  let(:template) { ActionView::Base.empty }
  let(:record) { Person.new }
  let(:form) { ActionView::Helpers::FormBuilder.new('person[contacts_attributes][0]', record, template, {}) }

  shared_examples 'an action tag builder to move up' do
    it_behaves_like 'an action tag builder', :up
    it_behaves_like 'an action tag builder with an association', :up, :contacts

    it 'has a default class' do
      expect(tag.attribute('class').value.split).to include('cocooned-move-up')
    end

    it 'supports more classes' do
      expect(tag(class: %i[one two]).attribute('class').value.split).to include('one', 'two', 'cocooned-move-up')
    end

    it 'has a data attribute to identify it as a trigger' do
      expect(tag.attribute('data-cocooned-trigger').value).to eq('up')
    end
  end

  context 'when rendered as a link', tag: :link do
    it_behaves_like 'an action tag builder to move up'

    it 'has a neutral URL as href' do
      expect(tag.attribute('href').value).to eq('#')
    end
  end

  context 'when rendered as a button', tag: :button do
    it_behaves_like 'an action tag builder to move up'
  end
end
