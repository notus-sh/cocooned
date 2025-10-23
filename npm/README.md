# Cocooned

This is a companion package for the [cocooned Ruby gem](https://rubygems.org/gems/cocooned).

Cocooned makes it easier to handle nested forms in Rails.

Cocooned is form builder-agnostic: it works with standard Rails (>= 7.0, < 8.2) form helpers, [Formtastic](https://github.com/justinfrench/formtastic) or [SimpleForm](https://github.com/plataformatec/simple_form).

1. [Installation](#installation)
2. [Import](#import), default, custom or with [jQuery integration](#jquery-integration)
3. [Usage](#usage)
4. [Options](#options)
5. [Events](#events)
6. [Migration from a previous version](#migration-from-a-previous-version) or from Cocoon

## Installation

Install it with your favorite package manager:

```shell
# bun
$ bun install @notus.sh/cocooned
# importmap (Rails ~7.0 default)
$ bin/importmap pin @notus.sh/cocooned
# npm
$ npm install @notus.sh/cocooned
# pnpm
$ pnpm add @notus.sh/cocooned
# yarn
$ yarn add @notus.sh/cocooned
```

**Note:** To ensure you will always get the version of the companion package that match with the gem version, you should specify the same version constraint you used for the `cocooned` gem in your `Gemfile`.

## Import

Once installed, you have different ways to import Cocooned, depending on what you need.

### Default

To get the default build of Cocooned with all built-in plugins available, load package main file:

```javascript
import Cocooned from '@notus.sh/cocooned'
Cocooned.start()
```

### Customization

If you know you'll not use the plugin, you can load the core version:

```javascript
import Cocooned from '@notus.sh/cocooned/src/cocooned/cocooned.js'
Cocooned.start()
```

If you want only one of the plugins, you can load the core Cocooned and extend it with the plugin:

```javascript
import { Cocooned as Base } from '@notus.sh/cocooned/src/cocooned/cocooned.js'
import { limitMixin } from '@notus.sh/cocooned/src/cocooned/plugins/limit.js'

class Cocooned extends limitMixin(Base) {
  static create (container, options) {
    if ('cocoonedUuid' in container.dataset) {
      return Cocooned.getInstance(container.dataset.cocoonedUuid)
    }
    
    const cocooned = new this.constructor(container, options)
    cocooned.start()

    return cocooned
  }

  static start () {
    document.querySelectorAll('[data-cocooned-container]')
            .forEach(element => this.constructor.create(element))
  }
}

Cocooned.start()
```

## Usage

**Note:** Classes, methods and options other than those documented here can not be considered as a public API and are subject to changes between versions. See (and feel free to collaborate to) [this issue](https://github.com/notus-sh/cocooned/issues/3) for a future stable public API.

```javascript
import Cocooned from '@notus.sh/cocooned'

// Detect, create and setup all your Cocooned container at once
Cocooned.start()

// Or initialize them individually
// Without options
const cocooned = Cocooned.create(document.querySelector('a selector to match container'))
// With options
const cocooned = Cocooned.create(document.querySelector('a selector to match container'), { limit: 12 })
```

Options can also be provided as a JSON string in a `data-cocooned-options` on your container HTML tag. This is the recommended way to pass options from Ruby-land (and is bundled in the `coconned_container` helper provided by the [cocooned Ruby gem](https://rubygems.org/gems/cocooned)).

### Complex nested forms

Although they come with their own challenges, as building a comprehensive interface for your users or dealing with validations on multiple levels, in some complex use cases you have no choices but to build forms with multiple levels of sub-components you may want to manage with Cocooned.

As Cocooned is commonly initialized on page load with `Cocooned.start()`, action triggers in dynamically added child items (to add grand-child items) or to manipulate grand-child items (to delete them or to move them up or down if you use the reorderable plugin) will not be handled at first.

To handle them, you need to tell Cocooned to initialize their event handlers when a new item is added with:

```javascript
document.addEventListener('cocooned:after-insert', e => Cocooned.create(e.detail.node))
```

### jQuery integration

Cocooned does not require jQuery (anymore) but comes with a jQuery integration (inherited from previous versions). If you use jQuery, you may want to use Cocooned with jQuery:

```javascript
import Cocooned from '@notus.sh/cocooned/jquery.js'
```

**Note:** You don't need to call `Cocooned.start()` here as the jQuery integration automatically bind it to `$.ready`.

You can use Cocooned as a jQuery plugin:

```javascript
// Without options
$('a selector to match container').cocooned()

// With options
$('a selector to match container').cocooned(options)
```

## Options

### Core options

Any Cocooned instance supports following options:

#### `animate: [Boolean]`  

Toggle animations when moving or removing an item from the form. Default value depend on detected support of the [Web Animation API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API).

#### `duration: [Integer]`  

Duration of animations, in milliseconds. Defaults to 450.

#### `animator: [Function]`  

A function returning animation keyframes, either an array of keyframe objects or a keyframe object whose properties are arrays of values to iterate over. See [Keyframe Formats documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats) for more details.

For an example of the expected function behavior, [look at the default animator](https://github.com/notus-sh/cocooned/blob/main/npm/src/cocooned/base.js#L24)

### Plugins options

#### `limit: {Integer}`

Available with the limit plugin. Set maximum number of items in your container to the specified limit.

#### `reorderable: [Boolean|Object]`

Available with the reorderable plugin. Allows items in your container to be reordered (with their respective `position` field updated).

Can be specified as a boolean (`reorderable: true`) or with a `startAt` value updated positions will be counted from (`reorderable: { startAt: 0 }`, defaults to 1)

## Events

When your collection is modified, the following events can be triggered:

* `cocooned:before-insert`: before inserting a new item, can be [canceled](#cancel-an-action)
* `cocooned:after-insert`: after inserting a new item
* `cocooned:before-remove`: before removing an item, can be [canceled](#cancel-an-action)
* `cocooned:after-remove`: after removing an item

The limit plugin can trigger its own event:

* `cocooned:limit-reached`: when the limit is reached (when a new item should be inserted but won't)  
  **Note:** Listeners on this event receive the event object that originally triggered the refused insertion.

And so does the reorderable plugin:

* `cocooned:before-move`: before moving an item, can be [canceled](#cancel-an-action)
* `cocooned:after-move`: after moving an item
* `cocooned:before-reindex`: before updating the `position` fields of items, can be [canceled](#cancel-an-action) (even if I honestly don't know why you would)
* `cocooned:after-reindex`: after updating the `position` fields of items

To listen to the events in your JavaScript:

```javascript
container.addEventListener('cocooned:before-insert', event => {
  /* Do something */
});
```

Event handlers receive a `CustomEvent` with following detail:

* `event.detail.link`, the clicked link or button
* `event.detail.node`, the item that will be added, removed or moved.  
  Unavailable on `cocooned:limit-reached`, `cocooned:before-reindex` and `cocooned:after-reindex`
* `event.nodes`, the nested items that will be or just have been reindexed.  
  Available on `cocooned:before-reindex` and `cocooned:after-reindex`
* `event.detail.cocooned`, the Cocooned instance.
* `event.detail.originalEvent`, the original (browser) event.

### Cancel an action

You can cancel an action within the `cocooned:before-<action>` callback using `event.preventDefault()`.

## Attribute substitutions on create

New items need to have a bunch of attributes updated before insert to make their `name`, `id` and `for` attributes consistent and unique. If you need additional substitutions to be made, you can configure them with:

```javascript
import Cocooned from '@notus.sh/cocooned'

/**
 * These 4 replacements are already set by default.
 */
Cocooned.registerReplacement({ attribute: 'name', delimiters: ['[', ']'] })
// Same start and end? Don't repeat yourself.
Cocooned.registerReplacement({ attribute: 'id', delimiters: ['_'] })
// You can target specific tags (else '*' is implied).
Cocooned.registerReplacement({ tag: 'label', attribute: 'for', delimiters: ['_'] })
Cocooned.registerReplacement({ tag: 'trix-editor', attribute: 'input', delimiters: ['_'] })
```

## Migration from a previous version

These migrations steps only highlight major changes. When upgrading from a previous version, always refer to [the CHANGELOG](https://github.com/notus-sh/cocooned/blob/main/CHANGELOG.md) for new features and breaking changes.

### From Cocooned ~1.0

Cocooned events have been rewritten around `CustomEvent`s and standard `addEventListener` / `dispatchEvent` in version 2.0. This does not allow more than a single `event` parameter in listeners, in opposition to what was in use with jQuery listeners.

It is up to you to still bind your listeners with jQuery but you need to rewrite them as follow:

```diff
- $(element).on('cocooned:<event-name>', (e, node, cocooned) => {
-   { originalEvent } = e.detail
+ $(element).on('cocooned:<event-name>', e => {
+   { node, cocooned, originalEvent } = e.detail
  })
```

### From Cocoon ~1.2.13

Cocooned is a rewrite of [Cocoon](https://github.com/nathanvda/cocoon) by [Nathan Van der Auwera](https://github.com/nathanvda) and is still almost 100% compatible with it.

Cocoon 1.2.13 introduced the original browser event as a third parameter to all event handlers when Cocooned had already started to use this to pass the Cocooned object instance (since 1.3.0).

If you are updating from Cocoon ~1.2.13, you need to rewrite your event listeners as follow:

```diff
- $(element).on('cocoon:<event-name>', (e, node, originalEvent) => {
+ $(element).on('cocooned:<event-name>', e => {
+   { node, originalEvent } = e.detail
  })
```

### From Cocoon (any version)

#### Events

Cocooned uses its own namespace for event names. Cocooned 2.0 still trigger events in the original `cocoon` namespace but **this will be dropped in the next major release.**

You need to rename events when binding your listeners:

* `cocoon:before-insert` is renamed to `cocooned:before-insert`
* `cocoon:after-insert` is renamed to `cocooned:after-insert`
* `cocoon:before-remove` is renamed to `cocooned:before-remove`
* `cocoon:after-remove` is renamed to `cocooned:after-remove`

The original Cocoon does not support any of the other events.

#### Auto-start

Cocoon auto-start was based on a detection of the links to add item (identified by their `.add_fields` class) to a (non-identified) container. Cocooned reverses this logic to identify containers first and look for add triggers (links or buttons) with an insertion point inside of them.

This means you need to have your container clearly identified in your HTML. The easiest way to do so is to use the `cocooned_container` and `cocooned_item` helpers provided by the [Ruby gem](https://rubygems.org/gems/cocooned).
