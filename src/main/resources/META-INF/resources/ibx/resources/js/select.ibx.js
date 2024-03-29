/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.136 $:

$.widget("ibi.ibxSelectBase", $.ibi.ibxTextField,
{
	options:
		{
			"btnShow": true,
			"popup": true,
			"popupOnArrowOnly":false,

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
				"multiline":null,
				"haspopup":"listbox"
			}
		},
	_widgetClass: "ibx-select-base",
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
		aria.expanded = this.options.popup && this._popup ? this._popup.ibxWidget("isOpen") : true;
		aria.controls = aria.owns = (this.options.popup && this._popup) ? this._popup.prop("id") : (this._control ? this._control.prop("id"): "");
		return aria;
	},
	_init: function ()
	{
		this._super();
		if (this.options.popup)
		{
			this.options.wrap = false;
			this._dropButton = $("<div class='ibx-select-open-btn'>").ibxButton({aria:{hidden:true}});
			this.element.append(this._dropButton);
			this._dropButton.on("mousedown", this._onButtonMouseDown.bind(this)).on("click", this._onButtonClick.bind(this));
		}
		else
		{
			this.options.wrap = true;
		}

		this.element.on("ibx_textchanged", this._onTextChanged.bind(this));
		if (this.options.popup)
			this._textInput.on("click", this._onTextClick.bind(this));
		this._bindControl();
		this.refresh();
	},
	navKeyChildren:function(selector)
	{
		return this.element.children(selector || ":ibxNavFocusable");
	},
	// overridables in derived functions
	_createControl: function ()
	{
		// return the control in derived
		return null;
	},
	_initControl: function ()
	{
		// init the control in derived
	},
	_onControlChange: function (e, data)
	{
		if (e.target == this._control[0])
			return this._trigger("change", e, data);
	},
	_onControlBeforeChange: function (e, data)
	{
		if (e.target == this._control[0])
			return this._trigger("beforechange", e, data);
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
	_onDownArrow: function(e)
	{
		if(this.options.popup && !this._popup.ibxWidget("isOpen"))
		{
			this._openPopup(e);
		}
	},
	_boundPopupPosition: null,
	_popupPosition: function (pos, info)
	{
		// fine-tune the position and size of the popup
		if (this.options.popup)
			this._popup.css(pos);	

	},	
	// end overridables

	_bindControl: function ()
	{
		this._control = this._createControl();
		this._control.on("ibx_change", this._onControlChange.bind(this));
		this._control.on("ibx_beforechange", this._onControlBeforeChange.bind(this));
		
		if (this.options.popup)
		{
			this._boundPopupPosition = this._popupPosition.bind(this);
			this._popup = $("<div class='ibx-select-popup'>").ibxPopup(
			{
				"modal":false,
				"destroyOnClose":false,
				"effect":"fade",
				"focusDefault":".sel-selected",
				"position":{ my: "left top", at: "left bottom+1px", of: this.element, collision: "none", using: this._boundPopupPosition },
			});
			this._popup.on("ibx_open ibx_close", function(e)
			{
				this.setAccessibility();
			}.bind(this));
			this._control.ibxWidget('option', 'focusRoot', true);
			this._popup.ibxWidget("add", this._control);
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
			this._control.css("width", "100%").css("align-self", "flex-start");
			this.element.append(this._control);
		}

		this._initControl();
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
			this._onDownArrow(e);
		}
		else if(e.keyCode == $.ui.keyCode.ESCAPE) // close dropdown on up arrow or enter
		{
			if(this.options.popup && this._popup.ibxWidget("isOpen"))
				this._popup.ibxWidget("close");
		}
		else if(e.keyCode == $.ui.keyCode.ENTER) // close dropdown on enter and update with the selection
		{
			if(this.options.popup && this._popup.ibxWidget("isOpen"))
				this._popup.ibxWidget("close");
		}
		else if (e.keyCode == $.ui.keyCode.TAB) // close popup on tab
		{
			if(this.options.popup && this._popup.ibxWidget("isOpen"))
				this._popup.ibxWidget("close");
		}
		else if (e.keyCode != 37 && e.keyCode != 39 && !e.shiftKey && !e.ctrlKey) // open popup for everything except left/right arrows
		{
			if(this.options.popup && !this._popup.ibxWidget("isOpen"))
				this._openPopup(e);
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
		this._dontFocusText = false;
		this._openPopup(e);
	},
	_onButtonClick: function (e)
	{
		if (this._popup.ibxWidget("isOpen"))
			this._popup.ibxWidget("close");
		else
		{
			this._dontFocusText = false;
			this._openPopup(e);
		}
	},
	closePopup: function ()
	{
		this._popup.ibxWidget("close");
	},
	openPopup: function ()
	{
		this._openPopup();
	},
	_openPopup: function(e)
	{
		var event = this.element.dispatchEvent("ibx_beforeopenpopup", e);
		if(!event.isDefaultPrevented())
		{
			if(!this._popup.ibxWidget("isOpen"))
			{
				this._popup.ibxWidget("open");
				this._control.ibxWidget("refresh");
			}
		}
		else
			this._popup.ibxWidget("close");
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
				this._control.ibxAddClass(this.options.controlClasses);
		}
	}
});

$.widget("ibi.ibxSelect", $.ibi.ibxSelectBase,
{
	options:
		{
			"multiSelect": false,
			"autoHeight": true,
			"autoHeightGap": 50,
		},
	_widgetClass: "ibx-select",
	_create: function ()
	{
		this._super();
	},
	_init: function ()
	{
		this._super();
		this.element.on('ibx_action', this._onAction.bind(this));
	},
	_createControl: function ()
	{
		return $("<div tabindex='0'>").ibxSelectItemList({"multiSelect": this.options.multiSelect});
	},
	_initControl: function ()
	{
		this._control.ibxWidget("add", this.element.children(".ibx-select-item, .ibx-select-group, .ibx-select-separator, .ibx-select-separator-label"));
	},
	_setValue: function (value, bFormat, extra)
	{
		this.options.text = bFormat && this.options.fnFormat ? this.options.fnFormat(value) : value;
		this.refresh();
		var data = {"text": this.options.text};
		if (extra)
			$.extend(data, extra);
		this._trigger("change", null, data);
	},
	_onControlChange: function (e, data)
	{
		if (e.target !== this._control[0])
			return;
		this._setValue(this._control.ibxWidget("getText"), true, data);
		if(this.options.popup && !this._control.ibxWidget("option", "multiSelect") && this._popup)
			this._popup.ibxWidget("close");
	},
	_onPopupOpen: function ()
	{
		if (!this._dontFocusText)
			this._textInput.focus();
		else
		{
			if (this.options.readonly)
				this._control.ibxWidget("focusSelItem");
		}
		this._dontFocusText = false;
	},
	_onPopupClose: function ()
	{
		window.setTimeout(function (){
			if (!this.destroyed())
				this._control.ibxWidget("resetHighlight");
		}.bind(this), 10);
	},
	_onTextChanged: function (e)
	{
		this._control.ibxWidget("setHighlight", this._textInput.val());
	},
	_onAction: function (e)
	{
		this._control.ibxWidget("selectHighlight");
	},
	_onDownArrow: function (e)
	{
		this._super(e);
		if(this.options.popup)
		{
			if (this._popup.ibxWidget("isOpen"))
				this._control.ibxWidget("focusSelItem");
			else
				this._dontFocusText = true;
		}
		else
			this._control.ibxWidget("focusSelItem");
	},
	addControlItem:function(el, sibling, before, refresh)
	{
		this._control.ibxWidget("add", el, sibling, before, refresh);
	},
	removeControlItem: function (el, destroy, refresh)
	{
		this._control.ibxWidget("remove", el, destroy, refresh);
	},
	controlItems: function (selector)
	{
		return this._control.ibxWidget("children", selector);
	},
	selected: function (element)
	{
		if(element === undefined)
			return this._control.ibxWidget("selected");
		this._control.ibxWidget("selected", element)
		return this.element;
	},
	userValue: function (value)
	{
		if(value === undefined)
			return this._control.ibxWidget("userValue");
		this._control.ibxWidget("userValue", value)
		return this.element;
	},
	_popupPosition: function (pos, info)
	{
		if (this.options.popup)
		{
			if (this.options.autoHeight)
			{
				var maxHeight = $(window).height() + $(window).scrollTop() - info.target.top - info.target.height - this.options.autoHeightGap;
				if (maxHeight < 100)
				{
					// Flip it up
					maxHeight = info.target.top - $(window).scrollTop() - this.options.autoHeightGap;
					pos.bottom = $(window).height() - info.target.top;
					pos.top = "unset";
				}
				else
					pos.bottom = "unset";
				this._control.css("max-height", maxHeight + "px");
			}
			this._control.css("min-width", info.target.width + "px");
			this._popup.css(pos);
		}
	},
	_refresh: function ()
	{
		this._super();
		if (this._control)
			this._control.ibxWidget("option", "multiSelect", this.options.multiSelect);
	},
});

$.widget("ibi.ibxSelectItemList", $.ibi.ibxVBox,
{
	options:
	{
		"multiSelect": false,
		"align": "stretch",
		"navKeyRoot":true,
		"navKeyDir":"vertical",
		"navKeyResetFocusOnBlur":false,
		"navKeyKeys":
		{
			"cancel":"",
		},
		"focusDefault": true,
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
		this.add(this.element.children(".ibx-select-item, .ibx-select-group, .ibx-select-separator, .ibx-select-separator-label"));
		this.element.on("click", this._onSelect.bind(this));
	},
	add: function (el, sibling, before, refresh)
	{
		el = $(el).filter(".ibx-select-group, .ibx-select-item, .ibx-select-separator, .ibx-select-separator-label");
		this._super(el, sibling, before, false);

		var selChildren = [];
		el.each(function(idx, el)
		{
			el = $(el);
			if (el.hasClass("ibx-select-group"))
			{
				el.ibxWidget("option", "selectCtrl", this.element);
				var children = el.children(".ibx-select-item");
				children.prepend($("<div>").ibxAddClass("ibx-select-group-marker")).ibxAddClass("ibx-select-group-item ibx-radio-group-" + $(el).attr("id"));
				this._super(children, el, false, false);
				children.each(function (index, el)
				{
					if ($(el).ibxWidget("option", "selected") || this.options.userValue && this.options.userValue == $(el).ibxWidget("option", "userValue"))
						selChildren.push($(el));
				}.bind(this));
			}
			else if (el.is(".ibx-select-separator, .ibx-select-separator-label"))
			{
				;// do nothing for separators
			}
			else
			{
				if (el.ibxWidget("option", "selected") || this.options.userValue && this.options.userValue == el.ibxWidget("option", "userValue"))
					selChildren.push($(el));
			}
		}.bind(this));
		selChildren.forEach(function(el){
			this._setSelection(el, true);
		}.bind(this));
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
		var children = this.element.find(".ibx-select-item, .ibx-select-group").not(".ibx-select-group-item");
		children.sort(fnSort.bind(this));
		children.each(function (index, el)
		{
			el = $(el);
			this.add(el);
			if (el.hasClass("ibx-select-group"))
			{
				var groupChildren = this.element.find(".ibx-radio-group-" + el.attr("id"));
				groupChildren.sort(fnSort.bind(this));
				this.add(groupChildren, el);
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
		var event = (e.originalEvent && e.originalEvent.target) ? e.originalEvent : e;
		var target = (e.originalEvent && e.originalEvent.target) ? e.originalEvent.target : e.target;
		var selItem = $(target).hasClass("ibx-select-item") ? $(target) : $(target).closest(".ibx-select-item");
		if (selItem.length == 0)
			return;

		var bKeepAnchor = false;
		var bSynthetic = false;
		if (this.options.multiSelect && event.shiftKey)
		{
			bKeepAnchor = true;
			// select block - select between current anchor and current item.
			//				- if no current anchor, select from beginning to current item
			var all = this.element.find(".ibx-select-item");
			all.ibxRemoveClass("sel-selected");
			var anchor = this.element.find(".sel-anchor").first();
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
						current.ibxAddClass("sel-selected");
					}
					else
					{
						if (bAdd)
						{
							current.ibxAddClass("sel-selected");
							if (current.is(selItem) || current.is(anchor))
								break;
						}
					}
				}
				this._setSelection(selItem, true, bKeepAnchor);
			}
		}
		else if (this.options.multiSelect && event.ctrlKey)
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
			return this.element.find(".sel-selected");
		else
		{
			$(element).trigger("click");
			return this;
		}
	},
	_setSelection: function (selItem, bKeep, bKeepAnchor, bNoUpdate)
	{
		if (!this._trigger("beforechange", null, {"item": selItem, "action": "select"}))
		{
			/*
			if (selItem.ibxWidget("option", "checked"))
				selItem.ibxWidget("option", "checked", false);
			*/
			return;
		}
		
		var selItem = $(selItem);
		if (selItem.length == 0)
			return;

		if (selItem.hasClass("ibx-select-check-item"))
		{
			if (!bKeep && selItem.hasClass("sel-selected"))
			{
				this._removeSelection(selItem, bKeepAnchor, bNoUpdate);
				return;
			}
			bKeep = true;
		}
		this.element.find(".ibx-select-radio-item,.ibx-select-check-item").each(function (index, el) { $(el).data("ibxWidget").option({"checked": false, "selected": false}); });
		if (!this.options.multiSelect || !bKeep)
		{
			this.element.find(".sel-selected").ibxRemoveClass("sel-selected");
		}
		if (!this.options.multiSelect || !bKeepAnchor)
		{
			this.element.find(".sel-anchor").ibxRemoveClass("sel-anchor");
			if (selItem.length > 0)
			{
				selItem.ibxAddClass("sel-selected sel-anchor");
				selItem.data("ibxWidget").option({"checked": true, "selected": true});
			}
		}
		this.element.find(".sel-selected.ibx-select-check-item, .sel-selected.ibx-select-radio-item").each(function (index, el) { $(el).data("ibxWidget").option({"checked": true, "selected": true}); });
		if (!bNoUpdate)
		{
			this._trigger("change", null, {"item": selItem, "action": "select"});
		}
	},
	_removeSelection: function (selItem, bKeepAnchor, bNoUpdate)
	{
		if (!this._trigger("beforechange", null, {"item": selItem, "action": "remove"}))
		{
			/*
			if (!selItem.ibxWidget("option", "checked"))
				selItem.ibxWidget("option", "checked", true);
			*/
			return;
		}

		var selItem = $(selItem);
		if (selItem.length == 0)
			return;

		selItem.ibxRemoveClass("sel-selected");
		selItem.each(function (index,el){
			$(el).ibxWidget("option", {"checked": false, "selected": false});
		});
		if (!bKeepAnchor)
		{
			this.element.find(".sel-anchor").ibxRemoveClass("sel-anchor");
			selItem.first().ibxAddClass("sel-anchor");
		}
		if (!bNoUpdate)
		{
			this._trigger("change", null, {"item": selItem, "action": "remove"});
		}
	},
	selectHighlight: function ()
	{
		this.element.find(".ibx-select-item-highlight").trigger("click");
	},
	resetHighlight: function ()
	{
		this._resetHighlight();
	},
	_resetHighlight: function ()
	{
		this.element.find(".ibx-select-item").ibxRemoveClass("ibx-select-item-highlight");
		this.element.find(".ibx-select-item").show();
		this.element.find(".ibx-select-group").show();
	},
	setHighlight: function (searchText)
	{
		this._setHighlight(searchText);
	},
	_setHighlight: function (searchText)
	{
		if (searchText)
		{
			var found = false;
			this.element.find(".ibx-select-item").each(function (index, el)
			{
				var itemText = $(el).data("ibxWidget").option("text") + "";
				if (this._fnMatch ? (this._fnMatch(searchText, itemText)) : (0 == itemText.toLowerCase().indexOf(searchText.toLowerCase())))
				{
					if (!found && !this.options.filter)
					{
						$(el).ibxAddClass("ibx-select-item-highlight");
						el.scrollIntoView(false);
					}
					else
						$(el).ibxRemoveClass("ibx-select-item-highlight");
					found = true;
					$(el).show();
				}
				else
				{
					$(el).ibxRemoveClass("ibx-select-item-highlight");
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
	},
	getText: function ()
	{
		var newText = "";
		var selection = this.element.find(".sel-selected");
		selection.each(function (index, el)
		{
			if (newText)
				newText += ", ";
			newText += $(el).ibxWidget("option", "text") + "";
		}.bind(this));
		return newText;
	},
	userValue: function (value)
	{
		if (typeof (value) == "undefined")
		{
			var selected = this.element.find(".sel-selected");

			if (this.options.multiSelect)
			{
				// return an array of user values
				var ret = [];
				selected.each(function (index, el)
				{
					ret.push($(el).ibxWidget("option", "userValue"));
				}.bind(this));
				return ret;
			}
			else
			{
				return (selected.length == 0 ? null : selected.first().ibxWidget("option", "userValue"));
			}
		}
		else
		{
			this._resetHighlight();
			this._removeSelection(this.element.find(".ibx-select-item"), false, true);

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

				this.element.find(".ibx-select-item").each(function (index, el)
				{
					var itemUserValue = $(el).ibxWidget("option", "userValue");
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

				this.element.find(".ibx-select-item").each(function (index, el)
				{
					var itemUserValue = $(el).ibxWidget("option", "userValue");
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
		var anchor = this.element.find(".ibx-select-item-highlight:ibxNavFocusable").first();
		if (anchor.length == 0)
			anchor = this.element.find(".sel-anchor:ibxNavFocusable").first();
		if (anchor.length == 0)
			anchor = this.element.find(".sel-selected:ibxNavFocusable").first();
		if (anchor.length == 0)
		{
			anchor = this.element.find(".ibx-select-item:ibxNavFocusable").first();
			//this._setSelection(anchor, false, false);
		}
		anchor.focus();
	},
	selectItems: function (elems)
	{
		this._resetHighlight();
		this._removeSelection(this.element.find(".ibx-select-item"), false, true);

		if (this.options.multiSelect)
		{
			if (elems.length > 0)
				this.options.userValue = $(elems[0]).ibxWidget("userValue");
			else
				this.options.userValue = "";
			this._setSelection(elems);
		}
		else
		{
			this.options.userValue = $(elems[0]).ibxWidget("userValue");
			this.selectItem(elems[0]);
		}
	},
	selectItem: function (el)
	{
		this._resetHighlight();
		this.options.userValue = $(el).ibxWidget("userValue");
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
			items = this.element.find(".ibx-select-item");
		else
			items = this.element.find(".ibx-select-item").first();

		this._setSelection(items, false, false, false);
	},
	removeSelection: function ()
	{
		this._resetHighlight();
		this._removeSelection(this.element.find(".ibx-select-item"), false, false);
		this.options.userValue = "";
	},
});

$.ibi.ibxSelect.statics =
{
	sort: function (a, b)
	{
		var texta = ($(a).ibxWidget("option", "text") + "").toLowerCase();
		var textb = ($(b).ibxWidget("option", "text") + "").toLowerCase();
		if (texta < textb)
			return this._sortType ? -1 : 1;
		else if (texta > textb)
			return this._sortType ? 1 : -1;
		else
			return 0;
	}
};

$.widget("ibi.ibxSelectItem", $.ibi.ibxButtonSimple,
{
	options:
	{
		selected: false,
		userValue: "",
		aria: {
			role: "option"
		}
	},
	_widgetClass: "ibx-select-item",
	_create: function ()
	{
		this.element.attr("tabIndex", -1);
		this._super();
	},
});

$.widget("ibi.ibxSelectCheckItem", $.ibi.ibxCheckBoxSimple,
{
	options:
	{
		selected: false,
		userValue: "",
	},
	_widgetClass: "ibx-select-check-item",
	_create: function ()
	{
		this.element.attr("tabIndex", -1).ibxAddClass("ibx-select-item");
		this._super();
	},
});

$.widget("ibi.ibxSelectRadioItem", $.ibi.ibxRadioButtonSimple,
{
	options:
	{
		selected: false,
		userValue: "",
	},
	_widgetClass: "ibx-select-radio-item",
	_create: function ()
	{
		this.element.attr("tabIndex", -1).ibxAddClass("ibx-select-item");
		this._super();
	},
});

// This should only be used with a simple select, otherwise unexpected results might appear
$.widget("ibi.ibxSelectSeparator", $.ibi.ibxWidget,
{
	options:
	{
		"aria":{"role":"separator", "hidden":true},
	},
	_widgetClass: "ibx-select-separator",
});
$.widget("ibi.ibxSelectSeparatorLabel", $.ibi.ibxMenuSeparatorLabel, {_widgetClass:'ibx-select-separator-label'});

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
		return this.element.parent().children(".ibx-radio-group-" + $(this.element).attr("id"));
	},
	add:function(el, sibling, before)
	{
		el = $(el);
		el.each(function (idx, el)
		{
			el = $(el);
			var children = this.children();
			var after = (children.length == 0) ? this.element : after = children[children.length - 1];
			el.prepend($("<div>").ibxAddClass("ibx-select-group-marker")).ibxAddClass("ibx-select-group-item ibx-radio-group-" + $(this.element).attr("id"));
			el.insertAfter(after);
			if (el.ibxWidget("option", "selected"))
				this.options.selectCtrl.ibxWidget("selectItem", el);
		}.bind(this));
	},
	_refresh: function ()
	{
		this._super();
	}
});

$.widget("ibi.ibxSelectPaged", $.ibi.ibxSelectBase, {
	options:
	{
        "readonly": true,
        "autoHeight": true,
		"autoHeightGap": 50,
		"search": false,
		"selectionControls": false,
		"enablePagingTrigger": 200,
		"pageSize": 10,
		"multiSelect": false,
		/*
        "listClasses": "search-list ibx-menu-no-icons",
        */
	},
	_widgetClass: "ibx-select ibx-select-paged",
	_create: function ()
	{
		this._super();
	},
	_init: function ()
	{
		this._super();
		this.element.on("ibx_change", this._onChange.bind(this));
	},
	_createControl: function ()
	{
		return $("<div tabindex='0'>").ibxSelectItemListPaged({"search": this.options.search, "selectionControls": this.options.selectionControls, "multiSelect": this.options.multiSelect, "enablePagingTrigger": this.options.enablePagingTrigger, "pageSize": this.options.pageSize});
	},
	_initControl: function ()
	{
		// remove markup children and add them as values
		var children = this.element.find(".ibx-select-item").detach();
		var values = [];
		children.each(function (){
			var obj = {};
			obj.display = $(this).ibxWidget("option", "text");
			obj.value = $(this).ibxWidget("option", "userValue");
			if (!obj.value)
				obj.value = obj.display;
			values.push(obj);
		});
		this.values(values);

        if (this._popup)
        {
            this._popup.on("ibx_close", function (e)
            {
				this._control.ibxWidget("resetSearch", true);
            }.bind(this));
		}
	},
	_setValue: function (value, bFormat, extra)
	{
		this.options.text = bFormat && this.options.fnFormat ? this.options.fnFormat(value) : value;
		this.refresh();
		var data = {"text": this.options.text};
		if (extra)
			$.extend(data, extra);
		this._trigger("change", null, data);
	},
	_onControlChange: function (e, data)
	{
		if (e.target !== this._control[0])
			return;
		this._setValue(this._control.ibxWidget("getText"), true, data);
		if(this.options.popup && !this._control.ibxWidget("option", "multiSelect") && this._popup)
			this._popup.ibxWidget("close");
	},
	_removeSelection: function (item, bKeepAnchor, bNoUpdate)
	{
		var item = $(item);
		if (item.length > 0)
		{
			item.each(function (index, el){
				var obj = $(el).ibxWidget("option", "valObj");
				obj.checked = false;
			});
		}
		this._super(item, bKeepAnchor, bNoUpdate);
	},
	selected: function (element)
	{
		if (typeof (element) == "undefined")
			return this._control.find(".sel-selected");
		else
		{
			$(element).trigger("click");
			return this;
		}
	},
	_onPopupOpen: function ()
	{
		if (!this._dontFocusText)
			this._textInput.focus();
		else
		{
			if (this.options.readonly)
				this._control.ibxWidget("focusSelItem");
		}
		this._dontFocusText = false;
	},
	_onDownArrow: function (e)
	{
		this._super(e);
		if(this.options.popup)
		{
			if (this._popup.ibxWidget("isOpen"))
				this._control.ibxWidget("focusSelItem");
			else
				this._dontFocusText = true;
		}
		else
			this._control.ibxWidget("focusSelItem");
	},
	_onChange: function (e)
	{
		if (e.target !== this.element[0])
			return;
		this.option("text", this._getText());
	},
	_getText: function ()
	{
		var values = this._control.ibxWidget("selected");
		var allValues = this._control.ibxWidget("values");
		var count = allValues.length; 
		var selValues = [];
		values.forEach(function (value){
			selValues.push(value.display ? value.display : value.value);
		});

		var ret = "";
		for (var i = 0; i < selValues.length; i++)
		{
			if (i > 0)
				ret += ", ";
			ret += selValues[i];
		}
		return ret;	
	},
	userValue: function (value)
	{
		this._super(value);
		if (typeof(value) == "undefined")
		{
			var values = this._control.ibxWidget("selected");
			if (this._control.ibxWidget("option", "multiSelect"))
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
			this._control.ibxWidget("userValue", userValues);

			var currentValues = this._control.ibxWidget("values");
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
		this._control.ibxWidget("values", listValues);
        window.setTimeout(function (){this.option("text", this._getText());}.bind(this), 100);
	},
	selectItems: function (elems)
	{
		this._control.ibxWidget("selectItems", elems);
		this._updateText();
	},
	selectDefaultOrAll: function (defValue)
	{
		var ret = this._control.ibxWidget("selectDefaultOrAll", defValue);
		if (ret)
			this._updateText();
		return ret;
	},
	_updateText: function ()
	{
		var selection = this._control.find(".sel-selected");
		this.option("text", this._getText());
	},
	inSetPage: function ()
	{
		return this._control.ibxWidget("inSetPage");
	},
	_popupPosition: function (pos, info)
	{
		if (this.options.popup)
		{
			if (this.options.autoHeight)
			{
				var maxHeight = $(window).height() + $(window).scrollTop() - info.target.top - info.target.height - this.options.autoHeightGap;
				if (maxHeight < 100)
				{
					// Flip it up
					maxHeight = info.target.top - $(window).scrollTop() - this.options.autoHeightGap;
					pos.bottom = $(window).height() - info.target.top;
					pos.top = "unset";
				}
				else
					pos.bottom = "unset";
				this._control.css("max-height", maxHeight + "px");
			}
			this._control.css("min-width", info.target.width + "px");
			this._popup.css(pos);
		}
	},
	_destroy: function ()
	{
		if (this._popup)
			this._popup.off("ibx_close");
		this._super();
	},
	_refresh: function ()
	{
		this._super();
		if (this._control)
			this._control.ibxWidget("option", {"search": this.options.search, "selectionControls": this.options.selectionControls, "multiSelect": this.options.multiSelect, "enablePagingTrigger": this.options.enablePagingTrigger, "pageSize": this.options.pageSize});
	},
});

$.widget("ibi.ibxSelectItemListPaged", $.ibi.ibxVBox,
{
	options:
	{
		"multiSelect": false,
		"search": false,
		"selectionControls": false,
		"enablePagingTrigger": 200,
		"pageSize": 10,
		"align": "stretch",
		"focusDefault": true,
	},
	_widgetClass: "ibx-select-item-list-paged",
	_enablePaging: false,
	listControl: function ()
	{
		return this._listControl;
	},
	_create: function ()
	{
		this._super();

		// remove markup children and add them as values
		var children = this.element.find(".ibx-select-item").detach();
		var values = this._values;
		children.each(function (){
			var obj = {};
			obj.display = $(this).ibxWidget("option", "text");
			obj.value = $(this).ibxWidget("option", "userValue");
			if (!obj.value)
				obj.value = obj.display;
			values.push(obj);
		});
		
		this._optionsBox = $("<div class='ibx-page-list-options-box'>").ibxVBox({"align": "stretch"});
		this._searchBoxWrapper = $("<div class='ibx-page-list-search-wrapper'>").ibxHBox({"align": "stretch"});
		this._searchBox = $("<div tabindex='0' class='ibx-page-list-options-search'>").ibxTextField();
		this._searchBoxWrapper.append(this._searchBox);
		this._buttonsBox = $("<div class='ibx-page-list-select-options-buttons'>").ibxHBox({justify: "end"});
		this._selectAll = $("<div tabindex='0' class='ibx-page-list-select-options-all'>").ibxButton({"justify": "center", "text": ibx.resourceMgr.getString('IBX_PAGE_LIST_SELECT_ALL')});
		this._clearAll = $("<div tabindex='0' class='ibx-page-list-select-options-none'>").ibxButton({"justify": "center", "text": ibx.resourceMgr.getString('IBX_PAGE_LIST_SELECT_NONE')});
		this._buttonsBox.ibxWidget("add", this._selectAll);
		this._buttonsBox.ibxWidget("add", this._clearAll);
		this._optionsBox.ibxWidget("add", this._searchBoxWrapper);
		this._optionsBox.ibxWidget("add", this._buttonsBox);

		this._listControl = $("<div tabindex='0' class='ibx-select-item-list-paged-inner'>").ibxSelectItemList({"align": "stretch"});
		
		this._searchBox.on("ibx_textchanged", this._onSearch.bind(this));
		this._selectAll.on("click", this._onSelectAll.bind(this));
		this._clearAll.on("click", this._onClearAll.bind(this));

		this._pageBox = $("<div class='ibx-page-list-page-box'>").ibxHBox({"align": "stretch"});
		this._pageLeft = $("<div tabindex='0' class='ibx-page-list-page-box-left'>").ibxButtonSimple({"glyphClasses":"ibx-icons ibx-glyph-chevron-left"}).on("click", this._onPageLeft.bind(this));
		this._pageRight = $("<div tabindex='0' class='ibx-page-list-page-box-right'>").ibxButtonSimple({"glyphClasses":"ibx-icons ibx-glyph-chevron-right"}).on("click", this._onPageRight.bind(this));
		this._pageLabel = $("<div class='ibx-page-list-page-box-label'>").ibxLabel({"justify": "center"});
		this._pageBox.append(this._pageLeft, this._pageLabel, this._pageRight);

		this.element.append(this._optionsBox, this._listControl, this._pageBox);
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		this._searchBox.attr("title", ibx.resourceMgr.getString("IBX_SELECT_SEARCH_VALUES")).ibxWidget("refresh");
		this._pageLeft.attr("title", ibx.resourceMgr.getString("IBX_SELECT_PAGE_PREV"));
		this._pageRight.attr("title", ibx.resourceMgr.getString("IBX_SELECT_PAGE_NEXT"));
		return aria;
	},
	_init: function ()
	{
		this._super();
		this._listControl.ibxWidget("option", "multiSelect", this.options.multiSelect);
		this._listControl.on("ibx_change", this._onListControlChange.bind(this));
		this._listControl.on("ibx_beforechange", this._onListControlBeforeChange.bind(this));
		this._searchBox.on("ibx_action", this._onSearchAction.bind(this));
		this._searchBox.on("ibx_textchanged", this._onSearchTextChanged.bind(this));
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

		if (this._enablePaging)
			this._pageBox.show();
		else
			this._pageBox.hide();
		if (this.options.search || this.options.selectionControls || this._enablePaging)
			this.element.ibxAddClass("paged");
		else
			this.element.ibxRemoveClass("paged");
		var oldMultiSelect = this._listControl.ibxWidget("option", "multiSelect");
		this._listControl.ibxWidget("option", "multiSelect", this.options.multiSelect);
		if (oldMultiSelect != this.options.multiSelect)
			this._setPage();
	},
	focusSelItem: function ()
	{
		this._listControl.ibxWidget("focusSelItem");
	},
	_onSearchTextChanged: function (e)
	{
		this._listControl.ibxWidget("setHighlight", this._searchBox.ibxWidget("option", "text"));
	},
	_onSearchAction: function (e)
	{
		this._listControl.ibxWidget("selectHighlight");
	},
	_onListControlBeforeChange: function (e, data)
	{
		if (e.target !== this._listControl[0] || this._inSetPage)
			return;
		return this._trigger("beforechange", e, data);
	},
	_onListControlChange: function (e, data)
	{
		if (e.target !== this._listControl[0] || this._inSetPage)
			return;

		//if not multiselect, then deselect all items before adjusting selection below.
		if (!this.options.multiSelect)
		{
			this._values.forEach(function (value){
				value.checked = false;
			});
		}

		//adjust the anchor node (that which was clicked on).
		var item = this.element.find(".sel-anchor");
		if (item && item.length == 1)
		{
			var obj = item.ibxWidget("option", "valObj");
			var checked = item.ibxWidget("option", "checked");
			obj.checked = checked;
		}

		//adjust all the checked items
		var items = this.element.find(".checked");
		items.each(function(idx, el)
		{
			var obj = $(el).ibxWidget("option", "valObj");
			obj.checked = true;
		});

		this._trigger("change", e, data);
	},
	getText: function ()
	{
		return this._listControl.ibxWidget("getText");
	},
    resetSearch: function (bForceFirstPage)
    {
        this._resetSearch(bForceFirstPage);
    },
	_resetSearch: function(bForceFirstPage)
	{
		this._searchBox.ibxWidget("option", "text", "");
		if (this._filter)
		{
			this._filter = "";
			this._extractFiltered();
			this._setPage(0);
		}
		else if (bForceFirstPage)
			this._setPage(0);
	},
	_onSearch: function ()
	{
		var text = this._searchBox.ibxWidget("option", "text").toLowerCase();
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

		var items = this.element.find(".ibx-paged-item");
		items.each(function (index, el){
			el = $(el);
			el.ibxRemoveClass("sel-selected");
			el.ibxWidget("option", "valObj").checked = true;
		});
		this._listControl.ibxWidget("selectAll");
	},
	_onClearAll: function ()
	{
		this._filteredValues.forEach(function (value){
			value.checked = false;
		});
		this._listControl.ibxWidget("removeSelection");
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
	userValue: function (value)
	{
		return this._listControl.ibxWidget('userValue', value);
	},
	_updatePageLabel: function ()
	{
		
		this._pageLabel.ibxWidget("option", "text", sformat(ibx.resourceMgr.getString('IBX_PAGE_LIST_PAGES'), (this._currentPage + 1), this._pageCount()));
	},
	_setPage: function (pageIndex)
	{
		if (pageIndex === undefined)
			pageIndex = 0;
		
		this._inSetPage = true;
		var options = this.options;
		//options.parent.options.userValue = "";

		if (this._enablePaging)
		{
			if (this._filteredValues.length <= options.pageSize)
				this._pageBox.hide();
			else
				this._pageBox.show();
		}

		this._currentPage = pageIndex;

		this._listControl.empty();
		this._listControl.ibxWidget("option", "userValue", "");

		var pageStart = this._enablePaging ? (options.pageSize * pageIndex) : 0;
		var pageEnd = this._enablePaging ? Math.min(this._filteredValues.length, pageStart + options.pageSize) : this._filteredValues.length;

		var nodes = [];
		for (var i = pageStart; i < pageEnd; ++i)
		{
			var valInfo = this._filteredValues[i];
			var item;
			if (options.multiSelect)
				item = $("<div class='ibx-paged-item'>").ibxSelectCheckItem({"text": valInfo.display ? valInfo.display : valInfo.value, "userValue": valInfo.value, "selected": valInfo.checked });
			else
				item = $("<div class='ibx-paged-item'>").ibxSelectItem({"text": valInfo.display ? valInfo.display : valInfo.value, "userValue": valInfo.value, "selected": valInfo.checked });
			if (valInfo.class)
				item.ibxAddClass(valInfo.class);
			item.ibxWidget("option", "valObj", valInfo);
			nodes.push(item[0]);
		}
		this.add($(nodes));

		this._updatePageLabel();
		this._inSetPage = false;
	},
	/*
		Array of values to display. Each entry is an object with the structure
		{
			"value": "item1", // the value of the item - required
			"display": "Item1", // display value - optional (value will be used if missing)
			"checked": true, // initial state - optional (false by default)
			"class": "css class", // optional class to be added to the created select item
			"data": obj, // optional data attached to the item
		}
	*/
	_values: [],
	_currentPage: 0,
	_filter: "",
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
			this._enablePaging = values.length >= this.options.enablePagingTrigger;
			// make a shallow copy of the array
			this._values = values.slice();
			this._extractFiltered();
			this._setPage(0);
			return this;
		}
	},
	selected: function (element)
	{
		if (typeof (element) == "undefined")
		{
			var sel = [];
			this._values.forEach(function (value){
				if (value.checked)
					sel.push(value);
			});
			return sel;
		}
		else
		{
			this.selectItems(element);
			return this;
		}
		
	},
	selectItems: function (elems)
	{
		if (elems instanceof Array)
			elems.forEach(function (el){
				$(el).ibxWidget("option", "valObj").checked = true;
			});
		else
			elems.each(function (index, el){
				$(el).ibxWidget("option", "valObj").checked = true;
		});
		this._listControl.ibxWidget("selectItems", elems);
		
	},
	inSetPage: function ()
	{
		return this._inSetPage;
	},
});

//# sourceURL=select.ibx.js

