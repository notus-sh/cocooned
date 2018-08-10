Gem::Specification.new do |spec|
  spec.name = "cocoon"
  spec.version = "1.2.8"

  spec.authors = ["Nathan Van der Auwera"]
  spec.email = "nathan@dixis.com"

  spec.description = "Unobtrusive nested forms handling, using jQuery. Use this and discover cocoon-heaven."
  spec.summary = "gem that enables easier nested forms with standard forms, formtastic and simple-form"
  spec.homepage = "http://github.com/nathanvda/cocoon"
  spec.licenses = ["MIT"]

  spec.extra_rdoc_files = ["README.markdown"]
  spec.files = `git ls-files`.split("\n").sort
  spec.require_paths = ["lib"]

  spec.add_development_dependency 'rake'
  spec.add_development_dependency 'bundler',      '~> 1.16'
  spec.add_development_dependency 'rspec',        '~> 3.8.0'
  spec.add_development_dependency 'rspec-rails',  '~> 3.8.0'
end
