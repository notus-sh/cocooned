# frozen_string_literal: true

require_relative 'shared/tag'

RSpec.describe Cocooned::Tags::Down do
  let(:template) { ActionView::Base.empty }
  let(:record) { Person.new }
  let(:form) { ActionView::Helpers::FormBuilder.new('person[contacts_attributes][0]', record, template, {}) }

  shared_examples 'an action tag builder to move down' do
    it_behaves_like 'an action tag builder', :down
    it_behaves_like 'an action tag builder with an association', :down, :contacts

    it 'has a default class' do
      expect(tag.attribute('class').value.split).to include('cocooned-move-down')
    end

    it 'supports more classes' do
      expect(tag(class: %i[one two]).attribute('class').value.split).to include('one', 'two', 'cocooned-move-down')
    end

    it 'has a data attribute to identify it as a trigger' do
      expect(tag.attribute('data-cocooned-trigger').value).to eq('down')
    end
  end

  context 'when rendered as a link', tag: :link do
    it_behaves_like 'an action tag builder to move down'

    it 'has a neutral URL as href' do
      expect(tag.attribute('href').value).to eq('#')
    end
  end

  context 'when rendered as a button', tag: :button do
    it_behaves_like 'an action tag builder to move down'

    it 'is of button type' do
      expect(tag.attribute('type').value).to eq('button')
    end
  end
end
