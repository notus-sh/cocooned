# frozen_string_literal: true

describe Cocooned::Tags::Base do
  let(:template) { ActionView::Base.empty }

  describe '.create' do
    let(:label) { 'label' }
    let(:form) { double }
    let(:options) { { name: 'value' } }

    context 'with all arguments' do
      subject(:tag) { described_class.create(template, label, form, **options) }

      it 'creates a new tag' do
        expect(tag).to be_an_instance_of(described_class)
      end

      it 'creates a tag with correct label' do
        expect(tag.label).to eq(label)
      end

      it 'creates a tag with correct form' do
        expect(tag.form).to eq(form)
      end

      it 'creates a tag with correct options' do
        expect(tag.options).to eq(options.stringify_keys)
      end
    end

    context 'with a block as label' do
      subject(:tag) do
        described_class.create(template, form, **options) { label }
      end

      it 'creates a new tag' do
        expect(tag).to be_an_instance_of(described_class)
      end

      it 'creates a tag with correct label' do
        expect(tag.label).to eq(label)
      end

      it 'creates a tag with correct form' do
        expect(tag.form).to eq(form)
      end

      it 'creates a tag with correct options' do
        expect(tag.options).to eq(options.stringify_keys)
      end
    end

    context 'without an explicit label' do
      subject(:tag) { described_class.create(template, form, **options) }

      it 'creates a new tag' do
        expect(tag).to be_an_instance_of(described_class)
      end

      it 'creates a tag with default label' do
        expect(tag.label).to eq('Base')
      end

      it 'creates a tag with correct form' do
        expect(tag.form).to eq(form)
      end

      it 'creates a tag with correct options' do
        expect(tag.options).to eq(options.stringify_keys)
      end
    end

    context 'when subclassed' do
      subject(:tag) { subclass.create(template, label, form, **options) }

      let(:subclass) { Class.new(described_class) }

      it 'creates a new instance of the correct classe' do
        expect(tag).to be_an_instance_of(subclass)
      end
    end
  end
end
