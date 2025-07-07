# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

* Remove Rails 7.0 from the test matrix (#92)
* Add Ruby 3.4 to the test matrix (#88)

## Version 2.4.1 (2024-11-25)

### Changed

* Add support for Rails 8.0 (#86)

## Version 2.4.0 (2024-10-01)

### Fixed

* Drop support for Rails < 7.0 (#73, thanks @mattmenefee)

### Changed

* Reintroduce Ruby 2.7 to the test matrix (#80)  
  So tested rubies are the same as supported Rails versions minimum requirements.

## Version 2.3.0 (2024-08-23)

### Fixed

* Add support for Rails v7.2 and drop support for Rails < 6.1 (#70, thanks @mattmenefee)

## Version 2.2.1 (2024-05-20)

## Fixed

* Add UMD build of Coconned missing in 2.2.0 

## Version 2.2.0 (2024-05-20)

## Added

* Compatibility with Trix (ActionText editor) (#65)
* Allow to setup custom replacements on newly built items before insert (#65) 

## Version 2.1.1 (2024-02-10)

### Fixed

* Template lookup in nested use cases (#61)  
  Template lookup used to be done on the whole HTML document so add triggers can be declared anywhere inside or outside a Cocooned container. In nested use cases, this could lead to incorrect template being used to build grand-child items when multiple child items had been built since the last form save. Lookup is now done first inside the closest Cocooned item if any to ensure the correct template will be used.

## Version 2.1.0 (2024-01-28)

### Added

* Add support for custom tag name to container helpers (#55, #56)  
  `cocooned_container` and `cocooned_item` now support an optional tag name as their first argument (as `content_tag` do) when the default `<div/>` is not appropriate.  
  **Warning:** This change is not supposed to break anything as helpers prototypes stays the same and no other positional argument where really expected before. However, depending on how you used these helpers with previous releases, you may encounter unexpected side effects.
* Documentation about nested use cases and event initialization (#59)

### Fixed

* Replacements operated on a newly built item in some nested use cases (#52, #57)  
  Replacements are now done recursively in nested templates if any exists. This should fix field naming in newly built items when multiple Cocooned instance are nested and correct naming of sub-items depends on generated names for their parent.

### Changed

* Update test matrix (#54)  
  Add Ruby 3.3. Drop Ruby 2.6 and Ruby 2.7

## Version 2.0.4 (2023-11-23)

### Fixed

*  Fix multiple callback executions in nested containers (#50)

## Version 2.0.3 (2023-10-13)

### Fixed

* Rails 7.1 support (#45)

## Version 2.0.2 (2023-05-09)

### Fixed

* Support nested event target in delegated event handlers (#42)

### Changed

* Rewrite dummy app with Rails 6 and webpacker (#40)

## Version 2.0.1 (2023-03-20)

### Fixed

* Webpack compatibility (#39)

## Version 2.0.0 (2023-03-07)

* Drop support for Rails < 6.0

### Breaking changes

#### Features dropped without any replacements

* Use of a function as `data-association-insertion-node` on add triggers support have been dropped (#18)  
  As HTML dataset are `DOMStringMap`, they only support strings as values. The only way to use a function to loop up for insertion node on an add trigger was to use jQuery (ex: `$(addTrigger).data('association-insertion-node', (add) => {})`).
* `data-remove-timeout` on remove triggers (#18)  
  Items are now removed at the end of their hiding animation.

#### Events listener now use `CustomEvent`s (#17)

Cocooned events have been rewritten around `CustomEvent`s and standard `addEventListener` / `dispatchEvent`.
You should either rewrite your event binding with `addEventListener` or change your jQuery ones as follow:

```diff
- $(element).on('cocooned:event', (e, node, cocooned) => {
+ $(element).on('cocooned:event', e => {
+   { node, cocooned } = e.detail // Use nodes in 'cocooned:before-reindex' / 'cocooned:after-reindex' events
  })
```

### Deprecations

These features are now deprecated and emit a warning message:

* `:insertion_traversal` option on `cocooned_add_item_link` (#18)
  Use a more specific selector as `data-association-insertion-node` (set through `:insertion_node`) instead.
* Importing `@notus.sh/cocooned/cocooned` in your JavaScript files (#22)  
  Import Cocooned from either `@notus.sh/cocooned`, `@notus.sh/cocooned/jquery` or `@notus.sh/cocooned/src/cocooned/cocooned` instead.

These features are now deprecated but don't emit any warning message (sorry):

* Containers identified only by the `data-cocooned-options` attribute (#26)  
  Use the `cocooned_container` helper in your forms.
* Containers identified only by the `.cocooned-item` class (#26)  
  Use the `cocooned_item` helper in your forms.

These features were already deprecated but now emit a warning message:

* `link_to_add_association` (replaced by `cocooned_add_item_link`)
* `link_to_remove_association` (replaced by `cocooned_remove_item_link`)
* The `cocoon` I18n namespace (replaced by `cocooned`)
* `:render_option` option on `cocooned_add_item_link` / `link_to_add_association`  
  Use `:form_options` and/or `:locals` instead.

These features were already deprecated but (still) don't emit any warning message (sorry):

* Events in `cocoon` namespace (replaced by `cocooned`)
* Triggers only identified by Cocoon classes (`.add_fields`, `.remove_fields`)
* Cocoon auto-start logic (non-identified containers)

All deprecated features will be removed in the next major release.

### Added

* Add support for association scoped label to `cocooned_move_item_up_link` and `cocooned_move_item_down_link` (#11)
* Replace dependency to jQuery by an optional jQuery integration (#22)
* Introduce `cocooned_container` and `cocooned_item` helpers to ease forms markup construction (#26) 
* Allow to choose between links or buttons for triggers (#27)
* Use Web Animation API for animations instead of CSS / jQuery (#29)

### Fixed

* Compatibility with Rails >= 7.0
* Compatibility with Ruby >= 3.1

### Changed

* Rewrite JavaScript tests suite with [Jest](https://jestjs.io/) (#2) (replace Jasmine, now deprecated)
* Reorganize JavaScript code and tests into the `npm` folder (#5)
* Rewrite JavaScript code to use ESM modules (#6) and modern ECMAScript idioms (#7, #14)
* Integrate deprecation messages with ActiveSupport::Deprecation (#9)
* Refactor helpers as tag classes (#10)
* Use HTML `<template>` instead of a data-attribute to pass subform template to JavaScript (#12)
* Split JavaScript monolith into smaller classes with minimal public API (#8, #18, #21)
* Isolate and unit test Cocoon compatibility code (#23)
* Use data-attributes instead of classes to hook JavaScript on (#26)
* Switch from Travis CI to Github actions (#30)
* Add Ruby 3.2 to CI (#32)
* Adapt NPM packaging scripts (#35)

## Version 1.4.1 (2022-08-08)

* Compatibility with Rails 7.0

## Version 1.4.0 (2021-08-15)

### Breaking changes

* Drop support for Rails < 5.0 and Ruby < 2.5
* Pass the original browser event to all event handlers _via_ e.originalEvent. (See [jQuery Event object](https://api.jquery.com/category/events/event-object/)).

### Backported (from cocoon 1.2.15)

* Add support for @hotwired/turbo (thanks @entretechno-jeremiah in [nathanvda/cocoon#600](https://github.com/nathanvda/cocoon/pull/600))

### Fixed

* Prevent side effects on options passed to view helpers.
* Prevent event propagation to parent elements (thanks @ashmill23 in [nathanvda/cocoon#560](https://github.com/nathanvda/cocoon/pull/560) and @zmagod in [nathanvda/cocoon#536](https://github.com/nathanvda/cocoon/pull/536))

### Changed

* Use form builder to add the hidden `_destroy` field instead of `hidden_field` (thanks @rradonic in [nathanvda/cocoon#559](https://github.com/nathanvda/cocoon/pull/559))
* Update deprecation warnings to postpone compatibility drop with the original `cocoon` to 3.0 (instead of 2.0)

## Version 1.3.2 (2019-04-05)

### Backported (from cocoon 1.2.13)

* Compatibility with Mongoid 7+ (thanks @startouf in [nathanvda/cocoon#527](https://github.com/nathanvda/cocoon/pull/527))

## Version 1.3.1 (2018-08-24)

### Changed

* Use UMD pattern to load the Cocooned module
* Now publish packages on both rubygems.org and npmjs.com (fixes [nathanvda/cocoon#452](https://github.com/nathanvda/cocoon/issue/452), [nathanvda/cocoon#555](https://github.com/nathanvda/cocoon/issue/555))

## Version 1.3.0 (2018-08-17)

### Breaking changes

* Drop support for Ruby 1.9 (thanks @simi)
* Drop support for Rubinius, Ruby < 2.2 and Rails < 4.0
* Drop support for custom wrapper class on item containers  
  Originaly supported _via_ an option on `link_to_remove_association`.

### Deprecated

The gem has been renamed to `cocooned`:

* `link_to_add_association` has been renamed `cocooned_add_item_link`
* Generated add links class `add_fields` has been renamed `cocooned-add`
* `link_to_remove_association` has been renamed `cocooned_remove_item_link`
* Generated remove links class `remove_fields` has been renamed `cocooned-remove`
* `cocoon:*` and `*.cocoon` Javascript events have been renamed to `cocooned:*` and `*.cocooned`  
  (ex: `cocooned:before-insert`, `click.cocooned`)
* The `cocoon` i18n scope have been renamed to `cocooned`
* The `.nested-fields` default item wrapper class have been renamed to `cocooned-item`

Other deprecations:

* `link_to_add_association`/`cocooned_add_item_link` no longer require a `:render_options` hash to pass locals to the nested partial

### Added

* Automatically remove `required` attributes on destroyed elements (thanks @markkhair in [nathanvda/cocoon#496](https://github.com/nathanvda/cocoon/pull/496), fixes [nathanvda/cocoon#386](https://github.com/nathanvda/cocoon/issue/386))
* Add extra properties on events (thanks @ayaman)
* Add a basic package.json to be used with Webpack (thanks @dmfrancisco in [nathanvda/cocoon#454](https://github.com/nathanvda/cocoon/pull/454))
* Namespace click handlers (thanks @chrise86 in [nathanvda/cocoon#310](https://github.com/nathanvda/cocoon/pull/310))

### Fixed

* Compatibility with jQuery 3 (thanks @mstmfm  in [nathanvda/cocoon#379](https://github.com/nathanvda/cocoon/pull/379))

### Changed

* Refactor cocoon javascript as a self-contained object with same functionalities
* Remove Jeweller (thanks @brixen, @tlynam)

---

For changes prior to 1.3.0 (from 1.0.0 to 1.2.11), please refer to the [cocoon changelog](https://github.com/nathanvda/cocoon/blob/master/History.md).

Many thanks to [all contributors to the original gem](https://github.com/nathanvda/cocoon/graphs/contributors).
