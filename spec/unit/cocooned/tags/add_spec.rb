# frozen_string_literal: true

require_relative './shared/association_tag'
require_relative './shared/tag'

describe Cocooned::Tags::Add, :tag do
  before { allow(template).to receive(:render).and_return(item) }

  let(:builders) { Cocooned::Association::Builder }
  let(:renderers) { Cocooned::Association::Renderer }

  let(:item) { '<div class="cocooned-item"></div>'.html_safe }
  let(:template) { ActionView::Base.empty }
  let(:association) { :contacts }
  let(:record) { Person.new }
  let(:form) { ActionView::Helpers::FormBuilder.new('person', record, template, {}) }

  it_behaves_like 'an action tag builder', :add
  it_behaves_like 'an action tag builder with an association', :add, :contacts

  it 'has a default class' do
    expect(tag.attribute('class').value.split).to include('cocooned-add')
  end

  it 'has a compatibility class with the original Cocoon', deprecation: '3.0' do
    expect(tag.attribute('class').value.split).to include('add_fields')
  end

  it 'supports more classes' do
    expect(tag(class: %i[one two]).attribute('class').value.split).to include('one', 'two', 'cocooned-add')
  end

  it 'has a data attribute for association' do
    expect(tag.attribute('data-association').value).to eq(association.to_s)
  end

  #
  # Association options
  #
  context 'with count' do
    it 'has a data attribute with a default value for count by default' do
      expect(tag.attribute('data-association-insertion-count').value.to_i).to eq(1)
    end

    it 'has a data attribute for count when given' do
      expect(tag(count: 2).attribute('data-association-insertion-count').value.to_i).to eq(2)
    end
  end

  context 'with insertion method' do
    it 'does not have a data attribute for insertion method by default' do
      expect(tag.attribute('data-association-insertion-method')).to be_nil
    end

    it 'has a data attribute for insertion method when given' do
      attr = tag(insertion_method: :after).attribute('data-association-insertion-method')
      expect(attr.value).to eq('after')
    end

    # Not recommended
    it 'supports association_insertion_method as a data attribute' do
      attr = tag(data: { association_insertion_method: :after }).attribute('data-association-insertion-method')
      expect(attr.value).to eq('after')
    end
  end

  context 'with insertion node' do
    it 'does not have a data attribute for insertion node by default' do
      expect(tag.attribute('data-association-insertion-node')).to be_nil
    end

    it 'has a data attribute for insertion node when given' do
      attr = tag(insertion_node: '.container').attribute('data-association-insertion-node')
      expect(attr.value).to eq('.container')
    end

    # Not recommended
    it 'supports association_insertion_node as a data attribute' do
      attr = tag(data: { association_insertion_node: '.container' }).attribute('data-association-insertion-node')
      expect(attr.value).to eq('.container')
    end
  end

  context 'with insertion traversal' do
    it 'does not have a data attribute for insertion traversal by default' do
      expect(tag.attribute('data-association-insertion-traversal')).to be_nil
    end

    it 'has a data attribute for insertion traversal when given' do
      attr = tag(insertion_traversal: :parent).attribute('data-association-insertion-traversal')
      expect(attr.value).to eq('parent')
    end

    # Not recommended
    it 'supports association_insertion_traversal as a data attribute' do
      attr = tag(data: { association_insertion_traversal: :parent }).attribute('data-association-insertion-traversal')
      expect(attr.value).to eq('parent')
    end
  end

  #
  # Building options
  #
  it 'forwards record to a Cocooned::Association::Builder' do
    allow(builders).to receive(:new).with(record, any_args).and_call_original
    tag
    expect(builders).to have_received(:new).with(record, any_args).once
  end

  it 'forwards association to a Cocooned::Association::Builder' do
    allow(builders).to receive(:new).with(anything, association, any_args).and_call_original
    tag
    expect(builders).to have_received(:new).with(anything, association, any_args).once
  end

  shared_examples 'a builder options forwarder' do |option, value|
    it "forwards #{option} to a Cocooned::Association::Builder" do
      allow(builders).to receive(:new).with(record, association, hash_including(option => value)).and_call_original
      tag(option => value)
      expect(builders).to have_received(:new).with(record, association, hash_including(option => value))
    end
  end

  it_behaves_like 'a builder options forwarder', :wrap_object, ->(o) { o }
  it_behaves_like 'a builder options forwarder', :force_non_association_create, true

  #
  # Rendering options
  #
  it 'forwards template to a Cocooned::Association::Renderer' do
    allow(renderers).to receive(:new).with(template, any_args).and_call_original
    tag
    expect(renderers).to have_received(:new).with(template, any_args).once
  end

  it 'forwards form to a Cocooned::Association::Renderer' do
    allow(renderers).to receive(:new).with(anything, form, any_args).and_call_original
    tag
    expect(renderers).to have_received(:new).with(anything, form, any_args).once
  end

  it 'forwards association to a Cocooned::Association::Renderer' do
    allow(renderers).to receive(:new).with(anything, anything, association, any_args).and_call_original
    tag
    expect(renderers).to have_received(:new).with(anything, anything, association, any_args).once
  end

  context 'with a build object' do # rubocop:disable RSpec/MultipleMemoizedHelpers
    before do
      allow(builders).to receive(:new).and_return(builder)
      allow(builder).to receive(:build).and_return(object)
    end

    let(:builder) { instance_double(builders) }
    let(:object) { double }

    it 'forwards builder result to a Cocooned::Association::Renderer' do
      allow(renderers).to receive(:new).with(anything, anything, anything, object, any_args).and_call_original
      tag
      expect(renderers).to have_received(:new).with(anything, anything, anything, object, any_args).once
    end
  end

  shared_examples 'a renderer options forwarder' do |option, value|
    it "forwards #{option} to a Cocooned::Association::Renderer" do
      allow(renderers).to receive(:new).with(any_args, hash_including(option => value)).and_call_original
      tag(option => value)
      expect(renderers).to have_received(:new).with(any_args, hash_including(option => value))
    end
  end

  it_behaves_like 'a renderer options forwarder', :form_name, :form
  it_behaves_like 'a renderer options forwarder', :form_options, class: :'nested-form'
  it_behaves_like 'a renderer options forwarder', :partial, 'person'
  it_behaves_like 'a renderer options forwarder', :locals, { a: 1 }

  context 'with render options', deprecation: '3.0' do
    context 'with locals' do
      let(:render_options) { { locals: { a: 1 } } }

      it 'forwards :locals to a Cocooned::Association::Renderer' do
        allow(renderers).to receive(:new).with(any_args, hash_including(**render_options)).and_call_original
        tag(render_options: render_options)
        expect(renderers).to have_received(:new).with(any_args, hash_including(**render_options))
      end

      it 'warns about deprecation' do
        with_deprecation_as_exception(Cocooned::Deprecation['3.0']) do
          expect { tag(render_options: render_options) }.to raise_error(ActiveSupport::DeprecationException)
        end
      end
    end

    context 'with form options' do
      let(:render_options) { { namespace: :any } }

      it 'forwards :locals to a Cocooned::Association::Renderer' do
        allow(renderers).to receive(:new).with(any_args, hash_including(form_options: render_options)).and_call_original
        tag(render_options: render_options)
        expect(renderers).to have_received(:new).with(any_args, hash_including(form_options: render_options))
      end

      it 'warns about deprecation' do
        with_deprecation_as_exception(Cocooned::Deprecation['3.0']) do
          expect { tag(render_options: render_options) }.to raise_error(ActiveSupport::DeprecationException)
        end
      end
    end
  end

  it 'outputs an HTML template' do
    expect(html.at('template')).not_to be_nil
  end

  it 'outputs an HTML template with a data-name attribute' do
    expect(html.at('template').attribute('data-name')).not_to be_nil
  end

  it "outputs an HTML template with the same name as link's data-template attribute" do
    rendered = html
    link_template = rendered.at('a').attribute('data-template').value
    template_name = rendered.at('template').attribute('data-name').value

    expect(template_name).to eq(link_template)
  end

  it 'outputs an HTML template with renderer output' do
    expect(html.at('template').inner_html).to eq(item)
  end
end
