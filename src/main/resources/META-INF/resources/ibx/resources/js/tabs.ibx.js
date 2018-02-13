/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	TAB PANE WIDGETS
******************************************************************************/
$.widget("ibi.ibxTabPane", $.ibi.ibxFlexBox,
{
	options:
	{
		navKeyRoot:true,
		navKeyAutoFocus:true,
		position: "top",
		direction: "column",
		align: "stretch",
		wrap: "false",
		selected: "",
		tabBarOptions:{
			"showPrevButton": false,
			"showNextButton": false,
			"alignChildren": "flex-start",
		},
		aria:{}
	},
	_widgetClass: "ibx-tab-pane",
	_tabBar: null,
	_create: function ()
	{
		this._super();
		this._group = $("<div>").uniqueId().appendTo(this.element);
		this._group.ibxRadioGroup({name:this._group.prop("id")}).on("ibx_change", this._onTabChange.bind(this));
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		return aria;
	},
	_destroy: function ()
	{
		this._removeTabBar();
		this._super();
	},
	_init: function ()
	{
		this._super();
		this._createTabBar();
		this.add(this.element.children(".ibx-tab-page"));
	},
	children:function(selector)
	{
		return this._super(selector || ".ibx-tab-page");
	},
	add:function(el, sibling, before, refresh)
	{
		this._super(el, sibling, before, refresh);

		el = $(el).filter(".ibx-tab-page");
		el.each(function(idx, el)
		{
			el = $(el);
			el.css("flex", "1 1 auto").addClass("tpg-hidden").on("keydown", this._onTabPaneKeyDown.bind(this));
			var button = el.ibxWidget('button');
			var groupName = this._group.ibxWidget("option", "name");
			button.ibxWidget("option", "group", groupName);
			var nextPage = el.next('.ibx-tab-page');
			if (nextPage.length > 0)
			{
				nextButton = nextPage.ibxWidget('button');
				if ($.contains(this._tabBar[0], nextButton[0]))
					this._tabBar.ibxWidget("add", button, nextButton, true, true);
				else
					this._tabBar.ibxWidget("add", button, null, null, true);
			}
			else
				this._tabBar.ibxWidget("add", button, null, null, true);
		}.bind(this));
		this.refresh();
	},
	remove:function(el, destroy, refresh)
	{
		el = $(el).filter(".ibx-tab-page");
		el.each(function(idx, el)
		{
			var button = $(el).ibxWidget('button');
			button.css("flex", "").removeClass("tpg-hidden").detach();
			button.ibxWidget("option", "group", "");
			this._group.ibxRadioGroup("removeControl", button);
		}.bind(this));
		this._super(el, destroy, refresh);
	},
	/*
	option:function (key, value)
	{
		var posValue = null;
		if (key == 'position')
			posValue = value;
		else if (typeof key == 'object' && key['position'])
			posValue = key['position'];
		if (posValue)
		{
			if (this._tabBar)
			{
				this._tabBar.ibxTabGroup("option", "direction", (posValue == "left" || posValue == "right") ? "column" : "row");
				this._tabBar.ibxTabGroup("option", "position", posValue);
			}
		}
		var ret = this._superApply(arguments);

		if (posValue)
		{
			switch (posValue)
			{
				default:
				case "top":
					this.options.direction = "column"; break;
				case "bottom":
					this.options.direction = "columnReverse"; break;
				case "left":
					this.options.direction = "row"; break;
				case "right":
					this.options.direction = "rowReverse"; break;
			}
		}

		return ret;
	},
	*/
	_createTabBar: function ()
	{
		var name = "" + this.widgetName + this.uuid;
		switch (this.options.position)
		{
			default:
			case "top":
				this.option("direction", "column");
				this._tabBar = $("<div>").ibxHTabGroup({ "name": name, position: "top"}, this.options.tabBarOptions);
				break;

			case "bottom":
				this.option("direction", "columnReverse");
				this._tabBar = $("<div>").ibxHTabGroup({ "name": name, position: "bottom" }, this.options.tabBarOptions);
				break;

			case "left":
				this.option("direction", "row");
				this._tabBar = $("<div>").ibxVTabGroup({ "name": name, position: "left" }, this.options.tabBarOptions);
				break;

			case "right":
				this.option("direction", "rowReverse");
				this._tabBar = $("<div>").ibxVTabGroup({ "name": name, position: "right" }, this.options.tabBarOptions);
				break;

		}

		this._tabBar.css("flex", "0 0 auto");
		this.element.prepend(this._tabBar);
	},
	_removeTabBar: function ()
	{
		this._tabBar.remove();
	},
	tabBar: function ()
	{
		return this._tabBar;
	},
	_onTabPaneKeyDown: function(e)
	{
		if(e.keyCode == $.ui.keyCode.ESCAPE)
			;
	},
	_onTabChange: function (e, button)
	{
		var tabButton = $(button);
		this.options.selected = tabButton.ibxWidget('option', 'tabPage');
		this._trigger("change", e, this.options.selected);
	},
	next: function ()
	{
		this._group.ibxRadioGroup("selectNext");
	},
	previous: function ()
	{
		this._group.ibxRadioGroup("selectPrevious")
	},
	selected: function (element)
	{
		if (this._group)
		{
			if (!element)
			{
				var button = this._group.ibxWidget('selected');
				if (button.length)
				{
					return button.ibxWidget('option', 'tabPage');
				}
				else
					return null;
			}
			else
				return this._group.ibxWidget('selected', element);

		}
		else
			return null;
	},
	_refresh: function ()
	{
		this._super();
		if (this._tabBar)
		{
			switch (this.options.position)
			{
				default:
				case "top":
				case "bottom":
					this._tabBar.ibxHTabGroup(this.options.tabBarOptions);
					break;
	
				case "left":
				case "right":
					this._tabBar.ibxVTabGroup(this.options.tabBarOptions);
					break;
				
			}
		}
	}
});
$.ibi.ibxTabPane.statics =
{
};

/******************************************************************************
	TAB PAGE WIDGETS
******************************************************************************/
$.widget("ibi.ibxTabPage", $.ibi.ibxWidget, 
{
	options:
	{
		focusRoot:false,
		selected: false,
		tabOptions:{},
		aria:{role:"tabpanel"}
	},
	_widgetClass:"ibx-tab-page",
	getValue: $.noop,
	_create: function ()
	{
		this._super();
		var options = this.options;

		//alternate to data-ibxp-text...direct text node children can be used to set the text.
		options.tabOptions.text = options.tabOptions.text || this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");

		this._tabButton = $("<div>").prop("tabIndex", -1).ibxTabButton();
		this._tabButton.ibxTabButton("option", "tabPage", this.element);
		this.element.on("focus", this._onPageFocus.bind(this)).on("keydown", this._onTabPageKeyEvent.bind(this));
		this.element.append(this._tabButton);

	},
	_setAccessible:function(accessible)
	{
		this._super(accessible);
	},
	_destroy:function()
	{
		this._super();
		this._tabButton.ibxTabButton("destroy").detach();
	},
	_setOptionDisabled:function(value)
	{
		if(this.options.disabled != !!value)
		{
			this._super(value);
			if(this._tabButton)
				this._tabButton.ibxTabButton("option", "disabled", value);
		}
	},
	button: function () { return this._tabButton; },
	_onPageFocus: function (e)
	{
	},
	_onTabPageKeyEvent:function(e)
	{
		e.stopPropagation();
	},
	checked: function (bChecked)
	{
		if (typeof (bChecked) == "undefined")
			return this.options.selected;
		else
			if (this.options.selected != bChecked)
			{
				this.options.selected = bChecked;
				this.refresh();
				this._tabButton.data('ibxWidget')._trigger("change");
			}
	},
	_refresh: function ()
	{
		this._super();
		this.options.tabOptions.checked = this.options.selected;
		this._tabButton.ibxTabButton(this.options.tabOptions);
	}
});
$.ibi.ibxTabPage.statics = 
{
};

/******************************************************************************
	TAB BUTTON
******************************************************************************/
$.widget("ibi.ibxTabButton", $.ibi.ibxRadioButton,
{
	options:
		{
			tabPage: null,
			aria:{role:"tab"}
		},
	_widgetClass: "ibx-tab-button",
	_create: function ()
	{
		this.element.attr('tabindex', -1);
		this._super();
	},
	_refresh: function ()
	{
		this._super();
		this.element.removeClass("ibx-button-group-member");
		var tabPage = this.options.tabPage || $();
		if (this.options.checked)
		{
			tabPage.removeClass("tpg-hidden").addClass("tpg-selected");
		}
		else
		{
			tabPage.addClass("tpg-hidden").removeClass("tpg-selected");
		}
	}
});

/******************************************************************************
	TAB GROUP
******************************************************************************/
$.widget("ibi.ibxHTabGroup", $.ibi.ibxHCarousel,
{
	options:
	{
		position: "top",
		aria:{role:"tablist"},
		hideDisabledButtons:true,
		showPageMarkers: false,
	},
	_widgetClass:"ibx-tab-group",
	_create: function ()
	{
		this._super();
		this.element.addClass("ibx-tab-group-horizontal");
	},
	_refresh: function ()
	{
		this._super();
		this.element.removeClass("ibx-tab-position-top ibx-tab-position-bottom");
		switch (this.options.position)
		{
			default:
			case "top":
				this.element.addClass("ibx-tab-position-top"); break;
			case "bottom":
				this.element.addClass("ibx-tab-position-bottom"); break;
		}
	}
});

$.widget("ibi.ibxVTabGroup", $.ibi.ibxVCarousel,
{
	options:
	{
		position: "left",
		aria:{role:"tablist"},
		hideDisabledButtons:true,
		showPageMarkers: false,
	},
	_widgetClass:"ibx-tab-group",
	_create: function ()
	{
		this._super();
		this.element.addClass("ibx-tab-group-vertical");
		this.element.attr("tabindex", 0);
	},
	_refresh: function ()
	{
		this._super();
		this.element.removeClass("ibx-tab-position-left ibx-tab-position-right");
		switch (this.options.position)
		{
			default:
			case "left":
				this.element.addClass("ibx-tab-position-left"); break;
			case "right":
				this.element.addClass("ibx-tab-position-right"); break;

		}
	}
});


//# sourceURL=tabs.ibx.js

