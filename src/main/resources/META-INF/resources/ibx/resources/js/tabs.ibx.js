/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	TAB PANE WIDGETS
******************************************************************************/
$.widget("ibi.ibxTabPane", $.ibi.ibxFlexBox,
{
	options:
	{
		position: "top",
		direction: "column",
		align: "stretch",
		wrap: "false",
		selected: "",
		tabBarOptions:
		{
			justify: "flex-start",
		},
	},
	_widgetClass: "ibx-tab-pane",
	_tabBar: null,
	_create: function ()
	{
		this._super();
		this._createTabBar();
	},
	_destroy: function ()
	{
		this._removeTabBar();
		this._super();
	},
	_init: function ()
	{
		this._super();
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
			el.css("flex", "1 1 auto").addClass("tpg-hidden").on("keydown", this._onPageKeyDown.bind(this));
			var button = el.ibxWidget('button');
			var nextPage = el.next('.ibx-tab-page');
			if (nextPage.length > 0)
			{
				nextButton = nextPage.ibxWidget('button');
				if ($.contains(this._tabBar[0], nextButton[0]))
					button.insertBefore(nextButton);
				else
					this._tabBar.ibxWidget("add", button, null, null, true);
			}
			else
				this._tabBar.ibxWidget("add", button, null, null, true);
		}.bind(this));
		this.refresh();
	},
	remove:function(el, refresh)
	{
		el = $(el).filter(".ibx-tab-page");
		el.each(function(idx, el)
		{
			$(el).ibxWidget('button').css("flex", "").removeClass("tpg-hidden").detach();
		}.bind(this));
		this._super(el);
	},
	_setOption: function (key, value)
	{
		if (key == "position")
		{
			if (this._tabBar)
			{
				this._tabBar.ibxTabGroup("option", "direction", (value == "left" || value == "right") ? "column" : "row");
				this._tabBar.ibxTabGroup("option", "position", value);
			}
			switch (value)
			{
				default:
				case "top":
					this._super("direction", "column"); break;
				case "bottom":
					this._super("direction", "columnReverse"); break;
				case "left":
					this._super("direction", "row"); break;
				case "right":
					this._super("direction", "rowReverse"); break;
			}
		}
		this._super(key, value);
	},
	_createTabBar: function ()
	{
		switch (this.options.position)
		{
			default:
			case "top":
				this._setOption("direction", "column");
				this._tabBar = $("<div>").ibxTabGroup({ name: "" + this.widgetName + this.uuid, direction: "row", position: "top"}, this.options.tabBarOptions).css("flex", "0 0 auto");
				break;

			case "bottom":
				this._setOption("direction", "columnReverse");
				this._tabBar = $("<div>").ibxTabGroup({ name: "" + this.widgetName + this.uuid, direction: "row", position: "bottom" }, this.options.tabBarOptions).css("flex", "0 0 auto");
				break;

			case "left":
				this._setOption("direction", "row");
				this._tabBar = $("<div>").ibxTabGroup({ name: "" + this.widgetName + this.uuid, direction: "column", position: "left" }, this.options.tabBarOptions).css("flex", "0 0 auto");
				break;

			case "right":
				this._setOption("direction", "rowReverse");
				this._tabBar = $("<div>").ibxTabGroup({ name: "" + this.widgetName + this.uuid, direction: "column", position: "right" }, this.options.tabBarOptions).css("flex", "0 0 auto");
				break;

		}
		this._tabBar.on("ibx_change", this._onTabChange.bind(this));
		this.element.prepend(this._tabBar);
	},
	_removeTabBar: function ()
	{
		this._tabBar.remove();
	},
	_onPageKeyDown: function (e)
	{
		if (e.keyCode == 37 || e.keyCode == 38)
			this.previous();
		else
			if (e.keyCode == 39 || e.keyCode == 40)
				this.next();
	},
	_onTabChange: function (e, tabButton)
	{
		this.options.selected = $(tabButton).ibxWidget('option', 'tabPage');
		this._trigger("change", e, this.options.selected);
	},
	next: function ()
	{
		this._tabBar.ibxTabGroup("selectNext");
	},
	previous: function ()
	{
		this._tabBar.ibxTabGroup("selectPrevious");
	},
	refresh: function ()
	{
		this._super();
		if (this._tabBar)
			this._tabBar.ibxTabGroup(this.options.tabBarOptions);
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
		tabOptions:
		{
			text:""
		},

		optionsMap:
		{
			text:"tabOptions.text"
		}
	},
	_widgetClass:"ibx-tab-page",
	getValue: $.noop,
	_create: function ()
	{
		this._super();
		var options = this.options;

		//alternate to data-ibxp-text...direct text node children can be used to set the text.
		options.tabOptions.text = options.tabOptions.text || this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");

		this._tabButton = $("<div>").prop("tabIndex", 0).ibxTabButton();
		this._tabButton.ibxTabButton("option", "tabPage", this.element);
		this.element.on("focus", this._onPageFocus.bind(this));
		this.element.append(this._tabButton);

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
		this._tabButton.focus();
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
	refresh: function ()
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
		},
	_widgetClass: "ibx-tab-button",
	_create: function ()
	{
		if (!this.element.attr('tabindex'))
			this.element.attr('tabindex', 1);
		this._super();
	},
	refresh: function ()
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
$.widget("ibi.ibxTabGroup", $.ibi.ibxButtonGroup,
{
	options:
	{
		position: "top",
		groupSelection: true,
		wrap: true,
	},
	_create: function ()
	{
		this._super();
	},
	_fixFirstLast: function ()
	{
		// override base
	},
	refresh: function ()
	{
		this._super();
		this.element.removeClass("ibx-button-group-horizontal ibx-button-group-vertical ibx-tab-group-horizontal ibx-tab-group-vertical ibx-tab-position-top ibx-tab-position-bottom ibx-tab-position-left ibx-tab-position-right");
		this.element.addClass(this.options.direction == "row" ? "ibx-tab-group-horizontal" : "ibx-tab-group-vertical");
		switch (this.options.position)
		{
			default:
			case "top":
				this.element.addClass("ibx-tab-position-top"); break;
			case "bottom":
				this.element.addClass("ibx-tab-position-bottom"); break;
			case "left":
				this.element.addClass("ibx-tab-position-left"); break;
			case "right":
				this.element.addClass("ibx-tab-position-right"); break;

		}
	}
});

$.widget("ibi.ibxHTabGroup", $.ibi.ibxTabGroup, { options: { direction: "row", position: "top" } });
$.widget("ibi.ibxVTabGroup", $.ibi.ibxTabGroup, { options: { direction: "column", position: "left" } });


//# sourceURL=tabs.ibx.js

