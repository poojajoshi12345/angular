/*Copyright 1996-2017 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxSelect", $.ibi.ibxTextField,
{
	options:
		{
			// accepted values: "drop-down-combo" (default), "combo", "drop-down-list", "list"
			"btnShow": true,
			"type": "drop-down-combo",
			"multiSelect": false,
			
			// overrides for the base
			"autoComplete": "off",
			"autoCorrect": "off",
			"autoCapitalize": "off",
			"spellCheck": "false",
			"listClasses": "",
			"filter": false,
			
			"navKeyDir":"vertical",

			"aria":
			{
				"role":"combobox",
				"multiline":false,
				"haspopup":"listbox"
			}
		},
	_widgetClass: "ibx-select",
	_create: function ()
	{
		this._super();
	},
	_setAccessibility:function(accessible, aria)
	{
		var options = this.options;
		aria = this._super(accessible, aria);
		aria.expanded = (this._listWidget && this._listWidget.element.is(".ibx-popup")) ? this._listWidget.isOpen() : true;
		aria.owns = (this._listWidget) ? this._listWidget.element.prop("id") : "";
		aria.controls = (this._listWidget) ? this._listWidget.element.prop("id") : "";
		return aria;
	},
	_init: function ()
	{
		if (this._isDropDown())
		{
			this.options.wrap = false;
			this._dropButton = $("<div class='ibx-select-open-btn'>").ibxButton();
			this.element.append(this._dropButton);
			this._dropButton.on("mousedown", this._onButtonMouseDown.bind(this)).on('click', this._onButtonClick.bind(this));
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
			if (this._isDropDown())
				this._textInput.on('click', this._onTextClick.bind(this));
		}
		this._createPopup();
		this._super();
		this.add(this.element.children(".ibx-menu-item, .ibx-select-group"));
		this.refresh();
	},
	navKeyChildren:function(selector)
	{
		return this.element.children(selector || ":ibxNavFocusable");
	},
	children:function(selector)
	{
		selector = selector || ".ibx-select-item, ibx-select-group";
		return this._listWidget.children(selector);
	},
	add:function(el, sibling, before, refresh)
	{
		el = $(el).filter(".ibx-select-group, .ibx-select-item");
		el.each(function(sibling, before, refresh, idx, el)
		{
			el = $(el);
			this._listWidget.add(el, sibling, before, refresh);

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
		}.bind(this, sibling, before, refresh));
	},
	remove: function (el, destroy, refresh)
	{
		this._listWidget.remove(el, destroy, refresh);
	},
	_createPopup: function ()
	{
		if (this._isDropDown())
		{
			this._list = $("<div>").ibxMenu(
			{
				"autoFocus":false,
				"position":{ my: "left top", at: "left bottom+1px", of: this.element }
			});
			this._listWidget = this._list.data("ibxWidget");
			this._list.css('min-width', this.element.outerWidth() + "px").on("ibx_open ibx_close", function(e)
			{
				this.setAccessibility();
			}.bind(this));
		}
		else
		{
			this._list = $("<div tabindex='-1'>").ibxVBox({ align: "stretch",  });
			this._list.css("width", "100%").css("align-self", "flex-start");
			this._listWidget = this._list.data("ibxWidget");
		}

		this._listWidget.option({"navKeyRoot":true, "navKeyAutoFocus":!this._isEditable(), "navKeyDir":"vertical", "aria":{"accessible":true, "role":"listbox", "hidden":false}});
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
		}.bind(this)).on("ibx_close", function ()
		{
			this._resetHighlight();
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
		{
			var selected = this._list.find('.sel-selected');

			if (this.options.multiSelect)
			{
				// return an array of user values
				var ret = [];
				selected.each(function (index, el)
				{
					ret.push($(el).ibxWidget('option', 'userValue'));
				}.bind(this));
				return ret;
			}
			else
			{
				return (selected.length == 0 ? null : selected.first().ibxWidget('option', 'userValue'));
			}
		}
		else
		{
			this._resetHighlight();
			this._removeSelection(this._list.find('.ibx-select-item'), false, true);

			if (this.options.multiSelect)
			{

				var userValues;
				if (value instanceof Array)
					userValues = value;
				else
				{
					userValues = [];
					userValues.push(value);
				}

				var selItems = [];

				this._list.find('.ibx-select-item').each(function (index, el)
				{
					var itemUserValue = $(el).ibxWidget('option', 'userValue');
					for (var i = 0; i < userValues.length; i++)
					{
						if (itemUserValue == userValues[i])
						{
							selItems.push(el);
							break;
						}
					}
				}.bind(this));

				if (selItems.length > 0)
					this.selectItems(selItems);
			}
			else
			{
				if (value instanceof Array)
				{
					if (value.length == 0)
						return this;
					else
						value = value[0];
				}

				this._list.find('.ibx-select-item').each(function (index, el)
				{
					var itemUserValue = $(el).ibxWidget('option', 'userValue');
					if (itemUserValue == value)
					{
						this.selectItem(el);
						return false;
					}
				}.bind(this));
			}

			return this;
		}
	},
	list: function () { return this._list; },
	selected: function (element)
	{
		if (typeof (element) == "undefined")
			return this._list.find('.sel-selected');
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
	// Override text
	_onTextInputKeyDown: function (e)
	{
		if(e.keyCode == $.ui.keyCode.DOWN) // open dropdown on down arrow
		{
			if(this._isDropDown())
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
		else if(e.keyCode == $.ui.keyCode.ESCAPE) // close dropdown on up arrow or enter
		{
			if(this._isDropDown() && this._listWidget.isOpen())
				this._listWidget.close();
		}
		else if(e.keyCode == $.ui.keyCode.ENTER) // close dropdown on enter and update with the selection
		{
			if(this._isDropDown() && this._listWidget.isOpen())
			{
				this._updateText(true);
				this._listWidget.close();
			}
			else
			{
				this._updateText(true);
			}
		}
		else if (e.keyCode == $.ui.keyCode.TAB) // close popup on tab
		{
			if(this._isDropDown() && this._listWidget.isOpen())
				this._listWidget.close();
		}
		else if (e.keyCode != 37 && e.keyCode != 39 && !e.shiftKey && !e.ctrlKey) // open popup for everything except left/right arrows
		{
			if (this._isDropDown())
			{
				if (!this._listWidget.isOpen())
					this._openPopup();
			}
		}
		this._super(e);
	},
	_onTextInputBlur: function (event)
	{
		var newVal = this._textInput.val();
		if (newVal != this._focusVal)
		{
			var relatedTarget = event.relatedTarget ? event.relatedTarget : document.activeElement;
			if (!$.contains(this._list[0], relatedTarget) && this._list[0] != relatedTarget)
				this._setValue(newVal, true);
		}
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
			anchor = this._list.find('.ibx-select-item:ibxNavFocusable').first();
			//this._setSelection(anchor, false, false);
		}
		anchor.focus();
	},
	_removeSelection: function (menuItem, bKeepAnchor, bNoUpdate)
	{
		if (!this._trigger('beforechange', null, {"item": menuItem, "action": "remove"}))
			return;

		var menuItem = $(menuItem);
		if (menuItem.length == 0)
			return;

		menuItem.removeClass("sel-selected");
		menuItem.data('ibxWidget').option('checked', false);
		if (!bKeepAnchor)
		{
			this._list.find('.sel-anchor').removeClass('sel-anchor');
			menuItem.addClass('sel-anchor');
		}
		if (!bNoUpdate)
		{
			this._setValue(this._getText(), true);
			this._trigger("set_form_value", null, { "elem": this.element, "value": this._getUserValue() });
		}
	},
	selectAll: function ()
	{
		this._resetHighlight();
		var items;
		if (this.options.multiSelect)
			items = this._list.find('.ibx-select-item');
		else
			items = this._list.find('.ibx-select-item').first();

		this._setSelection(items, false, false, false);
	},
	removeSelection: function ()
	{
		this._resetHighlight();
		this._removeSelection(this._list.find('.ibx-select-item'), false, false);
		this.options.userValue = '';
	},
	selectItems: function (elems)
	{
		this._resetHighlight();
		this._removeSelection(this._list.find('.ibx-select-item'), false, true);

		if (this.options.multiSelect)
		{
			if (elems.length > 0)
				this.options.userValue = $(elems[0]).ibxWidget('userValue');
			else
				this.options.userValue = '';
			this._setSelection(elems);
		}
		else
		{
			this.options.userValue = $(elems[0]).ibxWidget('userValue');
			this.selectItem(elems[0]);
		}
	},
	selectItem: function (el)
	{
		this._resetHighlight();
		this.options.userValue = $(el).ibxWidget('userValue');
		this._setSelection(el, false);
	},
	_setSelection: function (menuItem, bKeep, bKeepAnchor, bNoUpdate)
	{
		if (!this._trigger('beforechange', null, {"item": menuItem, "action": "select"}))
			return;
		
		var menuItem = $(menuItem);
		if (menuItem.length == 0)
			return;

		if (menuItem.hasClass('ibx-select-check-item'))
		{
			if (!bKeep && menuItem.hasClass('sel-selected'))
			{
				this._removeSelection(menuItem, bKeepAnchor, bNoUpdate);
				return;
			}
			bKeep = true;
		}
		this._list.find('.ibx-select-radio-item,.ibx-select-check-item').each(function (index, el) { $(el).data('ibxWidget').option('checked', false); })
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
				menuItem.data('ibxWidget').option('checked', true);
			}
		}
		this._list.find('.sel-selected.ibx-select-check-item').each(function (index, el) { $(el).data('ibxWidget').option('checked', true); })
		if (!bNoUpdate)
		{
			this._setValue(this._getText(), true);
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
			newText += $(el).ibxWidget('option', 'labelOptions.text') + "";
		}.bind(this));
		return newText;
	},
	_updateText: function (bNotEmpty)
	{
		var selection = this._list.find('.sel-selected');
		if (bNotEmpty && selection.length == 0)
			return;
		this.option("text", this._getText());
	},
	_applyFilter: function ()
	{
		return this._isEditable() && this.options.filter;
	},
	_fnMatch: null,
	match: function (fnMatch)
	{
		this._fnMatch = fnMatch;
		this._setHighlight();
	},
	externalResetFilter: function ()
	{
		this._externalFilter = false;
		this._resetHighlight();
	},
	_externalFilter: false,
	externalApplyFilter: function (searchText, fnFilter)
	{
		this._externalFilter = true;
		this._list.find(".ibx-select-item").each(function (index, el)
		{
			var itemText = $(el).data('ibxWidget').option('labelOptions.text') + "";
			if (fnFilter)
			{
				if (fnFilter(itemText, searchText))
					$(el).show();
				else
					$(el).hide();
			}
			else
			{
				if (0 == itemText.toLowerCase().indexOf(searchText.toLowerCase()))
					$(el).show();
				else
					$(el).hide();
			}
		}.bind(this));

		this._list.find(".ibx-select-group").each(function (index, el)
		{
			if (this._list.find(".ibx-radio-group-" + $(el).attr("id") + ":ibxNavFocusable").length > 0)
				$(el).show();
			else
				$(el).hide();
		}.bind(this));
	},
	_resetHighlight: function ()
	{
		if (this._externalFilter)
			return;
		this._list.find(".ibx-select-item").show();
		this._list.find(".ibx-select-group").show();
	},
	_setHighlight: function (search)
	{
		this._list.find('.ibx-select-radio-item,.ibx-select-check-item').each(function (index, el) { $(el).data('ibxWidget').option('checked', false); })
		this._list.find('.sel-selected').removeClass('sel-selected');
		var bFound = false;
		var searchText = search ? search : this._textInput.val();
		if (searchText)
		{
			this._list.find(".ibx-select-item").each(function (index, el)
			{
				var itemText = $(el).data('ibxWidget').option('labelOptions.text') + "";
				if (this._fnMatch ? (this._fnMatch(searchText, itemText)) : (0 == itemText.toLowerCase().indexOf(searchText.toLowerCase())))
				{
					if (!bFound)
						this._setSelection(el, false, false, true);
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

			// Hide empty groups when filtering
			if (this._applyFilter())
			{
				this._list.find(".ibx-select-group").each(function (index, el)
				{
					if (this._list.find(".ibx-radio-group-" + $(el).attr("id") + ":ibxNavFocusable").length > 0)
						$(el).show();
					else
						$(el).hide();
				}.bind(this));
			}
		}
		else
			this._resetHighlight();

		if (!bFound)
		{
			this._setSelection(null, false, false, true);
		}

	},
	closePopup: function ()
	{
		this._listWidget.close();
	},
	openPopup: function ()
	{
		this._openPopup();
	},
	_openPopup: function ()
	{
		if(this._trigger("beforeopenpopup"))
		{
			if(!this._listWidget.isOpen())
			{
				this._listWidget.open();
				this._list.css('min-width', this.element.outerWidth() + "px");
			}
		}
		else
			this._listWidget.close();
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
	_refresh: function ()
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
		var texta = ($(a).ibxWidget('option', 'text') + "").toLowerCase();
		var textb = ($(b).ibxWidget('option', 'text') + "").toLowerCase();
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
		aria:
		{
			"role":"option"
		}
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
	option:function(key, value)
	{
		var ret = this._superApply(arguments);
		if (key == "selected" && value && this._list)
			this.element.trigger("click");
		return ret;
	},
});

$.widget("ibi.ibxSelectCheckItem", $.ibi.ibxCheckMenuItem,
{
	options:
	{
		selected: false,
		userValue: "",
		endMarker: false,
		aria:
		{
			"role":"option"
		}
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
	_refresh: function ()
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
		aria:
		{
			"role":"option"
		}
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
});


$.ibi.ibxSelectItem.statics =
{
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
	children:function(selector)
	{
		return this.element.parent().children('.ibx-radio-group-' + $(this.element).attr("id"));
	},
	add:function(el, sibling, before)
	{
		el = $(el);
		el.each(function (idx, el)
		{
			el = $(el);
			var children = this.children();
			var after = (children.length == 0) ? this.element : after = children[children.length - 1];
			el.prepend($("<div>").addClass("ibx-menu-item-marker")).addClass('ibx-select-group-item ibx-radio-group-' + $(this.element).attr("id"));
			el.insertAfter(after);
			if (el.ibxWidget('option', 'selected'))
				this.options.selectCtrl.ibxWidget('selectItem', el);
		}.bind(this));
	},
	_refresh: function ()
	{
		this._super();
	}
});

/* New version of select */
$.widget("ibi.ibxSelect2", $.ibi.ibxTextField,
{
	options:
		{
			"btnShow": true,
			"popup": true,
			
			// overrides for the base
			"autoComplete": "off",
			"autoCorrect": "off",
			"autoCapitalize": "off",
			"spellCheck": "false",
			"controlClasses": "",
			
			"navKeyDir":"vertical",

			"aria":
			{
				"role":"combobox",
				"multiline":false,
				"haspopup":"listbox"
			}
		},
	_widgetClass: "ibx-select2",
	_control: null,
	control: function () { return this._control; },
	_popup: null,
	popup: function () { return this._popup;},
	_create: function ()
	{
		this._super();
	},
	_setAccessibility:function(accessible, aria)
	{
		var options = this.options;
		aria = this._super(accessible, aria);
		aria.expanded = this.options.popup && this._popup ? this._popup.ibxWidget('isOpen') : true;
		aria.controls = aria.owns = (this.options.popup && this._popup) ? this._popup.prop("id") : (this._control ? this._control.prop("id"): "");
		return aria;
	},
	_init: function ()
	{
		this._super();
		if (this.options.popup)
		{
			this.options.wrap = false;
			this._dropButton = $("<div class='ibx-select-open-btn'>").ibxButton();
			this.element.append(this._dropButton);
			this._dropButton.on("mousedown", this._onButtonMouseDown.bind(this)).on('click', this._onButtonClick.bind(this));
		}
		else
		{
			this.options.wrap = true;
		}

		this.element.on("ibx_textchanged", this._onTextChanged.bind(this));
		if (this.options.popup)
			this._textInput.on('click', this._onTextClick.bind(this));
		this._bindControl();
		this.refresh();
	},
	navKeyChildren:function(selector)
	{
		return this.element.children(selector || ":ibxNavFocusable");
	},
	add:function(el, sibling, before, refresh)
	{
		this._control.ibxWidget('add', el, sibling, before, refresh);
	},
	remove: function (el, destroy, refresh)
	{
		this._control.ibxWidget('remove', el, destroy, refresh);
	},

	// overridables in derived functions
	_createControl: function ()
	{
	},
	_initControl: function ()
	{
	},
	_onControlChange: function ()
	{
	},
	_onPopupOpen: function ()
	{
	},
	_onPopupClose: function ()
	{
	},
	_onTextChanged: function (e)
	{
	},
	_onDownArrow: function ()
	{
		if(this.options.popup && !this._popup.ibxWidget('isOpen'))
		{
			this._openPopup();
		}
	},
	// end overridables

	_bindControl: function ()
	{
		this._control = this._createControl();
		this._control.on('ibx_change', this._onControlChange.bind(this));
		this._initControl();
		
		if (this.options.popup)
		{
			this._popup = $("<div class='ibx-select-popup'>").ibxPopup(
			{
				"modal":false,
				"destroyOnClose":false,
				"effect":"fade",
				"position":{ my: "left top", at: "left bottom+1px", of: this.element },
				"autoFocus": this.options.readonly,
			});
			this._popup.ibxWidget('option', {"navKeyRoot":true, "navKeyAutoFocus":false, "navKeyDir":"vertical", "aria":{"accessible":true, "role":"listbox", "hidden":false}});
			this._popup.on("ibx_open ibx_close", function(e)
			{
				this.setAccessibility();
			}.bind(this));
			this._popup.ibxWidget('add', this._control);
			this.element.append(this._popup);
			this._popup.on("ibx_open", function (e)
			{
				this._onPopupOpen();
			}.bind(this)).on("ibx_beforeclose", function(e, closeData)
			{
				if (closeData && $.contains(this.element[0], closeData.target))
					return false;
			}.bind(this)).on("ibx_close", function ()
			{
				this._onPopupClose();
			}.bind(this));
			}
		else
		{
			//this._control.ibxWidget('option', {"navKeyRoot":true, "navKeyAutoFocus":false, "navKeyDir":"vertical", "aria":{"accessible":true, "role":"listbox", "hidden":false}});
			this._control.css("width", "100%").css("align-self", "flex-start");
			this.element.append(this._control);
		}
	},
	_onButtonMouseDown: function (e)
	{
		this._textInput.focus();
	},
	// Override text
	_onTextInputKeyDown: function (e)
	{
		if(e.keyCode == $.ui.keyCode.DOWN) // open dropdown on down arrow
		{
			this._onDownArrow();
		}
		else if(e.keyCode == $.ui.keyCode.ESCAPE) // close dropdown on up arrow or enter
		{
			if(this.options.popup && this._popup.ibxWidget('isOpen'))
				this._popup.ibxWidget('close');
		}
		else if(e.keyCode == $.ui.keyCode.ENTER) // close dropdown on enter and update with the selection
		{
			if(this.options.popup && this._popup.ibxWidget('isOpen'))
				this._popup.ibxWidget('close');
		}
		else if (e.keyCode == $.ui.keyCode.TAB) // close popup on tab
		{
			if(this.options.popup && this._popup.ibxWidget('isOpen'))
				this._popup.ibxWidget('close');
		}
		else if (e.keyCode != 37 && e.keyCode != 39 && !e.shiftKey && !e.ctrlKey) // open popup for everything except left/right arrows
		{
			this._onDownArrow();
		}
		this._super(e);
	},
	_onTextInputBlur: function (event)
	{
		var newVal = this._textInput.val();
		if (newVal != this._focusVal)
		{
			var relatedTarget = event.relatedTarget ? event.relatedTarget : document.activeElement;
			if (!$.contains(this._control[0], relatedTarget) && this._control[0] != relatedTarget)
				this._setValue(newVal, true);
		}
	},
	_onTextClick: function (e)
	{
		this._dontFocusText = true;
		this._openPopup();
	},
	_onButtonClick: function (e)
	{
		if (this._popup.ibxWidget('isOpen'))
			this._popup.ibxWidget('close');
		else
		{
			this._dontFocusText = true;
			this._openPopup();
		}
	},
	closePopup: function ()
	{
		this._popup.ibxWidget('close');
	},
	openPopup: function ()
	{
		this._openPopup();
	},
	_openPopup: function ()
	{
		if(this._trigger("beforeopenpopup"))
		{
			if(!this._popup.ibxWidget('isOpen'))
			{
				this._popup.ibxWidget('open');
				this._popup.css('min-width', this.element.width() + "px");
				this._control.ibxWidget('refresh');
			}
		}
		else
			this._popup.ibxWidget('close');
	},
	_destroy: function ()
	{
		this._super();
		if (this._dropButton)
			this._dropButton.remove();
		this._control.remove();
	},
	_refresh: function ()
	{
		this._super();
		if (this._dropButton)
			this.options.btnShow ? this._dropButton.show() : this._dropButton.hide();

		if (this._control)
		{
			if (this.options.controlClasses && this._control)
				this._control.addClass(this.options.controlClasses);
		}
	}
});

$.widget("ibi.ibxSelectList", $.ibi.ibxSelect2,
{
	options:
		{
            "listOptions": {"multiSelect": false},
		},
	_widgetClass: "ibx-select-list",
	_create: function ()
	{
		this._super();
	},
	_init: function ()
	{
		this._super();
	},
	_createControl: function ()
	{
		return $("<div tabindex='-1'>").ibxSelectItemList(this.options.listOptions);
	},
	_initControl: function ()
	{
		this._control.ibxWidget('add', this.element.children(".ibx-select-item, .ibx-select-group"));
	},
	_onControlChange: function (e)
	{
		if (e.target !== this._control[0])
			return;
		this._setValue(this._control.ibxWidget('getText'), true);
		if(this.options.popup && !this._control.ibxWidget('option', 'multiSelect') && this._popup)
			this._popup.ibxWidget('close');
	},
	_onPopupOpen: function ()
	{
		if (!this._dontFocusText)
			this._textInput.focus();
		else
		{
			if (this.options.readonly)
				this._control.ibxWidget('focusSelItem');
		}
		this._dontFocusText = false;
	},
	_onPopupClose: function ()
	{
		this._control.ibxWidget('resetHighlight');
	},
	_onTextChanged: function (e)
	{
		this._control.ibxWidget('setHighlight', this._textInput.val());
	},
	_onDownArrow: function ()
	{
		this._super();
		if(this.options.popup)
		{
			if (this._popup.ibxWidget('isOpen'))
				this._control.ibxWidget('focusSelItem');
			else
				this._dontFocusText = true;
		}
		else
			this._control.ibxWidget('focusSelItem');
	},
	_refresh: function ()
	{
		this._super();
		if (this._control)
			this._control.ibxWidget('option', this.options.listOptions);
	},
});

$.widget("ibi.ibxSelectItemList", $.ibi.ibxVBox,
{
	options:
	{
		"multiSelect": false,
		"align": "stretch",
		"navKeyRoot":true,
		"navKeyAutoFocus":false,
		"navKeyDir":"vertical",
		"aria":{"accessible":true, "role":"listbox", "hidden":false},
		"filter": false,
	},
	_widgetClass: "ibx-select-item-list",
	_create: function ()
	{
		this._super();

	},
	_init: function ()
	{
		this._super();
		this.add(this.element.children(".ibx-select-item, .ibx-select-group"));
		this.element.on("click", this._onSelect.bind(this));
	},
	add: function (el, sibling, before, refresh)
	{
		el = $(el).filter(".ibx-select-group, .ibx-select-item");
		el.each(function(sibling, before, refresh, idx, el)
		{
			el = $(el);
			this._super(el, sibling, before, false);

			if (el.hasClass('ibx-select-group'))
			{
				el.ibxWidget("option", 'selectCtrl', this.element);
				var children = el.children('.ibx-select-item');
				children.prepend($("<div>").addClass("ibx-select-group-marker")).addClass('ibx-select-group-item ibx-radio-group-' + $(el).attr("id"));
				this._super(children, el, false, false);
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
		}.bind(this, sibling, before, refresh));
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
		this._fnSort = fnSort = fnSort || this._fnSort || $.ibi.ibxSelectList.statics.sort;
		var children = this.element.find(".ibx-select-item, .ibx-select-group").not(".ibx-select-group-item");
		children.sort(fnSort.bind(this));
		children.each(function (index, el)
		{
			el = $(el);
			this.add(el);
			if (el.hasClass('ibx-select-group'))
			{
				var groupChildren = this.element.find(".ibx-radio-group-" + el.attr("id"));
				groupChildren.sort(fnSort.bind(this));
				this.add(groupChildren, el)
			}
		}.bind(this));
	},
	_fnMatch: null,
	match: function (fnMatch)
	{
		this._fnMatch = fnMatch;
		this._setHighlight();
	},
	_onSelect: function (e)
	{
		if (!e.originalEvent)
			return;

		var selItem = $(e.originalEvent.target).hasClass('ibx-select-item') ? $(e.originalEvent.target) : $(e.originalEvent.target).closest('.ibx-select-item');
		if (selItem.length == 0)
			return;

		var bKeepAnchor = false;
		var bSynthetic = false;
		if (e.originalEvent.shiftKey)
		{
			bKeepAnchor = true;
			// select block - select between current anchor and current item.
			//				- if no current anchor, select from beginning to current item
			var all = this.element.find('.ibx-select-item');
			all.removeClass('sel-selected');
			var anchor = this.element.find('.sel-anchor').first();
			if (anchor.length == 0)
				anchor = all.first();
			if (anchor.length == 0)
			{
				this._setSelection(selItem, true, bKeepAnchor);
			}
			else if ($(anchor).is(selItem))
			{
				this._setSelection(selItem, false, false);
			}
			else
			{
				var bAdd = false;
				for (var i = 0; i < all.length; i++)
				{
					var current = $(all[i]);
					if (!bAdd && (current.is(selItem) || current.is(anchor)))
					{
						bAdd = true;
						current.addClass('sel-selected');
					}
					else
					{
						if (bAdd)
						{
							current.addClass('sel-selected');
							if (current.is(selItem) || current.is(anchor))
								break;
						}
					}
				}
				this._setSelection(selItem, true, bKeepAnchor);
			}
		}
		else if (e.originalEvent.ctrlKey)
		{
			// multi select
			if ($(selItem).hasClass("sel-selected"))
				this._removeSelection(selItem, bKeepAnchor);
			else
				this._setSelection(selItem, true, bKeepAnchor);
		}
		else
		{
			// single select
			this._setSelection(selItem, false, false);
		}
	},
	selected: function (element)
	{
		if (typeof (element) == "undefined")
			return this.element.find('.sel-selected');
		else
		{
			$(element).trigger("click");
			return this;
		}
	},
	_setSelection: function (selItem, bKeep, bKeepAnchor, bNoUpdate)
	{
		if (!this._trigger('beforechange', null, {"item": selItem, "action": "select"}))
			return;
		
		var selItem = $(selItem);
		if (selItem.length == 0)
			return;

		if (selItem.hasClass('ibx-select-check-item'))
		{
			if (!bKeep && selItem.hasClass('sel-selected'))
			{
				this._removeSelection(selItem, bKeepAnchor, bNoUpdate);
				return;
			}
			bKeep = true;
		}
		this.element.find('.ibx-select-radio-item,.ibx-select-check-item').each(function (index, el) { $(el).data('ibxWidget').option('checked', false); })
		if (!this.options.multiSelect || !bKeep)
		{
			this.element.find('.sel-selected').removeClass('sel-selected');
		}
		if (!this.options.multiSelect || !bKeepAnchor)
		{
			this.element.find('.sel-anchor').removeClass('sel-anchor');
			if (selItem.length > 0)
			{
				selItem.addClass('sel-selected sel-anchor');
				selItem.data('ibxWidget').option('checked', true);
			}
		}
		this.element.find('.sel-selected.ibx-select-check-item').each(function (index, el) { $(el).data('ibxWidget').option('checked', true); })
		if (!bNoUpdate)
		{
			this._trigger("change");
		}
	},
	_removeSelection: function (selItem, bKeepAnchor, bNoUpdate)
	{
		if (!this._trigger('beforechange', null, {"item": selItem, "action": "remove"}))
			return;

		var selItem = $(selItem);
		if (selItem.length == 0)
			return;

		selItem.removeClass("sel-selected");
		selItem.each(function (index,el){
			$(el).ibxWidget('option', 'checked', false);
		})
		if (!bKeepAnchor)
		{
			this.element.find('.sel-anchor').removeClass('sel-anchor');
			selItem.first().addClass('sel-anchor');
		}
		if (!bNoUpdate)
		{
			this._trigger("change");
		}
	},
	resetHighlight: function ()
	{
		this._resetHighlight();
	},
	_resetHighlight: function ()
	{
		this.element.find(".ibx-select-item").show();
		this.element.find(".ibx-select-group").show();
	},
	setHighlight: function (search)
	{
		this._setHighlight(search);
	},
	_setHighlight: function (searchText)
	{
		this.element.find('.ibx-select-radio-item,.ibx-select-check-item').each(function (index, el) { $(el).data('ibxWidget').option('checked', false); })
		this.element.find('.sel-selected').removeClass('sel-selected');
		var bFound = false;
		if (searchText)
		{
			this.element.find(".ibx-select-item").each(function (index, el)
			{
				var itemText = $(el).data('ibxWidget').option('text') + "";
				if (this._fnMatch ? (this._fnMatch(searchText, itemText)) : (0 == itemText.toLowerCase().indexOf(searchText.toLowerCase())))
				{
					if (!bFound)
						this._setSelection(el, false, false, true);
					bFound = true;
					if (!this.options.filter)
						return false;
					else
						$(el).show();
				}
				else
				{
					if (this.options.filter)
						$(el).hide();
				}
			}.bind(this));

			// Hide empty groups when filtering
			if (this.options.filter)
			{
				this.element.find(".ibx-select-group").each(function (index, el)
				{
					if (this.element.find(".ibx-radio-group-" + $(el).attr("id") + ":ibxNavFocusable").length > 0)
						$(el).show();
					else
						$(el).hide();
				}.bind(this));
			}
		}
		else
			this._resetHighlight();

		if (!bFound)
		{
			this._setSelection(null, false, false, true);
		}

	},
	getText: function ()
	{
		var newText = "";
		var selection = this.element.find('.sel-selected');
		selection.each(function (index, el)
		{
			if (newText)
				newText += ", ";
			newText += $(el).ibxWidget('option', 'text') + "";
		}.bind(this));
		return newText;
	},
	userValue: function (value)
	{
		if (typeof (value) == "undefined")
		{
			var selected = this.element.find('.sel-selected');

			if (this.options.multiSelect)
			{
				// return an array of user values
				var ret = [];
				selected.each(function (index, el)
				{
					ret.push($(el).ibxWidget('option', 'userValue'));
				}.bind(this));
				return ret;
			}
			else
			{
				return (selected.length == 0 ? null : selected.first().ibxWidget('option', 'userValue'));
			}
		}
		else
		{
			this._resetHighlight();
			this._removeSelection(this.element.find('.ibx-select-item'), false, true);

			if (this.options.multiSelect)
			{

				var userValues;
				if (value instanceof Array)
					userValues = value;
				else
				{
					userValues = [];
					userValues.push(value);
				}

				var selItems = [];

				this.element.find('.ibx-select-item').each(function (index, el)
				{
					var itemUserValue = $(el).ibxWidget('option', 'userValue');
					for (var i = 0; i < userValues.length; i++)
					{
						if (itemUserValue == userValues[i])
						{
							selItems.push(el);
							break;
						}
					}
				}.bind(this));

				if (selItems.length > 0)
					this.selectItems(selItems);
			}
			else
			{
				if (value instanceof Array)
				{
					if (value.length == 0)
						return this;
					else
						value = value[0];
				}

				this.element.find('.ibx-select-item').each(function (index, el)
				{
					var itemUserValue = $(el).ibxWidget('option', 'userValue');
					if (itemUserValue == value)
					{
						this.selectItem(el);
						return false;
					}
				}.bind(this));
			}

			return this;
		}
	},
	focusSelItem: function ()
	{
		var anchor = this.element.find('.sel-anchor').first()
		if (anchor.length == 0)
			anchor = this.element.find('.sel-selected').first();
		if (anchor.length == 0)
		{
			anchor = this.element.find('.ibx-select-item:ibxNavFocusable').first();
			//this._setSelection(anchor, false, false);
		}
		anchor.focus();
	},
	selectItems: function (elems)
	{
		this._resetHighlight();
		this._removeSelection(this.element.find('.ibx-select-item'), false, true);

		if (this.options.multiSelect)
		{
			if (elems.length > 0)
				this.options.userValue = $(elems[0]).ibxWidget('userValue');
			else
				this.options.userValue = '';
			this._setSelection(elems);
		}
		else
		{
			this.options.userValue = $(elems[0]).ibxWidget('userValue');
			this.selectItem(elems[0]);
		}
	},
	selectItem: function (el)
	{
		this._resetHighlight();
		this.options.userValue = $(el).ibxWidget('userValue');
		this._setSelection(el, false);
	},
	_refresh: function ()
	{
		this._super();
	},
	selectAll: function ()
	{
		this._resetHighlight();
		var items;
		if (this.options.multiSelect)
			items = this.element.find('.ibx-select-item');
		else
			items = this.element.find('.ibx-select-item').first();

		this._setSelection(items, false, false, false);
	},
	removeSelection: function ()
	{
		this._resetHighlight();
		this._removeSelection(this.element.find('.ibx-select-item'), false, false);
		this.options.userValue = '';
	},
});

$.ibi.ibxSelectList.statics =
{
	sort: function (a, b)
	{
		var texta = ($(a).ibxWidget('option', 'text') + "").toLowerCase();
		var textb = ($(b).ibxWidget('option', 'text') + "").toLowerCase();
		if (texta < textb)
			return this._sortType ? -1 : 1;
		else if (texta > textb)
			return this._sortType ? 1 : -1;
		else
			return 0;
	}
};

$.widget("ibi.ibxSelectItem2", $.ibi.ibxButtonSimple,
{
	options:
	{
		selected: false,
		userValue: "",
	},
	_widgetClass: "ibx-select-item",
	_create: function ()
	{
		this.element.attr("tabIndex", -1)
		this._super();
	},
});

$.widget("ibi.ibxSelectCheckItem2", $.ibi.ibxCheckBoxSimple,
{
	options:
	{
		selected: false,
		userValue: "",
	},
	_widgetClass: "ibx-select-check-item",
	_create: function ()
	{
		this.element.attr("tabIndex", -1).addClass('ibx-select-item');
		this._super();
	},
});

$.widget("ibi.ibxSelectRadioItem2", $.ibi.ibxRadioButtonSimple,
{
	options:
	{
		selected: false,
		userValue: "",
	},
	_widgetClass: "ibx-select-radio-item",
	_create: function ()
	{
		this.element.attr("tabIndex", -1).addClass('ibx-select-item');
		this._super();
	},
});

$.widget("ibi.ibxSelectGroup2", $.ibi.ibxLabel,
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
	children:function(selector)
	{
		return this.element.parent().children('.ibx-radio-group-' + $(this.element).attr("id"));
	},
	add:function(el, sibling, before)
	{
		el = $(el);
		el.each(function (idx, el)
		{
			el = $(el);
			var children = this.children();
			var after = (children.length == 0) ? this.element : after = children[children.length - 1];
			el.prepend($("<div>").addClass("ibx-select-group-marker")).addClass('ibx-select-group-item ibx-radio-group-' + $(this.element).attr("id"));
			el.insertAfter(after);
			if (el.ibxWidget('option', 'selected'))
				this.options.selectCtrl.ibxWidget('selectItem', el);
		}.bind(this));
	},
	_refresh: function ()
	{
		this._super();
	}
});

$.widget("ibi.ibxSelectPagedList", $.ibi.ibxSelect2, {
	options:
	{
        'readonly': true,
        'autoHeight': true,
		'autoHeightGap': 50,
        "listOptions": {"search": false, "selectionControls": false, "multiSelect": false},
        
		/*
        'listClasses': 'search-list ibx-menu-no-icons',
        */
	},
	_widgetClass: "ibx-select-paged-list",
	_create: function ()
	{
		this._super();
	},
	_init: function ()
	{
		this._super();
		this.element.on('ibx_change', this._onChange.bind(this));
	},
	_bindControl: function ()
	{
		this._super();
        $(window).on('resize', this._onWindowResize.bind(this));
        if (this._popup)
        {
            this._popup.on("ibx_open", function (e)
            {
                this._control.ibxWidget('resetSearch', true);
				this._setMaxHeight();
            }.bind(this));
        }
	},
	_createControl: function ()
	{
		return $("<div tabindex='-1'>").ibxPagedItemList(this.options.listOptions);
	},
	_initControl: function ()
	{
		// remove markup children and add them as values
		var children = this.element.find('.ibx-select-item').detach();
		var values = [];
		children.each(function (){
			var obj = {};
			obj.display = $(this).ibxWidget('option', 'text');
			obj.value = $(this).ibxWidget('option', 'userValue');
			if (!obj.value)
				obj.value = obj.display;
			values.push(obj);
		});
		this.values(values);
	},
	_onControlChange: function (e)
	{
		if (e.target !== this._control[0])
			return;
		this._setValue(this._control.ibxWidget('getText'), true);
		if(this.options.popup && !this._control.ibxWidget('option', 'multiSelect') && this._popup)
			this._popup.ibxWidget('close');
	},
	_removeSelection: function (item, bKeepAnchor, bNoUpdate)
	{
		var item = $(item);
		if (item.length > 0)
		{
			item.each(function (index, el){
				var obj = $(el).ibxWidget('option', 'valObj');
				obj.checked = false;
			});
		}
		this._super(item, bKeepAnchor, bNoUpdate);
	},
	selected: function (element)
	{
		if (typeof (element) == "undefined")
			return this._control.find('.sel-selected');
		else
		{
			$(element).trigger("click");
			return this;
		}
	},
	_onChange: function (e)
	{
		if (e.target !== this.element[0])
			return;
		this.option('text', this._getText());
	},
	_getText: function ()
	{
		var values = this._control.ibxWidget('getSelected');
		var allValues = this._control.ibxWidget('values');
		var count = allValues.length; 
		var selValues = [];
		values.forEach(function (value){
			selValues.push(value.display ? value.display : value.value);
		});

		var ret = "";
		for (var i = 0; i < selValues.length; i++)
		{
			if (i > 0)
				ret += ', ';
			ret += selValues[i];
		}
		return ret;	
	},
	userValue: function (value)
	{
		this._super(value);
		if (typeof(value) == "undefined")
		{
			var values = this._control.ibxWidget('getSelected');
			if (this._control.ibxWidget('option', 'multiSelect'))
			{
				var ret = [];
				values.forEach(function (val){
					ret.push(val.value);
				});
				return ret;
			}
			else
			{
				if (values.length == 0)
					return null;
				else
					return values[0].value;
				
			}
		}
		else
		{
			var userValues;
			if (value instanceof Array)
				userValues = value;
			else
			{
				userValues = [];
				userValues.push(value);
			}

			var currentValues = this._control.ibxWidget('values');
			currentValues.forEach(function (cv){
				for (var i = 0; i < userValues.length; i++)
				{
					if (cv.value == userValues[i])
						cv.checked = true;
				}
			});
			return this;
		}
	},
	values: function (listValues)
	{
		this._control.ibxWidget('values', listValues);
        window.setTimeout(function (){this.option('text', this._getText());}.bind(this), 100);
	},
	selectItems: function (elems)
	{
		this._control.ibxWidget('selectItems', elems);
		this._updateText();
	},
	selectDefaultOrAll: function (defValue)
	{
		var ret = this._control.ibxWidget('selectDefaultOrAll', defValue);
		if (ret)
			this._updateText();
		return ret;
	},
	_updateText: function ()
	{
		var selection = this._control.find('.sel-selected');
		this.option("text", this._getText());
	},
	inSetPage: function ()
	{
		return this._control.ibxWidget('inSetPage');
	},
    _onWindowResize: function ()
    {
        if (this._popup)
        {
            this._setMaxHeight();
            window.setTimeout(function (){
				this._popup.css('min-width', this.element.width() + "px");
			}.bind(this), 10);
        }
	},
	_setMaxHeight: function ()
	{
		if (this.options.autoHeight)
		{
			var popupTop = this._control.offset().top;
			this._control.css('max-height', Math.max(100,$(window).outerHeight() - popupTop - this.options.autoHeightGap) + "px");
		}
	},
	_refresh: function ()
	{
		this._super();
		if (this._control)
			this._control.ibxWidget('option', this.options.listOptions);
	},
});

$.widget("ibi.ibxPagedItemList", $.ibi.ibxVBox,
{
	options:
	{
		'enablePaging': false,
		"multiSelect": false,
		'search': false,
		'selectionControls': false,
		'enablePagingTrigger': 200,
		"pageSize": 10,
		"align": "stretch",
	},
	_widgetClass: "ibx-paged-item-list",
	_create: function ()
	{
		this._super();

		// remove markup children and add them as values
		var children = this.element.find('.ibx-select-item').detach();
		var values = this._values;
		children.each(function (){
			var obj = {};
			obj.display = $(this).ibxWidget('option', 'text');
			obj.value = $(this).ibxWidget('option', 'userValue');
			if (!obj.value)
				obj.value = obj.display;
			values.push(obj);
		});
		
		this._optionsBox = $("<div class='ibx-page-list-options-box'>").ibxVBox({'align': 'stretch'});
		this._searchBoxWrapper = $("<div class='ibx-page-list-search-wrapper'>").ibxHBox({'align': 'stretch'});
		this._searchBox = $("<div tabindex='-1' class='ibx-page-list-options-search'>").ibxTextField();
		this._clearSearch = $("<div tabindex='-1' class='ibx-page-list-options-search-clear'>").ibxButtonSimple({glyphClasses:"fa fa-times"}).on('click', this._onClearSearch.bind(this));
		this._clearSearch.prop('title', ibx.resourceMgr.getString('IBX_PAGE_LIST_TOOLTIP_CLEAR_SEARCH'));
		this._searchBoxWrapper.append(this._searchBox, this._clearSearch);
		this._buttonsBox = $("<div class='ibx-page-list-select-options-buttons'>").ibxHBox();
		this._selectAll = $("<div tabindex='-1' class='ibx-page-list-select-options-all'>").ibxButton({'justify': 'center', 'text': ibx.resourceMgr.getString('IBX_PAGE_LIST_SELECT_ALL')});
		this._clearAll = $("<div tabindex='-1' class='ibx-page-list-select-options-none'>").ibxButton({'justify': 'center', 'text': ibx.resourceMgr.getString('IBX_PAGE_LIST_SELECT_NONE')});
		this._buttonsBox.ibxWidget('add', this._selectAll);
		this._buttonsBox.ibxWidget('add', this._clearAll);
		this._optionsBox.ibxWidget('add', this._searchBoxWrapper);
		this._optionsBox.ibxWidget('add', this._buttonsBox);

		this._listControl = $("<div class='ibx-paged-item-list-inner'>").ibxSelectItemList({'align': 'stretch'});
		
		this._searchBox.on("ibx_textchanged", this._onSearch.bind(this));
		this._selectAll.on("click", this._onSelectAll.bind(this));
		this._clearAll.on("click", this._onClearAll.bind(this));

		this._pageBox = $("<div class='ibx-page-list-page-box'>").ibxHBox({'align': 'stretch'});
		this._pageLeft = $("<div tabindex='-1' class='ibx-page-list-page-box-left'>").ibxButtonSimple({glyphClasses:"fa fa-chevron-left"}).on('click', this._onPageLeft.bind(this));
		this._pageRight = $("<div tabindex='-1' class='ibx-page-list-page-box-right'>").ibxButtonSimple({glyphClasses:"fa fa-chevron-right"}).on('click', this._onPageRight.bind(this));
		this._pageLabel = $('<div class="ibx-page-list-page-box-label">').ibxLabel({'justify': 'center'});
		this._pageBox.append(this._pageLeft, this._pageLabel, this._pageRight);

		this.element.append(this._optionsBox, this._listControl, this._pageBox);
	},
	_init: function ()
	{
		this._super();
		this._listControl.ibxWidget('option', 'multiSelect', this.options.multiSelect);
		this._listControl.on("ibx_change", this._onListControlChange.bind(this));
		// add markup items
		if (this._values.length > 0)
			this.values(this._values);
	},
	_refresh: function ()
	{
		this._super();
		if (this.options.search || this.options.selectionControls)
			this._optionsBox.show();
		else
			this._optionsBox.hide();
		if (this.options.search)
			this._searchBoxWrapper.show();
		else
			this._searchBoxWrapper.hide();
		if (this.options.selectionControls)
			this._buttonsBox.show();
		else
			this._buttonsBox.hide();

		if (this.options.enablePaging)
			this._pageBox.show();
		else
			this._pageBox.hide();
	},
	_onListControlChange: function (e)
	{
		if (e.target !== this._listControl[0])
			return;
		if (!this._inSetPage && e.target === this._listControl[0])
		{
			if (!this.options.multiSelect)
			{
				this._values.forEach(function (value){
					value.checked = false;
				});
			}		
			var item = this.element.find('.sel-anchor');
			if (item && item.length == 1)
			{
				var obj = item.ibxWidget('option', 'valObj');
				var checked = item.ibxWidget('option', 'checked');
				obj.checked = checked;
			}
			this._trigger("change", e);
		}
	},
	getText: function ()
	{
		return this._listControl.ibxWidget('getText');
	},
	_onClearSearch: function ()
	{
		this._resetSearch(false);
    },
    resetSearch: function (bForceFirstPage)
    {
        this._resetSearch(bForceFirstPage);
    },
	_resetSearch: function(bForceFirstPage)
	{
		this._searchBox.ibxWidget('option', 'text', '');
		if (this._filter)
		{
			this._filter = '';
			this._extractFiltered();
			this._setPage(0);
		}
		else if (bForceFirstPage)
			this._setPage(0);
	},
	_onSearch: function ()
	{
		var text = this._searchBox.ibxWidget('option', 'text').toLowerCase();
		if (text != this._filter)
		{
			this._filter = text;
			this._extractFiltered();
			this._setPage(0);
		}
	},
	_onSelectAll: function ()
	{
		this._filteredValues.forEach(function (value){
			value.checked = true;
		});

		var items = this.element.find('.ibx-paged-item');
		items.each(function (index, el){
			el = $(el);
			el.removeClass('sel-selected');
			el.ibxWidget('option', 'valObj').checked = true;
		});
		this._listControl.ibxWidget('selectAll');
	},
	_onClearAll: function ()
	{
		this._filteredValues.forEach(function (value){
			value.checked = false;
		});
		this._listControl.ibxWidget('removeSelection');
	},
	_onPageLeft: function ()
	{
		if (this._currentPage > 0)
			this._setPage(this._currentPage - 1);
	},
	_onPageRight: function ()
	{
		if (this._currentPage + 1 < this._pageCount())
			this._setPage(this._currentPage + 1);
	},
	add:function(item, sibling, before, refresh)
	{
		this._listControl.ibxWidget("add", item, sibling, before, refresh);
	},
	_updatePageLabel: function ()
	{
		
		this._pageLabel.ibxWidget('option', 'text', sformat(ibx.resourceMgr.getString('IBX_PAGE_LIST_PAGES'), (this._currentPage + 1), this._pageCount()));
	},
	_setPage: function (pageIndex)
	{
		this._inSetPage = true;
		var options = this.options;
		//options.parent.options.userValue = '';

		if (options.enablePaging)
		{
			if (this._filteredValues.length <= options.pageSize)
				this._pageBox.hide();
			else
				this._pageBox.show();
		}

		this._currentPage = pageIndex;

		this._listControl.empty();

		var pageStart = options.enablePaging ? (options.pageSize * pageIndex) : 0;
		var pageEnd = options.enablePaging ? Math.min(this._filteredValues.length, pageStart + options.pageSize) : this._filteredValues.length;

		for (var i = pageStart; i < pageEnd; ++i)
		{
			var valInfo = this._filteredValues[i];
			var item;
			if (options.multiSelect)
				item = $("<div class='ibx-paged-item'>").ibxSelectCheckItem2({'text': valInfo.display ? valInfo.display : valInfo.value, 'userValue': valInfo.value, 'selected': valInfo.checked });
			else
				item = $("<div class='ibx-paged-item'>").ibxSelectItem2({'text': valInfo.display ? valInfo.display : valInfo.value, 'userValue': valInfo.value, 'selected': valInfo.checked });
			if (valInfo.class)
				item.addClass(valInfo.class);
			item.ibxWidget('option', 'valObj', valInfo);
			this.add(item);
		}

		this._updatePageLabel();
		this._inSetPage = false;
	},
	/*
		Array of values to display. Each entry is an object with the structure
		{
			'value': 'item1', // the value of the item - required
			'display': 'Item1', // display value - optional (value will be used if missing)
			'checked': true, // initial state - optional (false by default)
			'class': 'css class, // optional class to be added to the created select item
			'data': obj, // optional data attached to the item
		}
	*/
	_values: [],
	_currentPage: 0,
	_filter: '',
	_filteredValues: [],
	_extractFiltered: function ()
	{
		this._filteredValues = [];
		this._values.forEach(function (value){
			if (!this._filter || (value.display ? value.display : value.value).toLowerCase().indexOf(this._filter) >= 0)
				this._filteredValues.push(value);
		}.bind(this));
	},
	_pageCount: function ()
	{
		return Math.ceil(this._filteredValues.length / this.options.pageSize);
	},
	values: function (values)
	{
		if (typeof (values) == "undefined")
			return this._values;
		else
		{
			var options = this.options;
			this.options.enablePaging = values.length >= this.options.enablePagingTrigger;
			this._values = values;
			this._extractFiltered();
			this._setPage(0);
			return this;
		}
	},
	getSelected: function ()
	{
		var sel = [];
		this._values.forEach(function (value){
			if (value.checked)
				sel.push(value);
		});
		return sel;
	},
	selectItems: function (elems)
	{
		if (elems instanceof Array)
			elems.forEach(function (el){
				$(el).ibxWidget('option', 'valObj').checked = true;
			});
		else
			elems.each(function (index, el){
				$(el).ibxWidget('option', 'valObj').checked = true;
		});
		this._listControl.ibxWidget('selectItems', elems);
		
	},
	inSetPage: function ()
	{
		return this._inSetPage;
	},
});

//# sourceURL=select.ibx.js

