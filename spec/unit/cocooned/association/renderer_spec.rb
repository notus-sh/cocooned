# frozen_string_literal: true

RSpec.describe Cocooned::Association::Renderer do
  subject(:renderer) { described_class.new(template, form, association, record, options) }

  let(:template) { ActionView::Base.empty }
  let(:form) { ActionView::Helpers::FormBuilder.new('person', Person.new, template, {}) }
  let(:association) { :contacts }
  let(:record) { Person.new }
  let(:options) { {} }

  describe '#render' do
    shared_examples 'a sub-form renderer' do |method|
      it 'renders a sub-form' do
        allow(form).to receive(method)
        renderer.render
        expect(form).to have_received(method)
      end

      it 'renders a sub-form for association' do
        allow(form).to receive(method).with(association, any_args)
        renderer.render
        expect(form).to have_received(method).with(association, any_args)
      end

      it 'renders a sub-form for given object' do
        allow(form).to receive(method).with(anything, record, any_args)
        renderer.render
        expect(form).to have_received(method).with(anything, record, any_args)
      end

      it 'specifies child_index' do
        allow(form).to receive(method).with(any_args, hash_including(:child_index))
        renderer.render
        expect(form).to have_received(method).with(any_args, hash_including(:child_index))
      end

      it 'specifies a child_index based on association name' do
        allow(form).to receive(method).with(any_args, hash_including(child_index: 'new_contacts'))
        renderer.render
        expect(form).to have_received(method).with(any_args, hash_including(child_index: 'new_contacts'))
      end

      context 'with form_options' do
        let(:options) { { form_options: { multipart: true } } }

        it 'forwards them to the form builder' do
          allow(form).to receive(method).with(any_args, hash_including(multipart: true))
          renderer.render
          expect(form).to have_received(method).with(any_args, hash_including(multipart: true))
        end
      end
    end

    context 'with a Rails form' do
      it_behaves_like 'a sub-form renderer', :fields_for
    end

    context 'with a Formtastic form' do
      let(:form) { Formtastic::FormBuilder.new('person', Person.new, template, {}) }

      it_behaves_like 'a sub-form renderer', :semantic_fields_for
    end

    context 'with a SimpleForm form' do
      let(:form) { SimpleForm::FormBuilder.new('person', Person.new, template, {}) }

      it_behaves_like 'a sub-form renderer', :simple_fields_for
    end

    it 'renders a default partial' do
      allow(template).to receive(:render).with('contact_fields', any_args)
      renderer.render
      expect(template).to have_received(:render).with('contact_fields', any_args)
    end

    it 'uses :f as default form name' do
      allow(template).to receive(:render).with(anything, hash_including(f: an_instance_of(form.class)))
      renderer.render
      expect(template).to have_received(:render).with(anything, hash_including(f: an_instance_of(form.class)))
    end

    context 'with partial' do
      let(:options) { { partial: 'forms/contact' } }

      it 'uses given partial' do
        allow(template).to receive(:render).with('forms/contact', any_args)
        renderer.render
        expect(template).to have_received(:render).with('forms/contact', any_args)
      end
    end

    context 'with form_name' do
      let(:options) { { form_name: :form } }

      it 'uses given form_name' do
        allow(template).to receive(:render).with(anything, hash_including(form: an_instance_of(form.class)))
        renderer.render
        expect(template).to have_received(:render).with(anything, hash_including(form: an_instance_of(form.class)))
      end
    end

    context 'with locals' do
      let(:options) { { locals: { a: 1 } } }

      it 'forwards locals to partial rendering' do
        allow(template).to receive(:render).with(anything, hash_including(options[:locals]))
        renderer.render
        expect(template).to have_received(:render).with(anything, hash_including(options[:locals]))
      end
    end
  end
end
