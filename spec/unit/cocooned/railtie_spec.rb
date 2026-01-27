# frozen_string_literal: true

RSpec.describe Cocooned::Railtie do
  subject(:view) { ActionView::Base.empty }

  it { is_expected.to respond_to(:cocooned_container) }
  it { is_expected.to respond_to(:cocooned_item) }

  it { is_expected.to respond_to(:cocooned_add_item_link) }
  it { is_expected.to respond_to(:cocooned_remove_item_link) }
  it { is_expected.to respond_to(:cocooned_move_item_up_link) }
  it { is_expected.to respond_to(:cocooned_move_item_down_link) }

  context 'with deprecated methods', deprecation: '4.0' do
    it { is_expected.to respond_to(:link_to_add_association) }
    it { is_expected.to respond_to(:link_to_remove_association) }
  end
end
