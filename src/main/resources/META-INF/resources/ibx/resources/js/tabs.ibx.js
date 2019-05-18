/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.53 $:

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
		wrap: false,
		inline:true,
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
			el.ibxAddClass("tpg-hidden").on("keydown", this._onTabPaneKeyDown.bind(this));
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
			button.ibxWidget("option", "group", this._group.ibxWidget("option", "name")); //this will add button to radioGroup
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
			button.css("flex", "").ibxRemoveClass("tpg-hidden").detach();
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
		var curSel = this.options.selected;
		var tabButton = $(e.target).ibxWidget("selected");
		var selected = tabButton.ibxWidget("option", "tabPage");
		selected.ibxWidget("option", "selected", true);
		this.element.children(".ibx-tab-page").not(selected).ibxWidget("option", "selected", false).not(selected).ibxAddClass("tpg-hidden").ibxRemoveClass("tpg-selected");
		selected.ibxRemoveClass("tpg-hidden").ibxAddClass("tpg-selected");
		this.options.selected = selected;
		selected.dispatchEvent("ibx_selected", null, true, false, curSel[0]);
		this._trigger("change", e, selected);
		this._tabBar.ibxWidget("scrollTo", tabButton);
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
			{
				var button = $(pages[index]).ibxWidget("button");
				this._group.ibxWidget("selected", button);
				this._tabBar.ibxWidget("scrollTo", button);
			}
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
			{
				var button = element.ibxWidget("button");
				this._group.ibxWidget("selected", button);
				this._tabBar.ibxWidget("scrollTo", button);
			}
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
		tabOptions:
		{
		},
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
		options.tabOptions.tabPage = this.element;		
		this._tabButton = $("<div class='ibx-tab-button'>").prop("tabIndex", -1).ibxTabButton(options.tabOptions);
		this.element.append(this._tabButton).attr({tabindex:0});
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		this._tabButton.ibxWidget("setAccessibility");
		return aria;
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
		this._tabButton.ibxWidget("option", this.options.tabOptions).attr("title", this.options.tabOptions.title);
		this._super();
	}
});
$.ibi.ibxTabPage.statics = 
{
};

/******************************************************************************
	TAB BUTTON...just a radio button with some accessibility overrides.
******************************************************************************/
$.widget("ibi.ibxTabButton", $.ibi.ibxRadioButton,
{
	options:
	{
		tabPage:null,
		aria:{role:"tab"}
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		delete aria.checked;

		var tabPage = this.options.tabPage;
		var pageOptions = tabPage.ibxWidget("option");
		aria.expanded = pageOptions.expanded;
		aria.controls = tabPage.prop("id");
		aria.owns = aria.controls;
		aria.selected = pageOptions.selected;
		return aria;
	},
});

/******************************************************************************
	TAB GROUP
******************************************************************************/
$.widget("ibi.ibxHTabGroup", $.ibi.ibxHCarousel,
{
	options:
	{
		position: "top",
		hideDisabledButtons:true,
		showPageMarkers: false,
		aria:
		{
			role:null,
			label:null,
		}
	},
	_widgetClass:"ibx-tab-group",
	_create: function ()
	{
		this._super();
		this.element.ibxAddClass("ibx-tab-group-horizontal").prop("tabindex", -1);
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		this._itemsBox.ibxWidget("setAccessibility", undefined, {"role":"tablist", "label":""});
		//this._itemsBox.ibxWidget("option", "aria", {"role":"tablist", "label":""});
		return aria;
	},
	_refresh: function ()
	{
		this._super();
		this.element.ibxRemoveClass("ibx-tab-position-top ibx-tab-position-bottom");
		switch (this.options.position)
		{
			default:
			case "top":
				this.element.ibxAddClass("ibx-tab-position-top"); break;
			case "bottom":
				this.element.ibxAddClass("ibx-tab-position-bottom"); break;
		}
	}
});

$.widget("ibi.ibxVTabGroup", $.ibi.ibxVCarousel,
{
	options:
	{
		position: "left",
		hideDisabledButtons:true,
		showPageMarkers: false,
		aria:
		{
			role:"null",
			label:null,
		}
	},
	_widgetClass:"ibx-tab-group",
	_create: function ()
	{
		this._super();
		this.element.ibxAddClass("ibx-tab-group-vertical").prop("tabindex", -1);
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		this._itemsBox.ibxWidget("option", "aria", {"role":"tablist", "label":null});
		return aria;
	},
	_refresh: function ()
	{
		this._super();
		this.element.ibxRemoveClass("ibx-tab-position-left ibx-tab-position-right");
		switch (this.options.position)
		{
			default:
			case "left":
				this.element.ibxAddClass("ibx-tab-position-left"); break;
			case "right":
				this.element.ibxAddClass("ibx-tab-position-right"); break;

		}
	}
});


//# sourceURL=tabs.ibx.js

