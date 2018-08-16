# frozen_string_literal: true

require 'nokogiri'

describe Cocooned::Helpers do
  before(:each) do
    @tester = Class.new(ActionView::Base).new
    @person = Person.new
    @form   = double(object: @person, object_name: @person.class.name)
  end

  describe '#link_to_add_association' do
    before(:each) do
      allow(@tester).to receive(:render_association)
        .and_return('form<tag>')
    end

    context 'with an irregular plural' do
      context 'uses the correct plural' do
        before do
          @html = @tester.link_to_add_association('add something', @form, :alumni)
        end

        it_behaves_like 'a correctly rendered add link',
                        association: 'alumnus',
                        associations: 'alumni'
      end
    end

    context 'when using aliased association and class-name' do
      context 'uses the correct name' do
        before do
          @html = @tester.link_to_add_association('add something', @form, :alumni)
        end

        it_behaves_like 'a correctly rendered add link',
                        association: 'alumnus',
                        associations: 'alumni'
      end
    end

    context 'with extra render-options for rendering the child relation' do
      context 'uses the correct plural' do
        before do
          expect(@tester).to receive(:render_association)
            .with(:contacts, @form, anything, 'f', { wrapper: 'inline' }, nil)

          @html = @tester.link_to_add_association('add something', @form, :contacts, render_options: { wrapper: 'inline' })
        end

        it_behaves_like 'a correctly rendered add link',
                        association: 'contact',
                        associations: 'contacts'
      end
    end

    context 'passing locals to the partial' do
      context 'when given: passes the locals to the partials' do
        before do
          allow(@tester).to receive(:render_association).and_call_original
          expect(@form).to receive(:fields_for) { |_assoc, _object, _options, &block| block.call }
          expect(@tester).to receive(:render)
            .with('contact_fields', f: nil, dynamic: true, alfred: 'Judoka')
            .and_return 'partial'

          @html = @tester.link_to_add_association('add something',
                                                  @form,
                                                  :contacts,
                                                  render_options: {
                                                    wrapper: 'inline',
                                                    locals: { alfred: 'Judoka' }
                                                  })
        end

        it_behaves_like 'a correctly rendered add link',
                        template: 'partial',
                        association: 'contact',
                        associations: 'contacts'
      end

      context 'if no locals are given it still works' do
        before do
          allow(@tester).to receive(:render_association).and_call_original
          expect(@form).to receive(:fields_for) { |_assoc, _object, _options, &block| block.call }
          expect(@tester).to receive(:render)
            .with('contact_fields', f: nil, dynamic: true)
            .and_return 'partial'

          @html = @tester.link_to_add_association('add something', @form, :contacts, render_options: { wrapper: 'inline' })
        end

        it_behaves_like 'a correctly rendered add link',
                        template: 'partial',
                        association: 'contact',
                        associations: 'contacts'
      end
    end

    context 'overruling the form parameter name' do
      context 'when given a form_name it passes it correctly to the partials' do
        before do
          allow(@tester).to receive(:render_association).and_call_original
          expect(@form).to receive(:fields_for) { |_assoc, _object, _options, &block| block.call }
          expect(@tester).to receive(:render)
            .with('contact_fields', student_form: nil, dynamic: true)
            .and_return 'partial'

          @html = @tester.link_to_add_association('add something', @form, :contacts, form_name: 'student_form')
        end

        it_behaves_like 'a correctly rendered add link',
                        template: 'partial',
                        association: 'contact',
                        associations: 'contacts'
      end
    end
  end

  describe '#create_object' do
    it 'creates correct association for belongs_to associations' do
      post = Post.new
      form_obj = double(object: Post.new)
      result   = @tester.create_object(form_obj, :author)
      expect(result).to be_a Person
      expect(post.author).to be_nil
    end

    it 'creates correct association with conditions' do
      person = Person.new
      form_obj = double(object: Person.new)
      result = @tester.create_object(form_obj, :alumni)
      expect(result).to be_a Person
      expect(result.status).to eq('student')
      expect(person.alumni).to be_empty
    end

    it 'creates correct association for has_one associations' do
      person   = Person.new
      form_obj = double(object: Person.new)
      result   = @tester.create_object(form_obj, :biography)
      expect(result).to be_a Post
      expect(person.biography).to be_nil
    end

    it 'creates correct association for has_many associations' do
      person = Person.new
      form_obj = double(object: Person.new)
      result   = @tester.create_object(form_obj, :posts)
      expect(result).to be_a Post
      expect(person.posts).to be_empty
    end

    it 'creates correct association for has_and_belongs_to_many associations' do
      person = Person.new
      form_obj = double(object: Person.new)
      result   = @tester.create_object(form_obj, :contacts)
      expect(result).to be_a Person
      expect(person.contacts).to be_empty
    end

    it 'creates an object if cannot reflect on association' do
      object = double('AnyNonActiveRecordObject')
      expect(object).to receive(:build_non_reflectable).and_return 'custom'
      expect(@tester.create_object(double(object: object), :non_reflectable)).to eq('custom')
    end

    context "if object respond to 'build_association'" do
      subject do
        Class.new(Post) do
          def build_custom_item; end
        end
      end

      it 'creates an association as singular' do
        object = subject.new
        expect(object).to receive(:build_custom_item).and_return('custom')
        expect(@tester.create_object(double(object: object), :custom_item)).to eq('custom')
      end

      it 'creates an association as plural' do
        object = subject.new
        expect(object).to receive(:build_custom_item).and_return('custom')
        expect(@tester.create_object(double(object: object), :custom_items)).to eq('custom')
      end
    end

    it 'can create using only conditions not the association' do
      expect(@tester).to receive(:create_object_with_conditions)
        .and_return('flappie')
      expect(@tester.create_object(@form, :alumni, true)).to eq('flappie')
    end
  end
end
