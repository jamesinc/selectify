( function ( $ ) {

	"use strict";

	var defaults = {
		duration: 50,
		classes: {
			container: "sl-container",
			placeholder: "sl-placeholder",
			options: "sl-options",
			selected: "sl-selected",
			open: "sl-open"
		}
	};

	$.fn.selectify = function ( options ) {

		var settings;

		options = options || { };

		settings = $.extend( true, { }, defaults, options );

		this.each( function ( ) {

			var el = $( this ),
				i, options,
				container, placeholder, list, anchors;

			// If it's not a select element, skip it.
			if ( !el.is("select") ) {

				return;

			}

			if ( el.data("sl") === true ) {

				el.next( "." + settings.classes.container ).remove();

			}

			options = el.find( "option" );
			container = $( "<div/>", {
				"class": settings.classes.container,
				css: {
					"position": "relative"
				}
			});

			placeholder = $( "<div/>", {
				"class": settings.classes.placeholder
			});

			list = $( "<ul/>", {
				"class": settings.classes.options,
				css: {
					position: "absolute",
					left: 0
				}
			});

			options.each( function ( ) {

				var self = $( this ),
					a = $( "<a/>", {
						href: "#",
						text: self.text(),
						css: {
							"white-space": "nowrap"
						},
						click: function ( e ) {

							e.preventDefault();

							if ( el.val() !== self.val() ) {

								placeholder.text( self.text() );
								list.find( "a" ).removeClass( settings.classes.selected );
								a.addClass( settings.classes.selected );
								el
									.val( self.val() )
									.trigger( "change", [ { sl: true }] );

							}

							list.slideUp( settings.duration );
							container.removeClass( settings.classes.open );

						}

					}),
					li = $( "<li/>" );

				li.append( a );
				list.append( li );

			});

			placeholder.on( "click", function ( e ) {

				list.slideToggle( settings.duration );
				container.toggleClass( settings.classes.open );

			});

			$( document ).on( "mouseup", function ( e ) {

				if ( !container.has( e.target ).length ) {

					list.slideUp( settings.duration );
					container.removeClass( settings.classes.open );

				}

			});

			// Listen for change events on the original select element
			el.on("change", function ( e, src ) {

				var index = this.selectedIndex;

				// Don't do anything if the event was originally propagated by this plugin
				if ( src && src.sl ) {

					return;

				}

				anchors
					.removeClass( settings.classes.selected );

				placeholder.text( $(options.get(index)).text() );
				$( anchors.get(index) ).addClass( settings.classes.selected );

			});

			// Get anchors list
			anchors = list.find("a");

			// Set initial placeholder text
			placeholder.text( $(options.get(el[0].selectedIndex)).text() );

			// Set initial anchor styling
			$( anchors.get(el[0].selectedIndex) ).addClass( settings.classes.selected );

			// Add our elements to the page
			container.append( placeholder, list );
			el
				.hide()
				.after( container )
				.data( "sl", true );

			// Add a height offset to the list
			list
				.hide()
				.css({
						top: container.outerHeight()
				});

		});

		return this;

	};

}( jQuery ));
