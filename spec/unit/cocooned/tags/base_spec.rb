# frozen_string_literal: true

require_relative './shared/tag'

RSpec.describe Cocooned::Tags::Base do
  let(:template) { ActionView::Base.empty }
  let(:form) { ActionView::Helpers::FormBuilder.new('person', nil, template, {}) }

  describe '.create' do
    it 'creates a new tag' do
      expect(described_class.create(template, form)).to be_an_instance_of(described_class)
    end

    context 'when subclassed' do
      let(:subclass) { Class.new(described_class) }

      it 'creates a new instance of the correct classe' do
        expect(subclass.create(template, form)).to be_an_instance_of(subclass)
      end
    end
  end

  context 'when rendered as a link', tag: :link do
    it_behaves_like 'an action tag builder', :base

    it 'has a neutral URL as href' do
      expect(tag.attribute('href').value).to eq('#')
    end
  end

  context 'when rendered as a button', tag: :button do
    it_behaves_like 'an action tag builder', :base

    it 'is of button type' do
      expect(tag.attribute('type').value).to eq('button')
    end
  end
end
