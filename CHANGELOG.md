# Change History / Release Notes

## Version 2.0.0

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

### New features

* Add support for association scoped label to `cocooned_move_item_up_link` and `cocooned_move_item_down_link` (#11)
* Replace dependency to jQuery by an optional jQuery integration (#22)
* Introduce `cocooned_container` and `cocooned_item` helpers to ease forms markup construction (#26) 
* Allow to choose between links or buttons for triggers (#27)
* Use Web Animation API for animations instead of CSS / jQuery (#29)

### Bug fixes and other changes

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

## Version 1.4.1

* Compatibility with Rails >= 7.0
* Compatibility with Ruby >= 3.1

## Version 1.4.1

* Compatibility with Rails 7.0

## Version 1.4.0

### Breaking changes

* Drop support for Rails < 5.0 and Ruby < 2.5
* Pass the original browser event to all event handlers _via_ e.originalEvent. (See [jQuery Event object](https://api.jquery.com/category/events/event-object/)).

### New features

* Add support for @hotwired/turbo (thanks @entretechno-jeremiah in [nathanvda/cocoon#600](https://github.com/nathanvda/cocoon/pull/600))

### Bug fixes and other changes

* Prevent side effects on options passed to view helpers.
* Prevent event propagation to parent elements (thanks @ashmill23 in [nathanvda/cocoon#560](https://github.com/nathanvda/cocoon/pull/560) and @zmagod in [nathanvda/cocoon#536](https://github.com/nathanvda/cocoon/pull/536))
* Use form builder to add the hidden `_destroy` field instead of `hidden_field` (thanks @rradonic in [nathanvda/cocoon#559](https://github.com/nathanvda/cocoon/pull/559))
* Update deprecation warnings to postpone compatibility drop with the original `cocoon` to 3.0 (instead of 2.0)

## Version 1.3.2

* Compatibility with Mongoid 7+ (thanks @startouf in [nathanvda/cocoon#527](https://github.com/nathanvda/cocoon/pull/527))

## Version 1.3.1

* Use UMD pattern to load the Cocooned module
* Now publish packages on both rubygems.org and npmjs.com (fixes [nathanvda/cocoon#452](https://github.com/nathanvda/cocoon/issue/452), [nathanvda/cocoon#555](https://github.com/nathanvda/cocoon/issue/555))

## Version 1.3.0

### Breaking changes

* Drop support for Rubinius, Ruby < 2.2 and Rails < 4.0
* Drop support for custom wrapper class on item containers (originaly supported _via_ an option on `link_to_remove_association`).

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

### Non-breaking changes

* Refactor cocoon javascript as a self-contained object with same functionalities
* Automatically remove `required` attributes on destroyed elements (thanks @markkhair in [nathanvda/cocoon#496](https://github.com/nathanvda/cocoon/pull/496), fixes [nathanvda/cocoon#386](https://github.com/nathanvda/cocoon/issue/386))
* Add extra properties on events (thanks @ayaman)
* Add a basic package.json to be used with Webpack (thanks @dmfrancisco in [nathanvda/cocoon#454](https://github.com/nathanvda/cocoon/pull/454))
* Compatibility with jQuery 3 (thanks @mstmfm  in [nathanvda/cocoon#379](https://github.com/nathanvda/cocoon/pull/379))
* Namespace click handlers (thanks @chrise86 in [nathanvda/cocoon#310](https://github.com/nathanvda/cocoon/pull/310))
* Drop support for Ruby 1.9 (thanks @simi)
* Remove Jeweller (thanks @brixen, @tlynam)

## Version 1.2.11

* Allow events to be cancelled in the 'before' callbacks (thanks @wgordon17)

## Version 1.2.10

* Use lazy-loading in initializer

## Version 1.2.9

* Allow function pass to association-insertion-node (thanks @Liooo)

## Version 1.2.8

* Compatibility with Turbolinks

## Version 1.2.7

* Fix SimpleForm/Formtastic detections (thanks @mfrederickson)
* Add default captions for add and remove links through I18n (thanks @ViliusLuneckas)

## Version 1.2.6

* added some explicit documentation we use haml. Fixed the formtastic example.
* "unfreeze" frozen objects. Fixes #193.
* IE8 jquery fix (thanks @niuage).
* merged #191 which fixes an issue with a monkeypatched CGI. For more info, see
  ticket #191. Thanks gsmendoza.

## Version 1.2.5

* fix gem dependencies: we added gems to allow building for rubinius, but those are only
  needed when developing

## Version 1.2.4

* the wrapper class is now configurable. Before it was assumed to be `nested-fields`.
  Now it is configurable by handing. See #180. Thanks Yoav Matchulsky.
* fix build on travis-ci for rubinius (thanks brixen).

## Version 1.2.3

* add license info

## Version 1.2.2

* added option to add multiple items on one click. See #175.
* cleaned up javascript code. See #171.


## Version 1.2.1

* added a `:form_name` parameter (fixes #153) which allows to use a self-chosen
  parameter in the nested views. Up until now `f` was assumed (and enforced).
* improvement of creation of the objects on the association (thanks to Dirk von Grünigen). This
  alleviates the need for the `:force_non_association_create` option in most cases.
  That option is for now still kept.
* after validation errors, already deleted (but not saved) nested elements, will remain deleted
  (e.g. the state is remembered, and they remain hidden, and will be correctly deleted on next
  succesfull save) (fixes #136).

## Version 1.2.0

* support for rails 4.0

## Version 1.1.2

* pull #118 (thanks @ahmozkya): remove the deprecated `.live` function, and use `.on` instead.
  Note: at least jquery 1.7 is required now!

## Version 1.1.1

* added the to be added/deleted element to the event, this allows to add animations/actions onto them
* added extra option :wrap_object, allowing to use Decorators instead of the association object
* added an option :force_non_association_create, that will allow to use `link_to_add_association` inside the fields-partial

## Version 1.1.0

* BREAKING: the triggered javascript events `removal-callback`, `after-removal-callback`, and `insertion-callback` are renamed to the more correct and symmetric
  `cocoon:after-insert, cocoon:before-insert, cocoon:after-remove, cocoon:before-remove`. Also the events are namespaced to prevent collisions with other libraries.
* allow created objects to be decorated with a callable. This is especially useful if you are using Draper or some decorator instead of the plain model in your views.
* it is now possible to specify a relative node, and use standard jquery traversal methods on insertion
* trigger insertion event on correct `insertionNode`
* thanks to #90 cocoon now supports non-AR associations and array-fields, you just have to supply your own `build_<association>` methods

I would really really like to thank all contributors, check them out https://github.com/nathanvda/cocoon/graphs/contributors
They made cocoon way more awesome than I could have done in my lonesome.

## Version 1.0.22

* Fix that it still works for mongoid

## Version 1.0.21

* Use association build methods instead of assoc.klass.new. This avoids mass-assignment errors and other misbehaviors around attribute accessibility.


## Version 1.0.20

* improved handing of the `:partial`: remove the extra options-hash, and just make it use the single hash, so now we can just write

     = link_to_add_association 'add something', f, :tasks, :partial => 'shared/task_fields'
     = link_to_add_association 'add something', f, :tasks, :class => 'your-special-class', :partial => 'shared/task_fields'


## Version 1.0.19

* pull #53 (@CuriousCurmudgeon): fixed some bugs introduced in previous version (ooooops! Thanks!!!)

## Version 1.0.18

* pull in #51 (@erwin): adding an `after-removal-callback` in javascript, very useful if you want to recalculate e.g. total-items or indexes
* pull in #42 (@zacstewart): allow to hand extra `:locals` to the partial
* updated documentation

## Version 1.0.17

* fix: make sure that cocoon still works for rails 3.0, where the `conditions` is not available yet

## Version 1.0.16

* merged pull request #33 (@fl00r): added the a custom partial option! genius :)
  Also the creation of the nested objects takes any available conditions into account.
  Now you can write

     = link_to_add_association 'add something', f, :tasks, {}, :partial => 'shared/task_fields'

## Version 1.0.15

* added `data-association-insertion-method` that gives more control over where to insert the new nested fields.
  It takes a jquery method as parameter that inserts the new data. `before`, `after`, `append`, `prepend`, etc. Default: `before`.
* `data-association-insertion-position` is still available and acts as an alias. Probably this will be deprecated in the future.


## Version 1.0.14

* When playing with `simple_form` and `twitter-bootstrap`, I noticed it is crucial that I call the correct nested-fields function.
  That is: `fields_for` for standard forms, `semantic_fields_for` in formtastic and `simple_fields_for` for simple_form.
  Secondly, this was not enough, I needed to be able to hand down options to that method. So in the `link_to_add_association` method you
  can now an extra option `:render_options` and that hash will be handed to the association-builder.

  This allows the nested fields to be built correctly with `simple_form` for `twitter-bootstrap`.

## Version 1.0.13

* A while ago we added the option to add a javascript callback on inserting a new associated object, I now made sure we can add a callback on insertion
  and on removal of a new item. One example where this was useful for me is visible in the demo project `cocoon_simple_form_demo` where I implemented a
  `belongs_to` relation, and either select from a list, or add a new element.
  So: the callback-mechanism has changed, and now the callback is bound to the parent container, instead of the link itself. This is because we can also
  bind the removal callback there (as the removal link is inserted in the html dynamically).

  For more info, see the `README`.

## Version 1.0.12

* using "this" in `association-insertion-node` is now possible

If you are using rails < 3.1, you should run

    rails g cocoon:install

to install the new `cocoon.js` to your `public/javascripts` folder.


## Version 1.0.11


## Version 1.0.10

* Fuck! Built the gem with 1.9.2 again. Built the gem again with 1.8.7.

## Version 1.0.9

* is now rails 3.1 compatible. If you are not using Rails 3.1 yet, this should have no effect.
  For rails 3.1 the cocoon.js no longer needs to be installed using the `rails g cocoon:install`. It is
  automatically used from the gem.

## Version 1.0.8

* Loosened the gem dependencies.

## Version 1.0.7 (20/06/2011)

Apparently, the gem 1.0.6 which was generated with ruby 1.9.2 gave the following error upon install:

      uninitialized constant Psych::Syck (NameError)

This is related to this bug: http://rubyforge.org/tracker/?group_id=126&atid=575&func=detail&aid=29163

This should be fixed in the next release of rubygems, the fix should be to build the gem with ruby 1.8.7.
Let's hope this works.

## Version 1.0.6 (19/06/2011)

* The javascript has been improved to consistently use `e.preventDefault` instead of returning false.

Run

    rails g cocoon:install

to copy the new `cocoon.js` to your `public/javascripts` folder.


## Version 1.0.5 (17/06/2011)

* This release make sure that the `link_to_add_association` generates a correctly clickable
  link in the newer rails 3 versions as well. In rails 3.0.8. the html was double escaped.

If you are upgrading from 1.0.4, you just have to update the gem. No other actions needed. If you are updating
from earlier versions, it is safer to do

    rails g cocoon:install

This will copy the new `cocoon.js` files to your `public/javascripts` folder.


