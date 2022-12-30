# frozen_string_literal: true

describe Cocooned::Association::Builder do
  describe '#build' do
    context 'with belongs_to associations' do
      subject(:builder) { described_class.new(post, :author) }

      let(:post) { Post.new }

      it 'does not set association value' do
        builder.build
        expect(post.author).to be_nil
      end

      it 'creates associated object of correct type' do
        expect(builder.build).to be_a Person
      end
    end

    context 'with has_one associations' do
      subject(:builder) { described_class.new(person, :biography) }

      let(:person) { Person.new }

      it 'does not set association value' do
        builder.build
        expect(person.biography).to be_nil
      end

      it 'creates associated object of correct type' do
        expect(builder.build).to be_a Post
      end
    end

    context 'with has_many associations' do
      subject(:builder) { described_class.new(person, :posts) }

      let(:person) { Person.new }

      it 'does not set association value' do
        builder.build
        expect(person.biography).to be_nil
      end

      it 'creates associated object of correct type' do
        expect(builder.build).to be_a Post
      end
    end

    context 'with has_and_belongs_to_many associations' do
      subject(:builder) { described_class.new(person, :contacts) }

      let(:person) { Person.new }

      it 'does not set association value' do
        builder.build
        expect(person.contacts).to be_empty
      end

      it 'creates associated object of correct type' do
        expect(builder.build).to be_a Person
      end
    end

    context 'with an association with conditions' do
      subject(:builder) { described_class.new(person, :alumni) }

      let(:person) { Person.new }

      it 'does not set association value' do
        builder.build
        expect(person.alumni).to be_empty
      end

      it 'creates associated object of correct type' do
        expect(builder.build).to be_a Person
      end

      it 'creates associated object matching conditions' do
        expect(builder.build.status).to eq('student')
      end
    end

    context 'with an association without reflection' do
      subject(:builder) { described_class.new(object, :non_reflectable) }

      let(:object) { double }

      it 'uses #build_association to build an object' do
        allow(object).to receive(:build_non_reflectable).and_return 'custom'
        builder.build

        expect(object).to have_received(:build_non_reflectable)
      end
    end

    context 'when object respond to #build_association' do
      let(:object) { model.new }
      let(:model) do
        Class.new(Post) do
          def build_custom_item
            'custom'
          end
        end
      end

      context 'with a singular association' do
        subject(:builder) { described_class.new(object, :custom_item) }

        it 'uses #build_association to build an object' do
          expect(builder.build).to eq('custom')
        end
      end

      context 'with a plural association' do
        subject(:builder) { described_class.new(object, :custom_items) }

        it 'uses #build_association to build an object' do
          expect(builder.build).to eq('custom')
        end
      end
    end

    context 'with :force_non_association_create' do
      subject(:builder) { described_class.new(person, :alumni, force_non_association_create: true) }

      let(:person) { Person.new }

      it 'creates using only conditions' do
        allow(person.alumni).to receive(:build)
        builder.build
        expect(person.alumni).not_to have_received(:build)
      end

      it 'creates associated object of correct type' do
        expect(builder.build).to be_a Person
      end
    end

    context 'with :wrap_object' do
      subject(:builder) { described_class.new(person, :posts, wrap_object: proc { |p| PostDecorator.new(p) }) }

      let(:person) { Person.new }

      it 'decorates the created object' do
        expect(builder.build).to be_a(PostDecorator)
      end
    end
  end
end
