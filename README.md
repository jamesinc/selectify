# Selectify

A jQuery select box ~~mangler~~ enhancement device.

Tested in Internet Explorer 7, 8, 9, Chrome, Firefox 18.
Probably works in: Internet Explorer 10, Firefox 4+, Opera.

## Here's a demo

Hit it: [http://jsfiddle.net/jamesinc/5bSYN/](http://jsfiddle.net/jamesinc/5bSYN/ "jsFiddle demo").

## Features

* Does what you'd expect a select box to do
* **Supports keyboard controls**

## To-do

* Implement `focus` and `blur` event forwarding.
* ~~Investigate rapid keyboard selection by pressing letters/numbers (e.g. find "Australia" in a list
  of countries by focusing the select box and typing "a u s").~~
* Improve keyboard events by supporting option cycling (e.g. list of items starting with 'G', tapping G key repeatedly will cycle selection through each item - unless there is an item starting with 'GG')

## Why did I write this?

**Because all the other select box plugins are way too complicated.** It's a SELECT BOX.
You don't need hundreds of config options. The select box is not the centrepiece of your
UI; it's not the defining moment in your career. You just want to style it and get out of
there and move on to the next thing on your to-do list.

**Adding Selectify shouldn't change a thing.** You won't need to modify any event behaviour
in your code, and the plugin will trigger change events at all the right times, and
will listen for change events on the underlying `<select>` element.

```javascript
$( "select" ).on( "change", function ( ) {

	console.log( "Yes, these events work as they did on the native UI!" );

});
```

But wait, there's more

```javascript
$( "select" ).trigger( "change" );
```

Boom. Plugin UI updated.

*SLOW DOWN, THAT IS WAY TOO SIMPLE.*

**Good point,** and what's a good plugin without a bit of trolling? I've included some
default CSS in shitty.default.css, but you're going to have to write your own, mostly,
because it's shitty. Actually it's not *that* bad.

## Usage

```javascript
$( "select" ).selectify();
console.log( "Selectify is now selectifying your selects." );
```

## Options object

*Showing defaults (i.e. what you get if you don't provide an options object).*

```javascript
{
	duration: 50,
	autoWidth: true,
	btnText: "▼",
	classes: {
		container: "sl-container",
		placeholderContainer: "sl-placeholder-container",
		placeholder: "sl-placeholder",
		btn: "sl-button",
		options: "sl-options",
		selected: "sl-selected",
		open: "sl-open"
	}
}
```

## Options explained

### options.duration

How long it takes for the dropdown list to slide down/up, in milliseconds.

### options.classes.selected

Applied to the anchor in the dropdown that is the current select value.

### options.classes.open

Added to the container element when the select box is open.


### Other options.classes keys

It's easier if I just show you the element structure, and then you look at
the default options above and put two and two together.

```html
<select>
	<option>Foo</option>
	<option>Bar</option>
</select>
```

Becomes:

```html
<select style="display: none">
	<option>Foo</option>
	<option>Bar</option>
</select>

<div class="sl-container">
	<div class="sl-placeholder-container">
		<div class="sl-placeholder">Foo</div>
		<div class="sl-button">▼</div>
	</div>
	<ul class="sl-options">
		<li><a href="#" class="sl-selected">Foo</a></li>
		<li><a href="#">Bar</a></li>
	</ul>
</div>
```
