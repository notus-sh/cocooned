# frozen_string_literal: true

require 'nokogiri'

describe Cocoon::Helpers do
  before(:each) do
    @tester = Class.new(ActionView::Base).new
    @person = Person.new
    @form   = double(object: @person, object_name: @person.class.name)
  end

  context 'link_to_add_association' do
    before(:each) do
      allow(@tester).to receive(:render_association)
        .and_return('form<tag>')
    end

    context 'with an irregular plural' do
      context 'uses the correct plural' do
        before do
          @html = @tester.link_to_add_association('add something', @form, :children)
        end

        it_behaves_like 'a correctly rendered add link',
                        association: 'child',
                        associations: 'children'
      end
    end

    context 'when using aliased association and class-name' do
      context 'uses the correct name' do
        before do
          post = Post.new
          form = double(object: post, object_name: post.class.name)
          @html = @tester.link_to_add_association('add something', form, :admin_comments)
        end

        it_behaves_like 'a correctly rendered add link',
                        association: 'admin_comment',
                        associations: 'admin_comments'
      end
    end

    context 'with extra render-options for rendering the child relation' do
      context 'uses the correct plural' do
        before do
          expect(@tester).to receive(:render_association)
            .with(:children, @form, anything, 'f', { wrapper: 'inline' }, nil)

          @html = @tester.link_to_add_association('add something', @form, :children, render_options: { wrapper: 'inline' })
        end

        it_behaves_like 'a correctly rendered add link',
                        association: 'child',
                        associations: 'children'
      end
    end

    context 'passing locals to the partial' do
      context 'when given: passes the locals to the partials' do
        before do
          allow(@tester).to receive(:render_association).and_call_original
          expect(@form).to receive(:fields_for) { |_assoc, _object, _options, &block| block.call }
          expect(@tester).to receive(:render)
            .with('child_fields', f: nil, dynamic: true, alfred: 'Judoka')
            .and_return 'partial'

          @html = @tester.link_to_add_association('add something',
                                                  @form,
                                                  :children,
                                                  render_options: {
                                                    wrapper: 'inline',
                                                    locals: { alfred: 'Judoka' }
                                                  })
        end

        it_behaves_like 'a correctly rendered add link',
                        template: 'partial',
                        association: 'child',
                        associations: 'children'
      end

      context 'if no locals are given it still works' do
        before do
          allow(@tester).to receive(:render_association).and_call_original
          expect(@form).to receive(:fields_for) { |_assoc, _object, _options, &block| block.call }
          expect(@tester).to receive(:render)
            .with('child_fields', f: nil, dynamic: true)
            .and_return 'partial'

          @html = @tester.link_to_add_association('add something', @form, :children, render_options: { wrapper: 'inline' })
        end

        it_behaves_like 'a correctly rendered add link',
                        template: 'partial',
                        association: 'child',
                        associations: 'children'
      end
    end

    context 'overruling the form parameter name' do
      context 'when given a form_name it passes it correctly to the partials' do
        before do
          allow(@tester).to receive(:render_association).and_call_original
          expect(@form).to receive(:fields_for) { |_assoc, _object, _options, &block| block.call }
          expect(@tester).to receive(:render)
            .with('child_fields', children_form: nil, dynamic: true)
            .and_return 'partial'

          @html = @tester.link_to_add_association('add something', @form, :children, form_name: 'children_form')
        end

        it_behaves_like 'a correctly rendered add link',
                        template: 'partial',
                        association: 'child',
                        associations: 'children'
      end
    end
  end

  context 'create_object' do
    it 'creates correct association for belongs_to associations' do
      comment  = Comment.new
      form_obj = double(object: Comment.new)
      result   = @tester.create_object(form_obj, :post)
      expect(result).to be_a Post
      expect(comment.post).to be_nil
    end

    it 'creates correct association with conditions' do
      post = Post.new
      form_obj = double(object: Post.new)
      result = @tester.create_object(form_obj, :admin_comments)
      expect(result).to be_a Comment
      expect(result.author).to eq('Admin')
      expect(post.admin_comments).to be_empty
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
      result   = @tester.create_object(form_obj, :comments)
      expect(result).to be_a Comment
      expect(person.comments).to be_empty
    end

    it 'creates correct association for has_and_belongs_to_many associations' do
      person = Person.new
      form_obj = double(object: Person.new)
      result   = @tester.create_object(form_obj, :children)
      expect(result).to be_a Person
      expect(person.children).to be_empty
    end

    it 'creates an object if cannot reflect on association' do
      object = double('AnyNonActiveRecordObject')
      expect(object).to receive(:build_non_reflectable).and_return 'custom'
      expect(@tester.create_object(double(object: object), :non_reflectable)).to eq('custom')
    end

    context "if object respond to 'build_association'" do
      subject do
        Class.new(Comment) do
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
      expect(@tester.create_object(@form, :comments, true)).to eq('flappie')
    end
  end
end
