# frozen_string_literal: true

require 'nokogiri'

describe Cocooned::Helpers do
  before(:each) do
    @tester = Class.new(ActionView::Base).new
    @person = Person.new
    @form   = double(object: @person, object_name: @person.class.name)
  end

  describe '#cocooned_add_item_link' do
    before(:each) do
      allow(@tester).to receive(:cocooned_render_association)
        .and_return('form<tag>')
    end

    context 'with an irregular plural' do
      context 'uses the correct plural' do
        before do
          @html = @tester.cocooned_add_item_link('add something', @form, :alumni)
        end

        it_behaves_like 'a correctly rendered add link',
                        association: 'alumnus',
                        associations: 'alumni'
      end
    end

    context 'when using aliased association and class-name' do
      context 'uses the correct name' do
        before do
          @html = @tester.cocooned_add_item_link('add something', @form, :alumni)
        end

        it_behaves_like 'a correctly rendered add link',
                        association: 'alumnus',
                        associations: 'alumni'
      end
    end

    context 'with extra render-options for rendering the child relation' do
      context 'uses the correct plural' do
        before do
          expect(@tester).to receive(:cocooned_render_association)
            .with(instance_of(Cocooned::AssociationBuilder), form_name: :f, wrapper: 'inline')

          @html = @tester.cocooned_add_item_link('add something', @form, :contacts, render_options: { wrapper: 'inline' })
        end

        it_behaves_like 'a correctly rendered add link',
                        association: 'contact',
                        associations: 'contacts'
      end
    end

    context 'passing locals to the partial' do
      context 'when given: passes the locals to the partials' do
        before do
          allow(@tester).to receive(:cocooned_render_association).and_call_original
          expect(@form).to receive(:fields_for) { |_assoc, _object, _options, &block| block.call }
          expect(@tester).to receive(:render)
            .with('contact_fields', f: nil, dynamic: true, alfred: 'Judoka')
            .and_return 'partial'

          @html = @tester.cocooned_add_item_link('add something',
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
          allow(@tester).to receive(:cocooned_render_association).and_call_original
          expect(@form).to receive(:fields_for) { |_assoc, _object, _options, &block| block.call }
          expect(@tester).to receive(:render)
            .with('contact_fields', f: nil, dynamic: true)
            .and_return 'partial'

          @html = @tester.cocooned_add_item_link('add something', @form, :contacts, render_options: { wrapper: 'inline' })
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
          allow(@tester).to receive(:cocooned_render_association).and_call_original
          expect(@form).to receive(:fields_for) { |_assoc, _object, _options, &block| block.call }
          expect(@tester).to receive(:render)
            .with('contact_fields', student_form: nil, dynamic: true)
            .and_return 'partial'

          @html = @tester.cocooned_add_item_link('add something', @form, :contacts, form_name: 'student_form')
        end

        it_behaves_like 'a correctly rendered add link',
                        template: 'partial',
                        association: 'contact',
                        associations: 'contacts'
      end
    end
  end
end
