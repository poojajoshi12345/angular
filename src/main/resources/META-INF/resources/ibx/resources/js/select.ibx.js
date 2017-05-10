/*Copyright 1996-2017 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxSelect", $.ibi.ibxTextField,
{
	options:
		{
			// accepted values: "drop-down-combo" (default), "combo", "drop-down-list", "list"
			"btnShow": true,
			"type": "drop-down-combo",
			"userValue": "",
			"multiSelect": false,
			// overrides for the base
			"autoComplete": "off",
			"autoCorrect": "off",
			"autoCapitalize": "off",
			"spellCheck": "false",
			"listClasses": "",
			"filter": false,
		},
	_widgetClass: "ibx-select",
	_create: function ()
	{
		this._super();
	},
	_init: function ()
	{
		if (this._isDropDown())
		{
			this.options.wrap = false;
			this._dropButton = $("<div>").ibxButton({ "glyph": "keyboard_arrow_down", "glyphClasses": "material-icons" });
			this.element.append(this._dropButton);
			this._dropButton.on("mousedown", this._onButtonMouseDown.bind(this)).on('click', this._onButtonClick.bind(this));
			this._textInput.css('width', '1px');
		}
		else
		{
			this.options.wrap = true;
		}

		if (this.options.type == "list")
			this._textInput.hide();
		else
		{
			this.element.on("ibx_textchanged", this._onTextChanged.bind(this));
			this._textInput.on("keydown", this._onTextKeyDown.bind(this));
			if (this._isDropDown())
				this._textInput.on('click', this._onTextClick.bind(this));
		}
		this._createPopup();
		this.add(this.element.children(".ibx-menu-item, .ibx-select-group"));
		this._super();
	},
	children:function(selector)
	{
		selector = selector || ".ibx-select-item, ibx-select-group";
		return this._listWidget.children(selector);
	},
	add:function(el, sibling, before)
	{
		el = $(el).filter(".ibx-select-group, .ibx-select-item");
		el.each(function(sibling, before, idx, el)
		{
			el = $(el);
			this._listWidget.add(el, sibling, before);

			if (el.hasClass('ibx-select-group'))
			{
				el.ibxWidget("option", 'selectCtrl', this.element);
				var children = el.children('.ibx-select-item');
				children.prepend($("<div>").addClass("ibx-menu-item-marker")).addClass('ibx-select-group-item ibx-radio-group-' + $(el).attr("id"));
				el.after(children);
				children.each(function (index, el)
				{
					if ($(el).ibxWidget('option', 'selected') || this.options.userValue && this.options.userValue == $(el).ibxWidget('option', 'userValue'))
					{
						this._setSelection($(el), true);
						return true;
					}
				}.bind(this));
			}
			else
			{
				if (el.ibxWidget('option', 'selected') || this.options.userValue && this.options.userValue == el.ibxWidget('option', 'userValue'))
					this._setSelection(el, true);
			}
		}.bind(this, sibling, before));
	},
	_createPopup: function ()
	{
		if (this._isDropDown())
		{
			this._list = $("<div>").ibxMenu({ "position": { my: "left top", at: "left bottom+1px", of: this.element }, "autoFocus": !this._isEditable() });
			this._listWidget = this._list.data("ibxWidget");
			this._list.css('min-width', this.element.outerWidth() + "px");
		}
		else
		{
			this._list = $("<div>").ibxVBox({ align: "stretch",  });
			this._list.css("width", "100%").css("align-self", "flex-start");
			this._listWidget = this._list.data("ibxWidget");
		}

		this._list.addClass("ibx-select-list");
		this._list.on("ibx_select", this._onSelect.bind(this));
		this.element.append(this._list);
		this._list.on("ibx_open", function (e)
		{
			if (!this._dontFocusText)
				this._textInput.focus();
			else
			{
				if (!this._isEditable())
					this._focusSelItem();
			}
			this._dontFocusText = false;
		}.bind(this)).on("ibx_beforeclose", function(e, closeData)
		{
			if (closeData && $.contains(this.element[0], closeData.target))
				return false;
		}.bind(this));
	},
	_isEditable: function ()
	{
		switch (this.options.type)
		{
			case "drop-down-combo":
			case "combo":
				return true;

			default:
			case "drop-down-list":
			case "list":
				return false;
		}
	},
	_isDropDown: function ()
	{
		switch (this.options.type)
		{
			default:
			case "drop-down-combo":
			case "drop-down-list":
				return true;

			case "combo":
			case "list":
				return false;
		}
	},
	_sortType: true,
	_fnSort: null,
	getSortType: function ()
	{
		return this._sortType;
	},
	sort: function (type, fnSort)
	{
		this._sortType = type = (typeof(type) !== "undefined") ? type : this._sortType;
		this._fnSort = fnSort = fnSort || this._fnSort || $.ibi.ibxSelect.statics.sort;
		var children = this._list.find(".ibx-menu-item, .ibx-select-group").not(".ibx-select-group-item");
		children.sort(fnSort.bind(this));
		children.each(function (index, el)
		{
			if (this._isDropDown())
				this._listWidget.add(el);
			else
				this._list.append(el);
			if ($(el).hasClass('ibx-select-group'))
			{
				var groupChildren = this._list.find(".ibx-radio-group-" + $(el).attr("id"));
				groupChildren.sort(fnSort.bind(this));
				groupChildren.insertAfter($(el));
			}
		}.bind(this));
	},
	userValue: function (value)
	{
		if (typeof (value) == "undefined")
			return this._list.find('.sel-selected').first().ibxWidget('option', 'userValue');
		else
		{
			this._list.find('.ibx-select-item').each(function (index, el)
			{
				var itemUserValue = $(el).ibxWidget('option', 'userValue');
				if (itemUserValue == value && this.options.userValue != itemUserValue)
				{
					this.options.userValue = itemUserValue;
					this.selectItem(el);
					return false;
				}
			}.bind(this));
			return this;
		}
	},
	list: function () { return this._list; },
	selected: function (element)
	{
		if (typeof (element) == "undefined")
			return this._list.find('.sel-selected').first();
		else
		{
			$(element).trigger("click");
			return this;
		}
	},
	_onButtonMouseDown: function (e)
	{
		this._textInput.focus();
	},
	_onTextKeyDown: function (e)
	{
		if (e.keyCode == 40) // open dropdown on down arrow
		{
			if (this._isDropDown())
			{

				if (this._listWidget.isOpen())
					this._focusSelItem();
				else
				{
					this._dontFocusText = true;
					this._openPopup();
				}
			}
			else
				this._focusSelItem();
		}
		else if (e.keyCode == 38) // close dropdown on up arrow or enter
		{
			if (this._isDropDown())
			{
				if (this._listWidget.isOpen())
					this._listWidget.close();
			}
		}
		else if (e.keyCode == 13) // close dropdown on enter and update with the selection
		{
			if (this._isDropDown())
			{
				if (this._listWidget.isOpen())
				{

					this._updateText(true);
					this._listWidget.close();
				}
			}
			else
			{
				this._updateText(true);
			}
		}
		else if (e.keyCode == 9) // close popup on tab
		{
			if (this._isDropDown())
			{
				if (this._listWidget.isOpen())
					this._listWidget.close();
			}
		}
		else if (e.keyCode != 37 && e.keyCode != 39 && !e.shiftKey && !e.ctrlKey) // open popup for everything except left/right arrows
		{
			if (this._isDropDown())
			{
				if (!this._listWidget.isOpen())
					this._openPopup();
			}
		}
		e.stopPropagation();
	},
	_onTextClick: function (e)
	{
		this._dontFocusText = true;
		this._openPopup();
	},
	_onButtonClick: function (e)
	{
		if (this._listWidget.isOpen())
			this._listWidget.close();
		else
		{
			this._dontFocusText = true;
			this._openPopup();
		}
	},
	_onTextChanged: function (e)
	{
		this._setHighlight();
	},
	_onSelect: function (e)
	{
		var menuItem = this._isDropDown() ? $(e.originalEvent.target) : $(e.originalEvent.currentTarget);

		var bKeepAnchor = (e.originalEvent.type == 'ibx_menu_item_click' && e.originalEvent.keepAnchor);
		var bSynthetic = (e.originalEvent.type == 'ibx_menu_item_click' && e.originalEvent.synthetic);
		if (e.originalEvent.shiftKey)
		{
			bKeepAnchor = true;
			// select block - select between current anchor and current item.
			//				- if no current anchor, select from beginning to current item
			var all = this._list.find('.ibx-select-item:ibxFocusable');
			all.removeClass('sel-selected');
			var anchor = this._list.find('.sel-anchor').first();
			if (anchor.length == 0)
				anchor = all.first();
			if (anchor.length == 0)
			{
				this._setSelection(menuItem, true, bKeepAnchor);
			}
			else if ($(anchor).is(menuItem))
			{
				this._setSelection(menuItem, false, false);
			}
			else
			{
				var bAdd = false;
				for (var i = 0; i < all.length; i++)
				{
					var current = $(all[i]);
					if (!bAdd && (current.is(menuItem) || current.is(anchor)))
					{
						bAdd = true;
						current.addClass('sel-selected');
					}
					else
					{
						if (bAdd)
						{
							current.addClass('sel-selected');
							if (current.is(menuItem) || current.is(anchor))
								break;
						}
					}
				}
				this._setSelection(menuItem, true, bKeepAnchor);
			}
		}
		else if (e.originalEvent.ctrlKey)
		{
			// multi select
			if ($(menuItem).hasClass("sel-selected"))
				this._removeSelection(menuItem, bKeepAnchor);
			else
				this._setSelection(menuItem, true, bKeepAnchor);
		}
		else
		{
			// single select
			this._setSelection(menuItem, false, false);
		}

		if (this.options.multiSelect || bSynthetic)
			e.preventDefault();

	},
	_focusSelItem: function ()
	{
		var anchor = this._list.find('.sel-anchor').first()
		if (anchor.length == 0)
			anchor = this._list.find('.sel-selected').first();
		if (anchor.length == 0)
		{
			anchor = this._list.find('.ibx-select-item:ibxFocusable').first();
			//this._setSelection(anchor, false, false);
		}
		anchor.focus();
	},
	_removeSelection: function (menuItem, bKeepAnchor, bNoUpdate)
	{
		var menuItem = $(menuItem);
		menuItem.removeClass("sel-selected");
		menuItem.data('ibxWidget').option('checked', false);
		if (!bKeepAnchor)
		{
			this._list.find('.sel-anchor').removeClass('sel-anchor');
			menuItem.addClass('sel-anchor');
		}
		if (!bNoUpdate)
			this._updateText();
		this._trigger("change", null, this.element);
		this._trigger("set_form_value", null, { "elem": this.element, "value": this._getUserValue() });
	},
	selectItem: function (el)
	{
		this._setSelection(el, false);
	},
	_setSelection: function (menuItem, bKeep, bKeepAnchor, bNoUpdate, bNoChange)
	{
		var menuItem = $(menuItem);
		if (menuItem.hasClass('ibx-select-check-item'))
		{
			if (!bKeep && menuItem.hasClass('sel-selected'))
			{
				this._removeSelection(menuItem, bKeepAnchor, bNoUpdate);
				return;
			}
			bKeep = true;
		}
		this._list.find('.ibx-select-radio-item,.ibx-select-check-item').each(function (index, el) { $(el).data('ibxWidget')._setOption('checked', false); })
		if (!this.options.multiSelect || !bKeep)
		{
			this._list.find('.sel-selected').removeClass('sel-selected');
		}
		if (!this.options.multiSelect || !bKeepAnchor)
		{
			this._list.find('.sel-anchor').removeClass('sel-anchor');
			if (menuItem.length > 0)
			{
				menuItem.addClass('sel-selected sel-anchor');
				menuItem.data('ibxWidget')._setOption('checked', true);
			}
		}
		this._list.find('.sel-selected.ibx-select-check-item').each(function (index, el) { $(el).data('ibxWidget')._setOption('checked', true); })
		if (!bNoUpdate)
			this._updateText();
		if (!bNoChange)
		{
			this._trigger("change", null, this.element);
			this._trigger("set_form_value", null, { "elem": this.element, "value": this._getUserValue() });
		}
	},
	_getUserValue: function ()
	{
		if (!this._list)
			return "";

		var values = [];
		this._list.find('.sel-selected').each(function (index, el)
		{
			var userValue = $(el).ibxWidget('option', 'userValue');
			if (userValue)
				values.push(userValue);
		}.bind(this));
		return values.join(',');
	},
	_getText: function ()
	{
		var newText = "";
		var selection = this._list.find('.sel-selected');
		selection.each(function (index, el)
		{
			if (newText)
				newText += ", ";
			newText += $(el).ibxWidget('option', 'text');

		}.bind(this));
		return newText;
	},
	_updateText: function (bNotEmpty)
	{
		var selection = this._list.find('.sel-selected');
		if (bNotEmpty && selection.length == 0)
			return;
		this._setOption("text", this._getText());
	},
	_applyFilter: function ()
	{
		return this._isEditable() && this.options.filter;
	},
	_setHighlight: function ()
	{
		this._list.find('.ibx-select-radio-item,.ibx-select-check-item').each(function (index, el) { $(el).data('ibxWidget')._setOption('checked', false); })
		this._list.find('.sel-selected').removeClass('sel-selected');
		var bFound = false;
		var searchText = this._textInput.val().toLowerCase();
		if (searchText)
		{
			this._list.find(".ibx-select-item").each(function (index, el)
			{
				if (0 == $(el).data('ibxWidget').option('text').toLowerCase().indexOf(searchText))
				{
					if (!bFound)
						this._setSelection(el, false, false, true, true);
					bFound = true;
					if (!this._applyFilter())
						return false;
					else
						$(el).show();
				}
				else
				{
					if (this._applyFilter())
						$(el).hide();
				}
			}.bind(this));
		}
		else
		{
			if (this._applyFilter())
			{
				this._list.find(".ibx-select-item").each(function (index, el)
				{
					$(el).show();
				});
			}
		}

		if (!bFound)
		{
			this._setSelection(null, false, false, true, true);
		}

		// Hide empty groups when filtering
		if (this._applyFilter())
		{
			this._list.find(".ibx-select-group").each(function (index, el)
			{
				if (this._list.find(".ibx-radio-group-" + $(el).attr("id") + ":ibxFocusable").length > 0)
					$(el).show();
				else
					$(el).hide();
			}.bind(this));
		}
	},
	_openPopup: function ()
	{
		if (!this._dontOpen)
		{
			if (!this._listWidget.isOpen())
			{
				$("body").append(this._list);
				this._listWidget.open();
				this._list.css('min-width', this.element.outerWidth() + "px");
			}
		}
		this._dontOpen = false;
	},
	formatValue: function (value)
	{
		if (value instanceof Array)
			return value.join(",");
		else
			return value;
	},
	_destroy: function ()
	{
		this._super();
		if (this._dropButton)
			this._dropButton.remove();
		this._list.remove();
	},
	refresh: function ()
	{
		this._super();
		switch (this.options.type)
		{
			default:
				this._textInput.prop("readonly", this.options.readonly);
				break;

			case "drop-down-list":
				this._textInput.prop("readonly", true);
				break;
		}
		if (this._dropButton)
			this.options.btnShow ? this._dropButton.show() : this._dropButton.hide();
		this.element.removeClass('ibx-select-type-combo ibx-select-type-list ibx-select-type-drop-down-combo ibx-select-type-drop-down-list');
		switch (this.options.type)
		{
			default:
			case "drop-down-combo": this.element.addClass('ibx-select-type-drop-down-combo'); break;
			case "drop-down-list": this.element.addClass('ibx-select-type-drop-down-list'); break;
			case "combo": this.element.addClass('ibx-select-type-combo'); break;
			case "list": this.element.addClass('ibx-select-type-list'); break;
		}

		if (this.options.listClasses && this._list)
			this._list.addClass(this.options.listClasses);
	}
});
$.widget("ibi.ibxComboBox", $.ibi.ibxSelect, { options: { type: "drop-down-combo" }, _widgetClass: "ibx-combo-box" });
$.widget("ibi.ibxComboBoxSimple", $.ibi.ibxSelect, { options: { type: "combo" }, _widgetClass: "ibx-combo-box-simple" });
$.widget("ibi.ibxListBox", $.ibi.ibxSelect, { options: { type: "drop-down-list" }, _widgetClass: "ibx-list-box" });
$.widget("ibi.ibxListBoxSimple", $.ibi.ibxComboBoxSimple, { options: { readonly: true }, _widgetClass: "ibx-combo-box-simple" });
$.widget("ibi.ibxList", $.ibi.ibxSelect, { options: { type: "list" }, _widgetClass: "ibx-list" });

$.ibi.ibxSelect.statics =
{
	sort: function (a, b)
	{
		var texta = $(a).ibxWidget('option', 'text').toLowerCase();
		var textb = $(b).ibxWidget('option', 'text').toLowerCase();
		if (texta < textb)
			return this._sortType ? -1 : 1;
		else if (texta > textb)
			return this._sortType ? 1 : -1;
		else
			return 0;
	}
};

$.widget("ibi.ibxSelectItem", $.ibi.ibxMenuItem,
{
	options:
		{
			selected: false,
			userValue: "",
			startMarker: false,
			endMarker: false,
		},
	_widgetClass: "ibx-select-item",
	_onMenuItemClick: function (e)
	{
		if ($.ibi.ibxSelectItem.statics.isDropDown.call(this))
			this._super(e);
		else
		{
			if (this.element.closest('.ibx-select-list').data('ibxWidget'))
				this.element.closest('.ibx-select-list').data('ibxWidget')._trigger("select", e, this.element);
		}
	},
	_onMenuItemKeyEvent: function (e)
	{
		$.ibi.ibxSelectItem.statics.onMenuItemKeyEvent.call(this, e);
	},
	_setOption: function (key, value)
	{
		$.ibi.ibxSelectItem.statics.setOption.call(this, key, value);
	},

});

$.widget("ibi.ibxSelectCheckItem", $.ibi.ibxCheckMenuItem,
{
	options:
		{
			selected: false,
			userValue: "",
			endMarker: false,
		},
	_widgetClass: "ibx-select-check-item",
	_create: function ()
	{
		this.element.addClass('ibx-select-item');
		this._super();
	},
	_onMenuItemClick: function (e)
	{
		if ($.ibi.ibxSelectItem.statics.isDropDown.call(this))
			this._super(e);
		else
			this.element.closest('.ibx-select-list').data('ibxWidget')._trigger("select", e, this.element);
	},
	_onMenuItemKeyEvent: function (e)
	{
		$.ibi.ibxSelectItem.statics.onMenuItemKeyEvent.call(this, e);
	},
	_setOption: function (key, value)
	{
		$.ibi.ibxSelectItem.statics.setOption.call(this, key, value);
	},
	refresh: function ()
	{
		this._super();
	},
});

$.widget("ibi.ibxSelectRadioItem", $.ibi.ibxRadioMenuItem,
{
	options:
		{
			selected: false,
			userValue: "",
			endMarker: false,
		},
	_widgetClass: "ibx-select-radio-item",
	_create: function ()
	{
		this.element.addClass('ibx-select-item');
		this._super();
	},
	_onMenuItemClick: function (e)
	{
		if ($.ibi.ibxSelectItem.statics.isDropDown.call(this))
			this._super(e);
		else
			this.element.closest('.ibx-select-list').data('ibxWidget')._trigger("select", e, this.element);
	},
	_onMenuItemKeyEvent: function (e)
	{
		$.ibi.ibxSelectItem.statics.onMenuItemKeyEvent.call(this, e);
	},
	_setOption: function (key, value)
	{
		$.ibi.ibxSelectItem.statics.setOption.call(this, key, value);
	},

});


$.ibi.ibxSelectItem.statics =
{
	onMenuItemKeyEvent: function (e)
	{
		var isDropDown = $.ibi.ibxSelectItem.statics.isDropDown.call(this);

		if (isDropDown)
		{
			this._super(e);

			if (e.keyCode != 38 && e.keyCode != 40)
				return;

			var event = jQuery.Event('click');
			event.ctrlKey = e.ctrlKey;
			event.shiftKey = e.shiftKey;
			event.keepAnchor = e.shiftKey;
			event.synthetic = true;

			if (e.keyCode == 38)//up
			{
				var prev = this.element.prevAll('.ibx-select-item:ibxFocusable').first();
				if (prev)
				{
					prev.focus();
					prev.trigger(event, prev);
				}
			}
			else //down
			{
				var next = this.element.nextAll('.ibx-select-item:ibxFocusable').first();
				if (next)
				{
					next.focus();
					next.trigger(event, next);
				}
			}
		}
		else
		{

			this._super(e);
			if (e.keyCode == 9) // Normal tab behaviour for non-drop-down
				return;

			e.preventDefault();

			var event = jQuery.Event('click');
			event.ctrlKey = e.ctrlKey;
			event.shiftKey = e.shiftKey;
			event.keepAnchor = e.shiftKey;
			event.synthetic = true;

			if (e.keyCode == 38)//up
			{
				var prev = this.element.prevAll('.ibx-select-item:ibxFocusable').first();
				if (prev)
				{
					prev.focus();
					prev.trigger(event, prev);
				}
			}
			else if (e.keyCode == 40)//down
			{
				var next = this.element.nextAll('.ibx-select-item:ibxFocusable').first();
				if (next)
				{
					next.focus();
					next.trigger(event, next);
				}
			}
			else if (e.keyCode == 32 || e.keyCode == 13) // select item on space and enter with non-drop-down
			{
				this.element.trigger(event, this.element);
			}
		}

	},
	setOption: function (key, value)
	{
		this._super(key, value);
		if (key == "selected" && value && this._list)
		{
			this.element.trigger("click");
		}
	},
	isDropDown: function ()
	{
		return this.element.closest('.ibx-select-list').hasClass('ibx-menu');
	},
};

$.widget("ibi.ibxSelectGroup", $.ibi.ibxLabel,
{
	options:
	{
		selectCtrl:null,
		userValue: "",
		glyph: "format_list_bulleted",
		glyphClasses: "material-icons",
		justify: "start",
	},
	_widgetClass: "ibx-select-group",
	_create: function ()
	{
		var id = this.element.attr("id");
		if (!id)
			this.element.uniqueId();
		this._super();
	},
	add:function(el, sibling, before)
	{
		el = $(el);
		el.each(function (idx, el)
		{
			el = $(el);
			var children = this.element.parent().children('.ibx-radio-group-' + $(this.element).attr("id"));
			var after = (children.length == 0) ? this.element : after = children[children.length - 1];
			el.prepend($("<div>").addClass("ibx-menu-item-marker")).addClass('ibx-select-group-item ibx-radio-group-' + $(this.element).attr("id"));
			el.insertAfter(after);
			if (el.ibxWidget('option', 'selected'))
				this.options.selectCtrl.ibxWidget('selectItem', el);
		}.bind(this));
	},
	refresh: function ()
	{
		this._super();
	}
});

//# sourceURL=select.ibx.js

