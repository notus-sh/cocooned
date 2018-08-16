# frozen_string_literal: true

require 'nokogiri'

describe Cocooned::Helpers do
  before(:each) do
    @tester = Class.new(ActionView::Base).new
    @person = Person.new
    @form_obj = double(object: @person, object_name: @person.class.name)
  end

  describe '#cocooned_add_item_link' do
    before(:each) do
      allow(@tester).to receive(:render_association).and_return('form<tag>')
    end

    context 'without a block' do
      context 'and given a name' do
        before do
          @html = @tester.cocooned_add_item_link('add something', @form_obj, :posts)
        end

        it_behaves_like 'a correctly rendered add link',
                        {}
      end

      context 'and no name given' do
        context 'custom translation exists' do
          before do
            I18n.backend.store_translations(:en, cocooned: { posts: { add: 'Add a post' } })

            @html = @tester.cocooned_add_item_link(@form_obj, :posts)
          end

          after(:each) do
            I18n.reload!
          end

          it_behaves_like 'a correctly rendered add link',
                          text: 'Add a post'
        end

        context 'uses default translation' do
          before do
            I18n.backend.store_translations(:en, cocooned: { defaults: { add: 'Add' } })

            @html = @tester.cocooned_add_item_link(@form_obj, :posts)
          end

          after(:each) do
            I18n.reload!
          end

          it_behaves_like 'a correctly rendered add link',
                          text: 'Add'
        end
      end

      context 'and given html options to pass them to link_to' do
        before do
          @html = @tester.cocooned_add_item_link('add something', @form_obj, :posts, class: 'something silly')
        end

        it_behaves_like 'a correctly rendered add link',
                        class: 'something silly add_fields'
      end

      context 'and explicitly specifying the wanted partial' do
        before do
          allow(@tester).to receive(:render_association)
            .and_call_original
          expect(@tester).to receive(:render_association)
            .with(anything, anything, anything, 'f', anything, 'shared/partial')
            .and_return('partial')
          @html = @tester.cocooned_add_item_link('add something', @form_obj, :posts, partial: 'shared/partial')
        end

        it_behaves_like 'a correctly rendered add link',
                        template: 'partial'
      end

      it 'gives an opportunity to wrap/decorate created objects' do
        allow(@tester).to receive(:render_association)
          .and_call_original
        expect(@tester).to receive(:render_association)
          .with(anything, anything, kind_of(PostDecorator), 'f', anything, anything)
          .and_return('partiallll')
        @tester.cocooned_add_item_link('add something', @form_obj, :posts,
                                       wrap_object: proc { |p| PostDecorator.new(p) })
      end

      context 'force non association create' do
        context 'default case: create object on association' do
          before do
            expect(@tester).to receive(:create_object)
              .with(anything, :posts, false)
            @html = @tester.cocooned_add_item_link('add something', @form_obj, :posts)
          end

          it_behaves_like 'a correctly rendered add link',
                          {}
        end

        context 'and explicitly specifying false is the same as default' do
          before do
            expect(@tester).to receive(:create_object)
              .with(anything, :posts, false)
            @html = @tester.cocooned_add_item_link('add something', @form_obj, :posts, force_non_association_create: false)
          end
          it_behaves_like 'a correctly rendered add link',
                          {}
        end

        context 'specifying true will not create objects on association but using the conditions' do
          before do
            expect(@tester).to receive(:create_object)
              .with(anything, :posts, true)
            @html = @tester.cocooned_add_item_link('add something', @form_obj, :posts, force_non_association_create: true)
          end
          it_behaves_like 'a correctly rendered add link',
                          {}
        end
      end
    end

    context 'with a block' do
      context 'and the block specifies the link text' do
        before do
          @html = @tester.cocooned_add_item_link(@form_obj, :posts) do
            'some long name'
          end
        end
        it_behaves_like 'a correctly rendered add link',
                        text: 'some long name'
      end

      context 'accepts html options and pass them to link_to' do
        before do
          @html = @tester.cocooned_add_item_link(@form_obj, :posts, class: 'floppy disk') do
            'some long name'
          end
        end
        it_behaves_like 'a correctly rendered add link',
                        class: 'floppy disk add_fields',
                        text: 'some long name'
      end

      context 'accepts extra attributes and pass them to link_to' do
        context 'when using the old notation' do
          before do
            @html = @tester.cocooned_add_item_link(@form_obj, :posts, :class => 'floppy disk', 'data-something' => 'bla') do
              'some long name'
            end
          end
          it_behaves_like 'a correctly rendered add link',
                          class: 'floppy disk add_fields',
                          text: 'some long name',
                          extra_attributes: { 'data-something' => 'bla' }
        end

        context 'when using the new notation' do
          before do
            @html = @tester.cocooned_add_item_link(@form_obj, :posts, class: 'floppy disk', data: { 'association-something': 'foobar' }) do
              'some long name'
            end
          end
          it_behaves_like 'a correctly rendered add link',
                          class: 'floppy disk add_fields',
                          text: 'some long name',
                          extra_attributes: { 'data-association-something' => 'foobar' }
        end
      end

      context 'and explicitly specifying the wanted partial' do
        before do
          allow(@tester).to receive(:render_association)
            .and_call_original
          expect(@tester).to receive(:render_association)
            .with(anything, anything, anything, 'f', anything, 'shared/partial')
            .and_return('partial')
          @html = @tester.cocooned_add_item_link(@form_obj, :posts, class: 'floppy disk', partial: 'shared/partial') do
            'some long name'
          end
        end

        it_behaves_like 'a correctly rendered add link',
                        class: 'floppy disk add_fields',
                        template: 'partial',
                        text: 'some long name'
      end
    end

    context 'when adding a count' do
      before do
        @html = @tester.cocooned_add_item_link('add something', @form_obj, :posts, count: 3)
      end
      it_behaves_like 'a correctly rendered add link',
                      extra_attributes: { 'data-count' => '3' }
    end

    context 'when adding a limit' do
      before do
        @html = @tester.cocooned_add_item_link('add something', @form_obj, :posts, limit: 3)
      end
      it_behaves_like 'a correctly rendered add link',
                      extra_attributes: { 'data-limit' => '3' }
    end
  end

  describe '#cocooned_remove_item_link' do
    before do
      @post = Post.new
      @form_obj = double(object: @post, object_name: @post.class.name)
    end

    context 'without a block' do
      context 'accepts a name' do
        before do
          @html = @tester.cocooned_remove_item_link('remove something', @form_obj)
        end

        it 'is rendered inside a input element' do
          doc = Nokogiri::HTML(@html)
          removed = doc.at('input')
          expect(removed.attribute('id').value).to eq('Post__destroy')
          expect(removed.attribute('name').value).to eq('Post[_destroy]')
          expect(removed.attribute('value').value).to eq('false')
        end

        it_behaves_like 'a correctly rendered remove link',
                        {}
      end

      context 'no name given' do
        context 'custom translation exists' do
          before do
            I18n.backend.store_translations(:en, cocooned: { posts: { remove: 'Remove this post' } })
            @html = @tester.cocooned_remove_item_link(@form_obj)
          end

          after(:each) do
            I18n.reload!
          end

          it_behaves_like 'a correctly rendered remove link',
                          text: 'Remove this post'
        end

        context 'uses default translation' do
          before do
            I18n.backend.store_translations(:en, cocooned: { defaults: { remove: 'Remove' } })
            @html = @tester.cocooned_remove_item_link(@form_obj)
          end

          after(:each) do
            I18n.reload!
          end

          it_behaves_like 'a correctly rendered remove link',
                          text: 'Remove'
        end
      end

      context 'accepts html options and pass them to link_to' do
        before do
          @html = @tester.cocooned_remove_item_link('remove something', @form_obj, class: 'add_some_class', 'data-something': 'bla')
        end
        it_behaves_like 'a correctly rendered remove link',
                        class: 'add_some_class remove_fields dynamic',
                        extra_attributes: { 'data-something' => 'bla' }
      end
    end

    # this is needed when due to some validation error, objects that
    # were already marked for destruction need to remain hidden
    context 'for a object marked for destruction' do
      before do
        @post.mark_for_destruction
        @html = @tester.cocooned_remove_item_link('remove something', @form_obj)
      end

      it 'is rendered inside a input element' do
        doc = Nokogiri::HTML(@html)
        removed = doc.at('input')
        expect(removed.attribute('id').value).to eq('Post__destroy')
        expect(removed.attribute('name').value).to eq('Post[_destroy]')
        expect(removed.attribute('value').value).to eq('true')
      end

      it_behaves_like 'a correctly rendered remove link',
                      class: 'remove_fields dynamic destroyed'
    end

    context 'with a block' do
      context 'the block gives the name' do
        before do
          @html = @tester.cocooned_remove_item_link(@form_obj) do
            'remove some long name'
          end
        end
        it_behaves_like 'a correctly rendered remove link',
                        text: 'remove some long name'
      end

      context 'accepts html options and pass them to link_to' do
        before do
          @html = @tester.cocooned_remove_item_link(@form_obj, class: 'add_some_class', 'data-something': 'bla') do
            'remove some long name'
          end
        end
        it_behaves_like 'a correctly rendered remove link',
                        text: 'remove some long name',
                        class: 'add_some_class remove_fields dynamic',
                        extra_attributes: { 'data-something' => 'bla' }
      end
    end

    context 'when changing the wrapper class' do
      context 'should use the default nested-fields class' do
        before do
          @html = @tester.cocooned_remove_item_link('remove something', @form_obj)
        end

        it_behaves_like 'a correctly rendered remove link',
                        {}
      end

      context 'should use the given wrapper class' do
        before do
          @html = @tester.cocooned_remove_item_link('remove something', @form_obj, wrapper_class: 'another-class')
        end

        it_behaves_like 'a correctly rendered remove link',
                        extra_attributes: { 'data-wrapper-class' => 'another-class' }
      end
    end
  end
end
