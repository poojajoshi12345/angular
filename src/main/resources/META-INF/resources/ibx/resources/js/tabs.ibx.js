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
		this.element.ibxMutationObserver(
		{
			listen: true,
			fnAddedNodes: this._onChildAdded.bind(this),
			fnRemovedNodes: this._onChildRemoved.bind(this),
			init: { childList: true }
		});
	},
	_destroy: function ()
	{
		this.element.ibxMutationObserver('destroy');
		this._removeTabBar();
		this._super();
	},
	_init: function ()
	{
		this._super();
		this.element.children(".ibx-tab-page").detach().appendTo(this.element);
	},
	_onChildAdded: function (node, mutation)
	{
		node = $(node);
		if (node.is(".ibx-tab-page"))
		{
			node.css("flex", "1 1 auto").addClass("tpg-hidden").on("keydown", this._onPageKeyDown.bind(this));
			var next = node.next('.ibx-tab-page');
			if (next.length > 0)
				next = next.ibxWidget('button');
			else
				next = null;
			this._tabBar.ibxTabGroup("addButton", node.ibxWidget('button'), next);
		}
		this.refresh();
	},
	_onChildRemoved: function (node, mutation)
	{
		node = $(node);
		if (node.is(".ibx-tab-page"))
			node.ibxWidget('button').css("flex", "").removeClass("tpg-hidden").detach();
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
			text:"Tab Button"
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
		debugger;
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
	},
	_create: function ()
	{
		this._super();
	},
	addButton: function (button, before)
	{
		this._super(button, before);
		var button = $(button);
		button.removeClass("ibx-button-group-member");
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

