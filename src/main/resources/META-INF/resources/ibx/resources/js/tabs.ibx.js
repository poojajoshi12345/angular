/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	TAB PANE WIDGETS
******************************************************************************/
function IbxTabPane()
{
	if (_biInPrototype) return;
	IbxFlexBox.call(this);
	this._widgetCtor = $.ibi.ibxTabPane;
}
_p = _biExtend(IbxTabPane, IbxFlexBox, "IbxTabPane");
IbxTabPane.base = IbxFlexBox.prototype;
IbxWidget.addWidgetProperty(IbxTabPane, "position");
IbxWidget.addWidgetProperty(IbxTabPane, "tabBar");
IbxWidget.addWidgetProperty(IbxTabPane, "tabBarOptions");
IbxWidget.addWidgetProperty(IbxTabPane, "selected");
IbxWidget.addWidgetFunction(IbxTabPane, "next");
IbxWidget.addWidgetFunction(IbxTabPane, "previous");
IbxWidget.addWidgetMember(IbxTabPane, "_tabBar", "_tabBar", IbxTabGroup);
IbxWidget.addWidgetEvent(IbxTabPane, "change");

_p.getTabBar = function () { return this._tabBar; };

_p.add = function (oChild, oBefore, bAnonymous)
{
	IbxTabPane.base.add.call(this, oChild, oBefore, bAnonymous);
	if (this._widget)
		this._widget.addPage(oChild._element);
};

_p.remove = function (oChild)
{
	IbxTabPane.base.remove.call(this, oChild);
	if (this._widget)
		this._widget.removePage(oChild._element);
};

_p.removeAll = function ()
{
	IbxTabPane.base.removeAll.call(this);
	if (this._widget)
		this._widget.removeAll();
};

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
		this.element.children(".ibx-tab-page").each(function(idx, el)
		{
			this.addPage(el);
		}.bind(this));
	},
	_destroy: function ()
	{
		this._super();
		this._removeTabBar();
		this.removeAll();
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
	addPage: function (page)
	{
		page = $(page)
		page.css("flex", "1 1 auto").addClass("tpg-hidden").on("keydown", this._onPageKeyDown.bind(this));
		this.element.append(page);
		this._tabBar.ibxTabGroup("addButton", page.data('ibxWidget')._tabButton);
	},
	removePage: function (page)
	{
		page = (typeof (page) == "number") ? this.element.children(":nth-child(" + page + ")") : $(page);
		page.data('ibxWidget')._tabButton.css("flex", "").removeClass("tpg-hidden").detach();
		page.detach();
	},
	removeAll: function ()
	{
		this.element.children(".ibx-tab-page").each(function (idx, el)
		{
			this.removePage(el);
		}.bind(this));
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
function IbxTabPage()
{
	if (_biInPrototype) return;
		IbxWidget.call(this);
	this._widgetCtor = $.ibi.ibxTabPage;
}
_p = _biExtend(IbxTabPage, IbxWidget, "IbxTabPage");
IbxTabPage.base = IbxWidget.prototype;
IbxWidget.addWidgetProperty(IbxTabPage, "tabOptions");
IbxWidget.addWidgetProperty(IbxTabPage,"tabButton");
IbxWidget.addWidgetProperty(IbxTabPage, "selected");
IbxWidget.addWidgetMember(IbxTabPage, "_tabButton", "_tabButton", IbxTabButton);

_p.getTabButton = function(){return this._tabButton;};

$.widget("ibi.ibxTabPage", $.ibi.ibxWidget, 
{
	options:
	{
		focusRoot:false,
		selected: false,
		tabOptions:
		{
			text:"Tab Button"
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
function IbxTabButton()
{
	if (_biInPrototype) return;
	IbxRadioButton.call(this);
	this._widgetCtor = $.ibi.ibxTabButton;
}
var _p = _biExtend(IbxTabButton, IbxRadioButton, "IbxTabButton");
IbxTabButton.base = IbxRadioButton.prototype;


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
function IbxTabGroup()
{
	if (_biInPrototype) return;
	IbxButtonGroup.call(this);
	this._widgetCtor = $.ibi.ibxTabGroup;
}
var _p = _biExtend(IbxTabGroup, IbxButtonGroup, "IbxTabGroup");
IbxTabGroup.base = IbxButtonGroup.prototype;
IbxWidget.addWidgetProperty(IbxTabGroup, "position");

function IbxHTabGroup()
{
	if (_biInPrototype) return;
	IbxTabGroup.call(this);
	this._widgetCtor = $.ibi.ibxHTabGroup;
}
var _p = _biExtend(IbxHTabGroup, IbxTabGroup, "IbxHTabGroup");
IbxHTabGroup.base = IbxTabGroup.prototype;

function IbxVTabGroup()
{
	if (_biInPrototype) return;
	IbxTabGroup.call(this);
	this._widgetCtor = $.ibi.ibxVTabGroup;
}
var _p = _biExtend(IbxVTabGroup, IbxTabGroup, "IbxVTabGroup");
IbxVTabGroup.base = IbxTabGroup.prototype;

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
	addButton: function (button)
	{
		this._super(button);
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

