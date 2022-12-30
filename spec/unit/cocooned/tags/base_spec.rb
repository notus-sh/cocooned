# frozen_string_literal: true

require_relative './shared/tag'

describe Cocooned::Tags::Base, :tag do
  let(:template) { ActionView::Base.empty }
  let(:form) { double }

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

  it_behaves_like 'an action tag builder', :base
end
