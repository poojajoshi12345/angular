/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.77 $:

//////////////////////////////////////////////////////////////////////////
$.widget("ibi.ibxButton", $.ibi.ibxLabel,
{
	options:
	{
		"triggerCmdOnDblClick":false,
		"iconPosition": "left",
		"justify":"center",
		"aria":{"role":"button"}
	},
	_widgetClass: "ibx-button",
	_create: function ()
	{
		this._super();
		this.element.on("keydown keyup", this._onKeyEvent.bind(this)).on("click", this._onButtonClickEvent.bind(this));
	},
	_destroy: function ()
	{
		this._super();
	},
	_setAccessibility:function(accessible, aria)
	{
		this._super(accessible, aria);
		var options = this.options;
		//aria.label = options.aria.label || this.element.attr('title'); //default to title if no label.
		return aria;
	},
	_onButtonClickEvent:function(e)
	{
		if(ibxPlatformCheck.isIE || (!e.detail || e.detail === 1) || (e.detail === 2 && this.options.triggerCmdOnDblClick))
			this.doCommandAction("trigger");
	},
	_onKeyEvent: function (e)
	{
		if(e.type == "keydown")
		{
			if(e.keyCode === $.ui.keyCode.ENTER || e.keyCode === $.ui.keyCode.SPACE)
				this.element.ibxAddClass("ibx-button-active");
		}
		else
		if(e.type == "keyup")
		{
			if(e.keyCode === $.ui.keyCode.ENTER || e.keyCode === $.ui.keyCode.SPACE)
			{
				//[IBX-81] without this, then keydown to activate a navKeyRoot was autofocusing a button and the keyup was trigger click.
				//clearly this is wrong and should only happen if the button got the keydown first.
				var isActive = this.element.hasClass("ibx-button-active");
				if(isActive)
					this.element.trigger("click");
				this.element.ibxRemoveClass("ibx-button-active");
			}
		}
		this.setAccessibility();
	},
	_refresh: function ()
	{
		this._super();
	}
});

//just a simple button...essentially a label with some event handling.
$.widget("ibi.ibxButtonSimple", $.ibi.ibxButton,
{
	options:
	{
		styleAsButton: false
	},
	_widgetClass:"ibx-button-simple",
	_refresh: function() {
		this._super();
		this.element.ibxToggleClass('ibx-button', this.options.styleAsButton);
	}
});

//just a simple button for invoking the standard file browser dialog.
$.widget("ibi.ibxButtonBrowse", $.ibi.ibxButton,
{
	options:
	{
		"multiple":false,
		"accept":""
	},
	_widgetClass:"ibx-button-browse",
	_create:function()
	{
		this._super();
		this._btnBrowse = $("<input type='file'/>").on("change", this._onBrowseBtnChange.bind(this));
		this.element.on("click", this._onBrowseBtnClick.bind(this));
	},
	_onBrowseBtnClick:function(e)
	{
		this._btnBrowse.prop("value", "");
		this._btnBrowse.click();
	},
	_onBrowseBtnChange:function(e)
	{
		e.files = this.files();
		this._trigger("change", e);
	},
	files:function()
	{
		var files = this._btnBrowse.prop("files");
		return this.options.multiple ?  files : files[0];
	},
	_refresh:function()
	{
		this._super();
		this._btnBrowse.prop("accept", this.options.accept);
		this.options.multiple ? this._btnBrowse.attr("multiple", "true") : this._btnBrowse.removeAttr("multiple");
	}
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$.widget("ibi.ibxCheckBox", $.ibi.ibxLabel,
{
	options:
		{
			"checked": false,
			"hideCheck": true,
			"group": "",
			"aria":
			{
				"role":"checkbox",
			}
		},
	_widgetClass: "ibx-check-box",
	_create: function ()
	{
		this._check = $("<input type='checkbox' class='ibx-native-input'></input>");
		this.add(this._check, this.children()[0], true);
		this.element.on("click", this._onClick.bind(this));
		this.element.on("keyup", this._onKeyEvent.bind(this)).ibxAddClass("ibx-can-toggle");
		this._super();
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		aria.checked = this.options.checked;
		return aria;
	},
	_destroy:function()
	{
		$.ibi.ibxRadioGroup.removeControl(this.options.group, this.element[0]);
		this._check.remove();
		this._super();
	},
	_init: function ()
	{
		this._super();
	},
	userValue: function (value)
	{
		return this._super(value);
	},
	_onKeyEvent: function (e)
	{
		if(e.keyCode === $.ui.keyCode.ENTER || e.keyCode === $.ui.keyCode.SPACE)
			this.element.trigger('click');
	},
	_onClick: function (e)
	{
		if (this.options.disabled || this.options.group && this.options.checked)
			return;
		this.checked((this.options.group) ? true : !this.options.checked);
		this.doCommandAction("trigger");
	},
	checked: function (value)
	{
		if (typeof (value) == "undefined")
			return this.options.checked;
		this.option("checked", value);
		return this;
	},
	_setOption: function (key, value)
	{
		var changed = this.options[key] != value;
		if(key == "checked" && changed)
		{
			if (!this._trigger("beforechange"))
				return;
			this._super(key, value);
			this._trigger("change");
			this.doCommandAction("checked", value);
		}
		else
		if(key == "group")
		{
			if(this.options.group != value)
				$.ibi.ibxRadioGroup.removeControl(this.options.group, this.element[0]);
			this._super(key, value);
			if(value)
				$.ibi.ibxRadioGroup.addControl(value, this.element[0]);
		}
		else
			this._super(key, value);
	},
	_refresh: function ()
	{
		this._super();
		if (this.options.hideCheck)
			this._check.hide();
		else
			this._check.show();
		this.element.ibxToggleClass("hide-check", this.options.hideCheck);

		this._check.prop('checked', this.options.checked);
		this.element.ibxToggleClass("checked", this.options.checked);

		(this.options.disabled) ? this._check.prop("disabled", true) : this._check.removeProp("disabled");

		this._text.removeAttr("for");
		this._glyph.removeAttr("for");
	}
});
$.widget("ibi.ibxCheckBoxSimple", $.ibi.ibxCheckBox,
{
	options:
	{
		showMarker: true,
		markerClass: "ibx-check-box-simple-marker",
	},
	_widgetClass: "ibx-check-box-simple",
	_create: function ()
	{
		this._marker = $("<div>").appendTo(this.element);
		this._super();
	},
	_setOption: function (key, value)
	{
		if (key === "markerClass")
		{
			this._marker.ibxRemoveClass(sformat("{1} {2}-check {3}-uncheck", this.options.markerClass, this.options.markerClass, this.options.markerClass));
			if (!value)
				value = "ibx-check-box-simple-marker";
		}
		return this._super(key, value);
	},
	_refresh: function ()
	{
		this._super();
		if (this.options.showMarker)
			this._marker.show();
		else
			this._marker.hide();

		this.element.ibxRemoveClass("ibx-check-box");
		this._marker.ibxRemoveClass(sformat("{1} {2}-check {3}-uncheck", this.options.markerClass, this.options.markerClass, this.options.markerClass));
		this._marker.ibxAddClass(sformat((this.options.checked ? "{1} {2}-check" : "{1} {2}-uncheck"), this.options.markerClass, this.options.markerClass));
	}
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$.widget("ibi.ibxRadioButton", $.ibi.ibxCheckBox,
{
	options:
	{
		"aria":{"role":"radio"}
	},
	_widgetClass: "ibx-radio-button",
	_create: function ()
	{
		this._super();
		this._check.attr('type', 'radio');
	},
	_refresh: function ()
	{
		this._super();
	}
});

$.widget("ibi.ibxRadioButtonSimple", $.ibi.ibxRadioButton,
{
	options:
	{
		showMarker: true,
		markerClass: "ibx-radio-button-simple-marker",
	},
	_widgetClass: "ibx-radio-button-simple",
	_create: function ()
	{
		this._marker = $("<div>").appendTo(this.element);
		this._super();
	},
	_setOption: function (key, value)
	{
		if (key === "markerClass")
		{
			this._marker.ibxRemoveClass(sformat("{1} {2}-check {3}-uncheck", this.options.markerClass, this.options.markerClass, this.options.markerClass));
			if (!value)
				value = "ibx-radio-button-simple-marker";
		}
		return this._super(key, value);
	},
	_refresh: function ()
	{
		this._super();

		if (this.options.showMarker)
			this._marker.show();
		else
			this._marker.hide();

		this.element.ibxRemoveClass("ibx-check-box ibx-radio-button");
		this.element.ibxToggleClass("checked", this.options.checked);

		this._marker.ibxRemoveClass(sformat("{1} {2}-check {3}-uncheck", this.options.markerClass, this.options.markerClass, this.options.markerClass));
		this._marker.ibxAddClass(sformat((this.options.checked ? "{1} {2}-check" : "{1} {2}-uncheck"), this.options.markerClass, this.options.markerClass));
	}
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$.widget("ibi.ibxSwitch", $.ibi.ibxCheckBox,
{
	options:
		{
			"switchPosition": "left",
			"spacerElClass": "ibx-switch-spacer",
			"switchElClass": "ibx-switch-ctrl",
		},
	_widgetClass: "ibx-switch",
	_create: function ()
	{
		this._spacer = $("<div>").ibxAddClass(this.options.spacerElClass);
		this._switch = $("<div><div class='ibx-switch-slider round'></div></div>").ibxAddClass(this.options.switchElClass);
		this._super();
		this.add(this._spacer, this.children()[0], true);
		this.add(this._switch, this.children()[0], true);
	},
	_destroy: function ()
	{
		this._super();
		this._spacer.remove();
		this._switch.remove();
	},
	_refresh: function ()
	{
		this._super();
		this.element.ibxRemoveClass("ibx-check-box");
		this._spacer.ibxAddClass(this.options.spacerElClass);
		this._switch.ibxAddClass(this.options.switchElClass);
	}
});

//////////////////////////////////////////////////////////////////////////
$.widget("ibi.ibxButtonGroup", $.ibi.ibxFlexBox,
{
	options:
	{
		role: "group",
		navKeyRoot:true,
		focusDefault:true,

		name: "",
		form: "",
		align: "stretch",
		wrap: false,
		groupSelection: false,
	},
	_widgetClass: "ibx-button-group",
	_group: null,
	_create: function ()
	{
		this._onGroupChangeBound = this._onGroupChange.bind(this);
		this._super();
	},
	_init: function ()
	{
		if (!this.options.name)
		{
			var id = this.element.attr("id");
			if (!id)
				this.element.uniqueId();
			this.options.name = this.element.attr("id");
		}
		var btns = this.element.children(".ibx-button, .ibx-check-box, .ibx-check-box-simple, .ibx-radio-button-simple").prop("tabindex", -1);
		this.add(btns);
		this._super();
	},
	children:function(selector)
	{
		return this._super(selector || ".ibx-button, .ibx-check-box, .ibx-check-box-simple, .ibx-radio-button-simple");
	},
	add:function(el, sibling, before, refresh)
	{
		this._super(el, sibling, before, refresh);

		if(this._group)
		{
			el = $(el).filter(".ibx-button, .ibx-check-box, .ibx-check-box-simple, .ibx-radio-button-simple");
			el.each(function(idx, el)
			{
				el = $(el);
				el.ibxAddClass("ibx-button-group-member");
				el.ibxWidget("option", "group", this._group.ibxWidget("option", "name"));
				this._group.ibxWidget("addControl", el[0]);
			}.bind(this));
			this.refresh();
		}
	},
	remove:function(el, destroy, refresh)
	{
		if(this._group)
		{
			el = $(el).filter(".ibx-button, .ibx-check-box, .ibx-check-box-simple, .ibx-radio-button-simple");
			el.each(function(idx, el)
			{
				el = $(el);
				el.ibxRemoveClass("ibx-button-group-member");
				this._group.ibxWidget("removeControl", el[0]);
			}.bind(this));
			this.refresh();
		}

		this._super(el, destroy, refresh);
	},
	_createGroupSelection: function ()
	{
		if (this._group)
			return;

		this._group = $('<div>');
		this._group.hide();
		this.element.append(this._group);
		this._group.ibxRadioGroup({ name: this.options.name, form: this.options.form });
		this._group.on('ibx_change', this._onGroupChangeBound.bind(this));
		this.add(this.element.children(".ibx-widget").not(this._group));
	},
	_removeGroupSelection: function ()
	{
		if (!this._group)
			return;

		this.remove(this.element.children(".ibx-widget").not(this._group));
		this._group.off('ibx_change', this._onGroupChangeBound.bind(this));
		this._group.remove();
		this._group = null;
	},
	_onGroupChangeBound: null,
	_onGroupChange: function (e, data)
	{
		this._trigger("change", null, data);
	},	
	selectNext: function ()
	{
		if (this._group)
			this._group.ibxWidget("selectNext");
	},
	selectPrevious: function ()
	{
		if (this._group)
			this._group.ibxWidget("selectPrevious");
	},
	selected: function (element)
	{
		if (this._group)
			return this._group.ibxWidget("selected", element);
		else
			return null;
	},
	group: function ()
	{
		return this._group;
	},
	_fixFirstLast: function ()
	{
		var all = this.element.children(".ibx-widget:not(:displayNone)").not(this._group);
		all.ibxRemoveClass("ibx-button-group-first ibx-button-group-last");
		all.first().ibxAddClass("ibx-button-group-first");
		all.last().ibxAddClass("ibx-button-group-last");
	},
	_refresh: function ()
	{
		this._super();
		this.options.groupSelection ? this._createGroupSelection() : this._removeGroupSelection();
		this.element.ibxRemoveClass("ibx-button-group-horizontal ibx-button-group-vertical");
		this.element.ibxAddClass(this.options.direction == "row" ? "ibx-button-group-horizontal" : "ibx-button-group-vertical");
		this._fixFirstLast();
	}
});

$.widget("ibi.ibxHButtonGroup", $.ibi.ibxButtonGroup, { options: { direction: "row"} });
$.widget("ibi.ibxVButtonGroup", $.ibi.ibxButtonGroup, { options: { direction: "column" } });

$.widget("ibi.ibxSelectionButtonGroup", $.ibi.ibxButtonGroup, { options: { groupSelection: true } });
$.widget("ibi.ibxHSelectionButtonGroup", $.ibi.ibxSelectionButtonGroup, { options: { direction: "row" } });
$.widget("ibi.ibxVSelectionButtonGroup", $.ibi.ibxSelectionButtonGroup, { options: { direction: "column" } });

//# sourceURL=button.ibx.js
