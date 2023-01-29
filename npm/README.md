# Cocooned

This is a companion package for the [cocooned Ruby gem](https://rubygems.org/gems/cocooned).

Cocooned makes it easier to handle nested forms in a Rails project.

Cocooned is form builder-agnostic: it works with standard Rails (>= 5.0, < 7.0) form helpers, [Formtastic](https://github.com/justinfrench/formtastic) or [SimpleForm](https://github.com/plataformatec/simple_form).

This package aims to ease cocooned integration with projects that use npm/Yarn to manage non-ruby dependencies and/or use webpacker to build their assets.

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

To use Cocooned, import it in one of your JavaScript file with:

```javascript
import Cocooned from '@notus.sh/cocooned'

// Detect, create and setup all your Cocooned container at once
Cocooned.start()

// Or initialize them individually
// Without options
const cocooned = new Cocooned(document.querySelector('a selector to match container'))
// With options
const cocooned = new Cocooned(document.querySelector('a selector to match container'), { limit: 12 })
```

Options can also be provided as a JSON string in a `data-cocooned-options` on your container HTML tag. This is the recommended way to pass options from Ruby-land.

### Supported options

* `limit: {Integer}`: Set maximum number of items in your container to the specified limit.
* `reorderable`: Allow items in your container to be reordered (with their respective `position` field updated)  
  Can be specified as a boolean (`reorderable: true`) or with a `startAt` value updated positions will be counted from (`reorderable: { startAt: 0 }`, defaults to 1)

For more documentation, please look at the [cocooned Ruby gem](https://rubygems.org/gems/cocooned).

### Sprockets integration

In `config/initializers/assets.rb`, be sure you have something like this:

```ruby
Rails.configuration.tap do |config|
  # Ask Sprockets to load files in ./node_modules
  config.assets.paths << Rails.root.join('node_modules')
end
```

Then load Cocooned in one of your JavaScript file with:

```javascript
//= require '@notus.sh/cocooned/cocooned'

Cocooned.start()
```

### jQuery integration

Cocooned does not require jQuery but can integrates with it.

```javascript
import Cocooned from '@notus.sh/cocooned/jquery'
// Cocooned.start() is already bound on jQuery ready event.
```

Once loaded, you can use Cocooned as a jQuery plugin:

```javascript
// Without options
$('a selector to match container').cocooned()

// With options
$('a selector to match container').cocooned({ limit: 12 })
```
