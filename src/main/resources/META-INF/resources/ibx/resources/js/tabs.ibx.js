/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	TAB PANE WIDGETS
******************************************************************************/
$.widget("ibi.ibxTabPane", $.ibi.ibxFlexBox,
{
	options:
	{
		focusDefault:true,
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
			el.addClass("tpg-hidden").on("keydown", this._onTabPaneKeyDown.bind(this));
			var button = el.ibxWidget("button");
			var nextPage = el.next(".ibx-tab-page");
			if (nextPage.length > 0)
			{
				nextButton = nextPage.ibxWidget("button");
				if ($.contains(this._tabBar[0], nextButton[0]))
					this._tabBar.ibxWidget("add", button, nextButton, true, true);
				else
					this._tabBar.ibxWidget("add", button, null, null, true);
			}
			else
				this._tabBar.ibxWidget("add", button, null, null, true);
			button.ibxWidget("option", "group", this._group.ibxWidget("option", "name"));
			this._group.ibxRadioGroup("addControl", button[0]);
		}.bind(this));
		this.refresh();
	},
	remove:function(el, destroy, refresh)
	{
		var selIndex = this.selectedIndex();
		var el = this.children().filter(el);
		el.each(function(idx, el)
		{
			var button = $(el).ibxWidget("button");
			button.css("flex", "").removeClass("tpg-hidden").detach();
			button.ibxWidget("option", "group", "");
			this._group.ibxRadioGroup("removeControl", button[0]);
		}.bind(this));
		this._super(el, destroy, refresh);

		// If selected node was removed, select next / previous page, if available
		var newSelIndex = this.selectedIndex();
		if (newSelIndex < 0)
		{
			var pages = this.element.children(".ibx-tab-page");
			if (pages.length > 0 && selIndex >= 0)
			{
				selIndex = Math.max(0, Math.min(selIndex, pages.length -1));
				this.selectedIndex(selIndex);
			}
		}
	},
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
	_onTabChange: function (e)
	{
		var tabButton = $(e.target).ibxWidget("selected");
		var selected = tabButton.ibxWidget("option", "tabPage");
		this.element.children(".ibx-tab-page").not(selected).addClass("tpg-hidden").removeClass("tpg-selected");
		selected.removeClass("tpg-hidden").addClass("tpg-selected");
		this.options.selected = selected;
		this._trigger("change", e, selected);
	},
	userValue:function(value)
	{
		return this._group.ibxWidget("userValue", value);
	},
	selectedIndex: function (index)
	{
		if (index === undefined)
		{
			var button = this._group.ibxWidget("selected");
			if (button.length)
				return this.element.children(".ibx-tab-page").index(button.ibxWidget("option", "tabPage"));
			else
				return -1;
		}
		else
		{
			var pages = this.element.children(".ibx-tab-page");
			if (index >= 0 && index < pages.length)
				this._group.ibxWidget("selected", $(pages[index]).ibxWidget("button"));
			return this.element;
		}
	},
	selected: function (element)
	{
		if (element === undefined)
		{
			var button = this._group.ibxWidget("selected");
			if (button.length)
			{
				return button.ibxWidget("option", "tabPage");
			}
			else
				return null;
		}
		else
		{
			element = $(element);
			if (element.length > 0 && element.hasClass("ibx-tab-page"))
				this._group.ibxWidget("selected", element.ibxWidget("button"));
			return this.element;
		}
	},
	_setOption: function (key, value)
	{
		this._super(key, value);
		if(key == "selected")
		{
			if (this.options.selected)
				this.selected(this.options.selected);
		}
		else if (key == "userValue")
		{		
			if (this.options.userValue)
				this.userValue(this.options.userValue);
		}
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
		this._tabButton = $("<div class='ibx-tab-button'>").prop("tabIndex", -1).ibxRadioButton({"tabPage": this.element, "aria":{"role":"tab"}});
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
		this._tabButton.ibxWidget("destroy").detach();
	},
	_setOptionDisabled:function(value)
	{
		if(this.options.disabled != !!value)
		{
			this._super(value);
			if(this._tabButton)
				this._tabButton.ibxWidget("option", "disabled", value);
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
	selected: function (value)
	{
		if (value === undefined)
		{
			return this._tabButton.ibxWidget("checked");
		}
		else
		{
			if (!value)
				throw("Parameter cannot be false");
			this._tabButton.ibxWidget("option", "checked", true);
			return this.element;
		}
	},
	_setOption: function (key, value)
	{
		this._super(key, value);
		if(key == "selected")
		{
			if (this.options.selected)
				this.selected(this.options.selected);
		}
		else if (key == "userValue")
		{		
			if (this.options.userValue)
				this._tabButton.ibxWidget("userValue", this.options.userValue);
		}
	},
	_refresh: function ()
	{
		this._super();
		this._tabButton.ibxWidget("option", this.options.tabOptions);
	}
});
$.ibi.ibxTabPage.statics = 
{
};

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
		this.element.addClass("ibx-tab-group-horizontal").prop("tabindex", -1);
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
		this.element.addClass("ibx-tab-group-vertical").prop("tabindex", -1);
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

