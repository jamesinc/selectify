# Selectify

A jQuery select box ~~mangler~~ enhancement device.

Tested in Internet Explorer 7, 8, 9, Chrome, Firefox 18.
Probably works in: Internet Explorer 10, Firefox 4+, Opera.

## Shut up and show me a demo

Hit it: [http://jsfiddle.net/jamesinc/5bSYN/](http://jsfiddle.net/jamesinc/5bSYN/ "jsFiddle demo").

## To-do

* Add support for `<optgroup>` elements. Currently they are ignored.
* Investigate `focus` and `blur` event forwarding.

## Why did I write this?

Because all the other select box plugins are way too complicated. It's a SELECT BOX.
You don't need hundreds of config options. The selectbox is not the centrepiece of your
UI, it's not the defining moment in your career. You just want to style it and get out of
there and move on to the next thing on your to-do list.

**Adding Selectify shouldn't change a thing.** You won't need to modify any event behaviour
in your code, and the plugin will trigger change events at all the right times, and
will listen for change events on the underlying `<select>` element.

    $( "select" ).on( "change", function ( ) {
    
       console.log( "Oh my God, this actually still works?" );
    
    });

But wait, there's more

    $( "select" ).trigger( "change" );

Oh my God, that updates the plugin UI?

*SLOW DOWN, THAT IS WAY TOO SIMPLE.*

**Good point,** and what's a good plugin without a bit of trolling? I've included some
default CSS in shitty.default.css, but you're going to have to write your own, mostly,
because it's shitty. Actually it's not *that* bad.

## Usage

    $("select").selectify();
    console.log( "Congratulations, Selectify is now working." );

## Options object

Showing defaults (i.e. what you get if you don't provide an options object).

    {
	   duration: 50,
       classes: {
          container: "sl-container",
          placeholder: "sl-placeholder",
          options: "sl-options",
          selected: "sl-selected",
          open: "sl-open"
       }
    }

## What are those options bloody well for?

### options.duration

How long it takes for the dropdown list to slide down/up.


### options.classes.selected

Applied to the anchor in the dropdown that is the current select value.


### options.classes.open

Added to the container element when the select box is open.


### Other options.classes keys

It's easier if I just show you the element structure, and then you look at
the default options above and put two and two together.

    <select>
       <option>Foo</option>
       <option>Bar</option>
    </select>

Becomes:

    <select style="display: none">
       <option>Foo</option>
       <option>Bar</option>
    </select>

    <div class="sl-container">
       <div class="sl-placeholder">Foo</div>
       <ul class="sl-options">
          <li><a href="#" class="sl-selected">Foo</a></li>
          <li><a href="#">Bar</a></li>
       </ul>
    </div>
