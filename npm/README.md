# Cocooned

This is a companion package for the [cocooned Ruby gem](https://rubygems.org/gems/cocooned).

Cocooned makes it easier to handle nested forms in a Rails project.

Cocooned is form builder-agnostic: it works with standard Rails (>= 5.0, < 7.0) form helpers, [Formtastic](https://github.com/justinfrench/formtastic) or [SimpleForm](https://github.com/plataformatec/simple_form).

This package aims to ease cocooned integration with projects that use npm/Yarn to manage non-ruby dependencies and/or use webpacker to build their assets.

Cocooned depends on jQuery, Ruby (>= 2.5) and Rails (>= 5.0, < 7.0).

## Installation

With npm:
```shell
npm install @notus.sh/cocooned@<version>
```

With Yarn:
```shell
yarn add @notus.sh/cocooned@<version>
```

You should specify the same version (and version contraints) as in your `Gemfile`.

## Usage

### With Sprockets

In `config/initializers/assets.rb`, be sure you have something like this:

```ruby
Rails.configuration.tap do |config|
  # [...]
 
  # Ask Sprockets to load files in ./node_modules
  config.assets.paths << Rails.root.join('node_modules')
  # If you use sass-rails, ask Sass to do the same
  config.sass.load_paths << Rails.root.join('node_modules')
  
  # [...]
end
```

Then load Cocooned with:

```javascript
// In a javascript file
//= require '@notus.sh/cocooned/cocooned'
```

```css
/* In a stylesheet */
/*
 *= require '@notus.sh/cocooned/cocooned'
 */
```

### With Webpacker

```javascript
// In a javascript file
var Cocooned = require('@notus.sh/cocooned');
```

```css
/* In a stylesheet */
@import '@notus.sh/cocooned/cocooned';
```
