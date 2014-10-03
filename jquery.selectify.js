/*jshint jquery:true */
/**
 * Selectify - an unobtrusive select overlay that reproduces the
 * native <select> element experience Pretty Well(TM).
 * 
 * by James Ducker <james.ducker+js@gmail.com>
 * 
 * Works with jQuery >= 1.7
 *
 * "Add-and-forget" - manipulate your underlying <select> element
 * and changes are immediately propagated to Selectify's overlay.
 *
 * Project home: https://github.com/jamesinc/selectify
 * Issue tracker: https://github.com/jamesinc/selectify/issues
 */
( function ( $ ) {

	"use strict";

	// Got some default options up in here.
	var defaults = {
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
	};

	/**
	 * Call against any select element or collection containing select elements
	 * Non-select elements will be ignored.
	 * @param  {Object} options Options to pass to the plugin.
	 *                          Valid options are:
	 *                          duration	(number, milliseconds) slide up/slide
	 *                                      down animation duration.
	 *                          classes.container
	 *                                      Class name of the container element
	 *                          classes.placeholder
	 *                                      Class name of the placeholder element
	 *                                      (holds the current value of the select)
	 *                          classes.options
	 *                                      Class name of the dropdown
	 *                                      container <ul> element
	 *                          classes.selected
	 *                                      Class name of the option that is currently
	 *                                      selected. Applied to <a> inside <li>
	 *                                      inside options <ul>.
	 *                          classes.open
	 *                                      Added to container element when the
	 *                                      options list is open.
	 *                          
	 * @return {jQuery}         The jQuery object.
	 */
	$.fn.selectify = function ( options ) {

		var settings,
			// Maintain a dictionary of values in the select
			// so they can be matched as the user types
			Dictionary = function ( select ) {

				var optionsHtml = "",
					searchString = "",
					searchTimer = null,
					dict = { },
					clearSearchString = function ( ) {

						searchString = "";

					},
					// JS doesn't notify us when 3rd-party code modifies the options
					// list, so we get the options HTML as a string and compare it
					// to the last one we stored. If they're different, we rebuild
					// the dictionary.
					rebuild = function ( ) {

						if ( select.html() !== optionsHtml ) {

							$.each( select.find( "option" ), function ( ) {

								var el = $( this );

								if ( el.text().length ) {

									dict[ el.text() ] = el.val();

								}

							});

							optionsHtml = select.html();

						}

					},
					// Restarts the countdown to clear the search string
					resetSearch = function ( ) {

						clearTimeout( searchTimer );

						searchTimer = setTimeout( clearSearchString, 1000 );

					};

				return {

					find: function ( text ) {

						var textLength,
							selectedOption = $( select.find("option").get(select.get(0).selectedIndex) ),
							result = false;

						rebuild();
						resetSearch();

						searchString += text;
						textLength = searchString.length;

						if ( !selectedOption.length || selectedOption.text().substr(0, textLength).toUpperCase() !== searchString ) {

							if ( textLength ) {

								$.each( dict, function ( key, value ) {

									if ( key.substr(0, textLength).toUpperCase() === searchString ) {

										result = value;
										return false;

									}

								});

							}

						}

						return result;

					},
					clear: function ( ) {

						clearTimeout( searchTimer );
						clearSearchString();

					}

				};

			};

		options = options || { };

		// Merge defaults and options to make settings
		settings = $.extend( true, { }, defaults, options );

		// Setup each <select> in the provided collection.
		this.each( function ( ) {

			var el = $( this ),
				dict = new Dictionary( el ),
				self = this,
				options,
				container, placeholderContainer,
				placeholder, btn, list, anchors;

			// If current element is not a <select> element, skip it.
			if ( !el.is("select") ) {

				return;

			}

			// Check to see if this element has already been selectified(TM)
			if ( el.data("sl") === true ) {

				// Remove old selectifications from the element
				el.next( "." + settings.classes.container ).remove();

			}

			// Get collection of <option> elements
			options = el.find( "option" );

			// Create container element for the new UI
			container = $( "<div/>", {
				"class": settings.classes.container,
				css: {
					"position": "relative"
				}
			});

			placeholderContainer = $( "<div/>", {
				"class": settings.classes.placeholderContainer,
				tabindex: 0
			});

			// Create placeholder element to display the select's
			// current value
			placeholder = $( "<div/>", {
				"class": settings.classes.placeholder
			});

			btn = $( "<div />", {
				"class": settings.classes.btn,
				text: settings.btnText,
				css: {
					position: "absolute",
					right: 0,
					top: 0,
					height: "100%"
				}
			});

			placeholderContainer.append( placeholder, btn );

			// Create the list element for options
			list = $( "<ul/>", {
				"class": settings.classes.options,
				css: {
					position: "absolute",
					left: 0
				}
			});

			// Go through each option and add it to the list
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

			// Handle list open/close.
			placeholderContainer.on( "click", function ( e ) {

				e.preventDefault();

				list.slideToggle( settings.duration );
				container.toggleClass( settings.classes.open );
				el.trigger( "change" );

			});

			placeholderContainer.on( "keydown", function ( e ) {

				var key = e.which,
					keyChar = String.fromCharCode( key ),
					match,
					intercept = false,
					currentIndex = self.selectedIndex;

				// Down arrow, right arrow
				if ( key === 40 || key === 39 ) {

					intercept = true;

					self.selectedIndex = Math.min( options.length - 1, self.selectedIndex + 1 );

				}

				// Up arrow, left arrow
				if ( key === 38 || key === 37 ) {

					intercept = true;

					self.selectedIndex = Math.max( 0, self.selectedIndex - 1 );

				}

				// Stop processing if it's a command key (i.e. directional arrow)
				if ( intercept ) {

					e.preventDefault();

					if ( currentIndex !== self.selectedIndex ) {

						dict.clear();
						el.trigger( "change" );

					}

					return false;

				}

				// Enter key, space bar
				// Causes the options list to close (if it's open)
				if ( key === 13 || key === 32 ) {

					list.slideUp( settings.duration );

				}

				// Match other keystrokes - used for typing values into the select
				// and having it match them
				if ( /[a-zA-Z0-9-_ !@#$%^&*\(\)+\/\\?><;:'"|]/.test(keyChar) ) {

					match = dict.find( keyChar );

					if ( match && el.val() !== match ) {

						el
							.val( match )
							.trigger( "change" );

					}

				}

			});

			placeholderContainer.on( "selectstart", function ( ) {

				return false;

			});

			// Close the list if the user clicks elsewhere on the page.
			$( document ).on( "mouseup", function ( e ) {

				if ( !container.has( e.target ).length ) {

					list.slideUp( settings.duration );
					container.removeClass( settings.classes.open );

				}

			});

			// Listen for change events on the original select element
			el.on( "change", function ( e, src ) {

				var index = this.selectedIndex,
					listScrollOffset = Math.abs( list.scrollTop() ),
					selectedAnchor = $( anchors.get(index) ),
					positionOffset = parseInt(list.css("border-top-width"), 10),
					selectionOffset = selectedAnchor.offset().top - anchors.first().offset().top;

				// Scroll the options list up if selection is above the visible
				// portion of the list
				if ( selectionOffset < listScrollOffset ) {

					list.clearQueue().animate({
						scrollTop: positionOffset + selectionOffset
					}, settings.duration);

				} else if ( selectionOffset > listScrollOffset +
						list.height() - selectedAnchor.outerHeight() )
				{
				
					list.clearQueue().animate({
						scrollTop: positionOffset + selectionOffset - list.height() + selectedAnchor.outerHeight()
					}, settings.duration);
				
				}
				
				// Don't do anything if the event was originally propagated by this plugin
				if ( src && src.sl ) {

					return;

				}

				placeholder.text( $(options.get(index)).text() );
				anchors.removeClass( settings.classes.selected );
				selectedAnchor.addClass( settings.classes.selected );

			});

			// Get anchors list
			anchors = list.find("a");

			// Set initial placeholder text
			placeholder.text( $(options.get(el[0].selectedIndex)).text() );

			// Set initial anchor styling
			$( anchors.get(el[0].selectedIndex) ).addClass( settings.classes.selected );

			if ( settings.autoWidth ) {

				placeholder.width( el.width() );

			}

			// Add our elements to the page
			container.append( placeholderContainer, list );
			el
				.hide()
				.after( container )
				.data( "sl", true );

			// Add a height offset to the list
			list
				.hide()
				.css( "top", container.outerHeight() );

		});

		// return the jQuery object
		return this;

	};

}( jQuery ));
