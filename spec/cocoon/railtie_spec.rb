# frozen_string_literal: true

describe Cocoon::Railtie do
  subject { Class.new(ActionView::Base).new }

  it { is_expected.to respond_to(:link_to_add_association) }
  it { is_expected.to respond_to(:link_to_remove_association) }
end
