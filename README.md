# Cocooned

![Build status](https://github.com/notus-sh/cocooned/actions/workflows/unit-tests.yml/badge.svg?branch=master)

Cocooned makes it easier to handle nested forms in a Rails project.

Cocooned is form builder-agnostic: it works with standard Rails (>= 5.0, < 7.1) form helpers, [Formtastic](https://github.com/justinfrench/formtastic) or [SimpleForm](https://github.com/plataformatec/simple_form).

1. [Background](#some-background)
2. [Installation](#installation)
3. [Getting started](#getting-started)
4. [Going further with plugins](#going-further-with-plugins)

## Some Background

Cocooned is a fork of [Cocoon](https://github.com/nathanvda/cocoon) by [Nathan Van der Auwera](https://github.com/nathanvda). He and all Cocoon contributors did a great job to maintain it for years. Many thanks to them!

However, the project seems to have only received minimal fixes since 2018 and many pull requests, even simple ones, have been on hold for a long time. In 2019, as I needed a more than what Cocoon provided at this time, I had the choice to either maintain an extension or to fork it and integrate everything that was waiting and more.

Cocooned is almost a complete rewrite of Cocoon, with more functionnalities, a more fluent API (I hope) and integration with modern toolchains (including webpacker).

**For now, Cocooned is completely compatible with Cocoon and can be used as a drop-in replacement** as long as we talk about Ruby code. Just change the name of the gem in your Gemfile and you're done. It will work the same (but will add a bunch of deprecation warning to your logs). **This compatibility layer with the original Cocoon API will be dropped in Cocooned 3.0.**

On the JavaScript side, Cocooned 2.0 removed the dependency to jQuery. This means event handlers can not use any positional arguments other than the default `event`. See [JavaScript callbacks](#javascript-callbacks) for details.

## Installation

Inside your `Gemfile` add the following:

```ruby
gem 'cocooned'
```

### Load Cocooned JavaScript

Cocooned comes with an NPM companion package: [`@notus.sh/cocooned`](https://www.npmjs.com/package/@notus.sh/cocooned).
It bundles JavaScript files to handles in-browser interactions with your nested forms.

If you use import maps (Rails 7.0+ default), add it with:

```shell
$ bin/importmap pin @notus.sh/cocooned
```

If you use Yarn and Webpack (Rails 5.1+ default), add it with:

```shell
$ yarn add @notus.sh/cocooned
```

Once installed, load it into your application with:

```javascript
import Cocooned from '@notus.sh/cocooned'
Cocooned.start()
```

If you still use Sprockets to bundle your javascripts (Rails 3.1+ default), you can either install the companion package from npmjs.org with the package manager of your choice, configure Sprockets to look for files in your application's `/node_modules` directory and load it as above (recommended) or require `cocooned` in your `application.js` with:

```javascript
//= require 'cocooned'
```

**This compatibility with aging Rails assets pipelines will be removed in Cocooned 3.0.**

## Getting started

For all the following examples, we will consider modelisation of an administrable list with items.
Here are the two ActiveRecord models : `List` and `Item`:

```ruby
# == Schema Info
#
# Table name: lists
#
#  id           :integer(11)    not null, primary key
#  name         :string
class List < ApplicationRecord
  has_many :items, inverse_of: :list
  accepts_nested_attributes_for :items, reject_if: :all_blank, allow_destroy: true
end

# == Schema Info
#
# Table name: items
#
#  id           :integer(11)    not null, primary key
#  list_id      :integer(11)    not null
#  description  :text
#  done         :bool           not null, default(false)
class Item < ApplicationRecord
  belongs_to :list
end
```

We will build a form where we can dynamically add and remove items to a list.

### Basic form

[Rails natively supports nested forms](https://guides.rubyonrails.org/form_helpers.html#nested-forms) but does not support adding or removing nested items.

```erb
<% # `app/views/lists/_form.html.erb` %>
<%= form_for @list do |form| %>
  <%= form.text_field :name %>
  
  <h3>Items</h3>
  <%= form.fields_for :tasks do |item_form| %>
    <%= item_form.label :description %>
    <%= item_form.text_field :description %>
    <%= item_form.check_box :done %>
  <% end %>
  
  <%= form.submit "Save" %>
<% end %>
```

To enable Cocooned on this form, we need to:

1. Move the nested form to a partial
2. Signal to Cocooned it should handle your form
3. Add a way to add a new item to the list
4. Add a way to remove an item from the collection

Let's do it.

### 1. Move the nested form to a partial

Change your main form as follow:

```diff
<% # `app/views/lists/_form.html.erb` %>
<%= form_for @list do |form| %>
  <%= form.text_field :name %>
  
  <h3>Items</h3>
  <%= form.fields_for :items do |item_form|
-   <%= item_form.label :description %>
-   <%= item_form.text_field :description %>
-   <%= item_form.check_box :done %>
+   <%= render 'item_fields', f: item_form %>
  <% end %>
    
  <%= form.submit "Save" %>
<% end %>
```

And create a new file where items fields are defined:

```erb
<% # `app/views/lists/_item_fields.html.erb` %>
<%= f.label :description %>
<%= f.text_field :description %>
<%= f.check_box :done %>
```

### 2. Signal to Cocooned it should handle your form

Change your main form as follow:

```diff
<% # `app/views/lists/_form.html.erb` %>
<%= form_for @list do |form| %>
  <%= form.input :name %>
  
  <h3>Items</h3>
+ <%= cocooned_container do %>
    <%= form.fields_for :tasks do |item_form| %>
      <%= render 'item_fields', f: item_form %>
    <% end %>
+ <% end %>
  
  <%= form.submit "Save" %>
<% end %>
```

And your sub form as follow:

```diff
<% # `app/views/lists/_item_fields.html.erb` %>
+ <%= cocooned_item do %>
    <%= f.label :description %>
    <%= f.text_field :description %>
    <%= f.check_box :done %>
+ <% end %>
```

The `cocooned_container` and `cocooned_item` helpers will set for you the HTML attributes the Cocooned JavaScript expect to find to hook on.

### 3. Add a way to add a new item to the list

Change your main form as follow:

```diff
<% # `app/views/lists/_form.html.erb` %>
<%= form_for @list do |form| %>
  <%= form.input :name %>
  
  <h3>Items</h3>
  <%= cocooned_container do %>
    <%= form.fields_for :tasks do |item_form| %>
      <%= render 'item_fields', f: item_form %>
    <% end %>
    
    <p><%= cocooned_add_item_link 'Add an item', form, :items %></p>
  <% end %>
  
  <%= form.submit "Save" %>
<% end %>
```

By default, a new item will be inserted just before the immediate parent of the 'Add an item' link. You can have a look at the documentation of `cocooned_add_item_link` for more information about how to change that but we'll keep it simple for now.

### 4. Add a way to remove an item from the collection

Change your sub form as follow:

```diff
<% # `app/views/lists/_item_fields.html.erb` %>
<%= cocooned_item do %>
  <%= f.label :description %>
  <%= f.text_field :description %>
  <%= f.check_box :done %>
+ <%= cocooned_remove_item_link 'Remove', f %>
<% end %>
```

You're done!

### Gotchas

#### Strong Parameters Gotcha

To destroy nested models, Rails uses a virtual attribute called `_destroy`. When `_destroy` is set, the nested model will be deleted. If a record has previously been persisted, Rails generates and uses an additional `id` field.

When using Rails > 4.0 (or strong parameters), you need to explicitly add both `:id` and `:_destroy` to the list of permitted parameters in your controller.

In our example:

```ruby
  def list_params
    params.require(:list).permit(:name, tasks_attributes: [:id, :description, :done, :_destroy])
  end
```

#### Has One Gotcha

If you have a `has_one` association, then you (probably) need to set `force_non_association_create: true` on `cocooned_add_item_link` or the associated object will be destroyed every time the edit form is rendered (which is probably not what you expect).

See the [original merge request](https://github.com/nathanvda/cocoon/pull/247) for more details.

## Going further with plugins

For now, Cocooned supports two plugins:

* **Limit**, to set a maximum limit of items the association can contain
* **Reorderable**, that will automatically update a `position` field in each of your sub forms when you add, remove or move an item.

### The limit plugin

The limit plugin requires you specify the maximum number of items allowed in the association. To do so, pass a `:limit` option to the `cocooned_container` helper:

```erb
<%= cocooned_container limit: 12 do %>
  <% # […] %>
<% end %>
```

### The reorderable plugin

**Important:** To use the reorderable plugin, your model must have a `position` numeric attribute you will use to order collections.

The reorderable plugin can be activated in two ways through the `cocooned_container` helper:

- With a boolean: `cocooned_container reorderable: true`  
  Will use plugin's defaults (and start counting positions at 1)
- With a configuration hash: `cocooned_container reorderable: { startAt: 0 }`  
  Will use given `:startAt` as base position

To be able to move items up and down in your form and for positions to be saved, you need to change your sub form as follow:

```diff
<% # `app/views/lists/_item_fields.html.erb` %>
<%= cocooned_item do %>
  <%= f.label :description %>
  <%= f.text_field :description %>
  <%= f.check_box :done %>
+ <%= f.hidden_field :position %>
+ <%= cocooned_move_item_up_link 'Up', f %>
+ <%= cocooned_move_item_down_link 'Down', f %>
  <%= cocooned_remove_item_link 'Remove', f %>
<% end %>
```

Remember to add `:position` as a permitted parameter in your controller.

## How it works

Cocooned defines some helper functions:

* `cocooned_add_item_link` will build a link that, when clicked, dynamically adds a new partial form for the given association. [Have a look at the documentation for available options](https://github.com/notus-sh/cocooned/blob/master/lib/cocooned/helpers.rb#L21).
* `cocooned_remove_item_link` will build a link that, when clicked, dynamically removes the surrounding partial form. [Have a look at the documentation for available options](https://github.com/notus-sh/cocooned/blob/master/lib/cocooned/helpers.rb#L143).
* `cocooned_move_item_up_link` and `cocooned_move_item_down_link` will build links that, when clicked, will move the surrounding partial form one step up or down in the collection. [Have a look at the documentation for available options](https://github.com/notus-sh/cocooned/blob/master/lib/cocooned/helpers.rb#L178).

### Javascript callbacks

When your collection is modified, the following events can be triggered:

* `cocooned:before-insert`: called before inserting a new nested child, can be [canceled](#canceling-an-action)
* `cocooned:after-insert`: called after inserting
* `cocooned:before-remove`: called before removing the nested child, can be [canceled](#canceling-an-action)
* `cocooned:after-remove`: called after removal

The limit plugin can trigger its own event:

* `cocooned:limit-reached`: called when the limit is reached (before a new item will be inserted)

And so does the reorderable plugin:

* `cocooned:before-move`: called before moving the nested child, can be [canceled](#canceling-an-action)
* `cocooned:after-move`: called after moving
* `cocooned:before-reindex`: called before updating the `position` fields of nested items, can be [canceled](#canceling-an-action) (even if I honestly don't know why you would)
* `cocooned:after-reindex`: called after `position` fields update

To listen to the events in your JavaScript:

```javascript
container.addEventListener('cocooned:before-insert', event => {
  /* Do something */
});
```

Event handlers receive a `CustomEvent` with following detail:

* `event.detail.link`, the clicked link
* `event.detail.node`, the nested item that will be added, removed or moved.  
  Does not exist in `cocooned:limit-reached` and `cocooned:*-reindex` events 
* `event.nodes`, the nested items that will be or just have been reindexed.  
  On `cocooned:*-reindex` events only 
* `event.detail.cocooned`, the Cocooned instance handling the nested association.
* `event.detail.originalEvent`, the original (browser) event.

#### Canceling an action

You can cancel an action within the `cocooned:before-<action>` callback by calling `event.preventDefault()` or `event.stopPropagation()`.
