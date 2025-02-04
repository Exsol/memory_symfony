﻿/**
 * @file HTML Buttons plugin for CKEditor
 * Copyright (C) 2012 Alfonso Martínez de Lizarrondo
 * A simple plugin to help create custom buttons to insert HTML blocks
 * Version 1.1 - 1.3 Modified by Eric Arnol-Martin (http://eamster.tk)
 * Added in Version 1.1:	New HTML inserts work properly when selecting elements
 * Added in Version 1.2:	Inline HTML is not lost when selections are modified
 * Added in Version 1.3:	Turned off debugging and fixed a few selection bugs within text blocks
 * Version 1.4: Alfonso Martínez. Cleaned up the javascript to wrap the selection with the HTML.
 * Version 1.5: Alfonso Martínez. Review the person to insert HTML with selection, fix existing problems
				Merge suggestion by Julian Ivancsuk. Ability to use a menu-button instead of several different buttons
 * Version 1.5.1: Correction to fix validation by CKBuilder
 */

CKEDITOR.plugins.add( 'crmparams', {
	requires: ['menubutton'],
	init : function( editor )
	{
		var buttonsConfig = editor.config.crmparams,
			plugin = this;
		if (!buttonsConfig)
			return;

		function createCommand( definition )
		{
			return {
				exec: function( editor )
				{
					var strToLook = '> </',
						code = definition.html;

					// Check to see if we have selected text:
					var sel = editor.getSelection(),
						selectedText = sel && sel.getSelectedText();

					if( code.indexOf(strToLook) != -1 && selectedText )
					{
						// Build list of block elements to be replaced
						var blockElems=['address','article','aside','audio','blockquote','canvas','dd','div','dl','fieldset',
							'figcaption','figure','figcaption','footer','form','h1','h2','h3','h4','h5','h6','header','hgroup',
							'hr','noscript','ol','output','p','pre','section','table','tfoot','ul','video'];

						// Get HTML and Text from selection
						var ranges = sel.getRanges();
						var el = new CKEDITOR.dom.element( 'div' );
						for (var i = 0, len = ranges.length; i < len; ++i) {
							var range = ranges[ i],
								bookmark = range.createBookmark2();

							el.append( range.cloneContents() );
							range.moveToBookmark( bookmark );
							range.select();
						}
						var selectedHtml = el.getHtml();

						// Replace block elements from html
						for(var i = 0; i < blockElems.length; i++){
							var pattern = '(<' + blockElems[i] + '[^>]*>|<\/' + blockElems[i] + '>)';
							var re = new RegExp(pattern, 'gi');
							selectedHtml = selectedHtml.replace(re, '');
						}

						// Do the actual replacing
						code = code.replace(strToLook, '>' + selectedHtml + '</');
					}

					editor.insertHtml(code);
				}
			};
		}

		function createMenuButton( definition )
		{
			var itemsConfig = definition.items;
			var items = {};

			// add menuitem from config.itemlist
			for (var i = 0; i < itemsConfig.length; i++ ) {
				var item = itemsConfig[ i ];
				var commandName = item.name;
				editor.addCommand( commandName, createCommand( item ) );

				items[ commandName ] = {
					label: item.title,
					command : commandName,
					group: definition.name,
					role: 'menuitem'
				};

			}
			editor.addMenuGroup( definition.name, 1 );
			editor.addMenuItems( items );

			return {
				label: definition.title,
				icon: plugin.path + definition.icon,
				toolbar: definition.toolbar || 'insert',
				onMenu: function() {
					var activeItems = {};

					for ( var item in items )
						activeItems[ item ] = CKEDITOR.TRISTATE_OFF;

					return activeItems;
				}
			};
		}

		// Create the command for each button
		for(var i=0; i<buttonsConfig.length; i++)
		{
			var definition = buttonsConfig[ i ];
			var commandName = definition.name;
			if (definition.html)
			{
				editor.addCommand( commandName, createCommand( definition ) );
				editor.ui.addButton( commandName,
				{
					label : definition.title,
					command : commandName,
					toolbar: definition.toolbar || 'insert',
					icon : plugin.path + definition.icon
				});
			}
			else
			{
				// create a menubutton
				var menuButton = createMenuButton( definition );

				// insert menubutton to toolbar
				editor.ui.add( commandName,  CKEDITOR.UI_MENUBUTTON, menuButton);
			}
		}
	} //Init

} );



