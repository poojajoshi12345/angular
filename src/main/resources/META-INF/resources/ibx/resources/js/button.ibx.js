/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

//////////////////////////////////////////////////////////////////////////
$.widget("ibi.ibxButton", $.ibi.ibxLabel,
{
	options:
		{
			"iconPosition": "left",
		},
	_widgetClass: "ibx-button",
	_create: function ()
	{
		this._super();
		this.element.on("keydown", this._onKeyDown.bind(this));
	},
	_destroy: function ()
	{
		this._super();
	},
	checked: function (value)
	{
		// does nothing - used when in an ibxRadioGroup
		if (typeof (value) === "undefined")
			return false;
	},
	_onKeyDown: function (e)
	{
		if (e.keyCode === $.ui.keyCode.ENTER || e.keyCode === $.ui.keyCode.SPACE)
		{
			this.element.trigger('click');
			this.element.focus();
			e.stopPropagation();
		}
	},
	refresh: function ()
	{
		this._super();
	}
});

//just a simple button...essentially a label with some event handling.
$.widget("ibi.ibxButtonSimple", $.ibi.ibxButton,
{
	options:{},
	_widgetClass:"ibx-button-simple",
	_create:function()
	{
		this._super();
		this.element.removeClass("ibx-button");
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
			"forId": "",
			"userValue": "",
		},
	_widgetClass: "ibx-check-box",
	_create: function ()
	{
		this._super();
		this._check = $('<input type="checkbox" class="ibx-native-input"></input>');
		this.add(this._check, this.children()[0], true);
		this.element.on("click", this._onClick.bind(this));
		this.element.on("keydown", this._onKeyDown.bind(this));
		this.element.on("focus", this._onFocus.bind(this))
	},
	_init: function ()
	{
		this._super();
		this._trigger("set_form_value", null, { "elem": this.element, "value": this.options.checked ? this.options.userValue : "" });
	},
	userValue: function (value)
	{
		if (typeof (value) == "undefined")
			return this.options.userValue;
		else
		{
			this.options.userValue = value;
			this._trigger("set_form_value", null, { "elem": this.element, "value": this.options.checked ? this.options.userValue : "" });
			return this;
		}
	},
	_setOption: function (key, value)
	{
		if (key == "group")
		{
			if (this.options.group)
			{
				this.element.removeClass('ibx-radio-group-' + this.options.group);
				var group = $(".ibx-radio-group-control-" + this.options.group);
				if (group.length > 0)
					group.data("ibiIbxWidget").removeControl(this.element);
			}

			if (value)
			{
				this.element.addClass('ibx-radio-group-' + value);
				var group = $(".ibx-radio-group-control-" + value);
				if (group.length > 0)
					group.data("ibiIbxWidget").addControl(this.element);
			}
		}
		this._super(key, value);
	},
	_onKeyDown: function (e)
	{
		if (e.keyCode === $.ui.keyCode.ENTER || e.keyCode === $.ui.keyCode.SPACE)
		{
			this.element.trigger('click');
			this.element.focus();
			e.stopPropagation();
		}
	},
	_onClick: function (e)
	{
		if (this.options.disabled || this.options.group && this.options.checked)
			return;
		if (!this._trigger('beforechange', null, this.element))
			return;
		if (this.options.group)
			this.options.checked = true;
		else
			this.options.checked = !this.options.checked;
		this._trigger("set_form_value", null, { "elem": this.element, "value": this.options.checked ? this.options.userValue : "" });
		this.element.focus();
		this.refresh();
		this._trigger("change", null, this.element);
	},
	_onFocus: function (e)
	{
		this.element.find(".ibx-default-ctrl-focus").focus();
	},
	_destroy: function ()
	{
		this._super();
		this._check.remove();
	},
	checked: function (value)
	{
		if (typeof (value) == "undefined")
			return this.options.checked;
		else
			if(this.options.checked != value)
			{
				this.options.checked = value;
				this._trigger("set_form_value", null, { "elem": this.element, "value": this.options.userValue });
				this._trigger("change", null, this.element);
				this.refresh();
			}
		return this;
	},
	refresh: function ()
	{
		this._super();
		if (this.options.hideCheck)
			this._check.hide();
		else
			this._check.show();
		this._check.prop('checked', this.options.checked);
		if (this.options.hideCheck)
			this.element.addClass("hide-check");
		else
			this.element.removeClass("hide-check");
		if (this.options.checked)
			this.element.addClass("checked");
		else
			this.element.removeClass("checked");
		if (this.options.forId)
			this._check.attr("id", this.options.forId);
		else
			this._check.removeAttr("id");
		this._text.removeAttr("for");
		this._glyph.removeAttr("for");
		if (this.options.disabled)
			this._check.prop("disabled", true);
		else
			this._check.removeProp("disabled");
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
		this._marker = $("<div>");
		this._super();
		this.add(this._marker, this.children()[0], true);
	},
	_setOption: function (key, value)
	{
		if (key === "markerClass")
		{
			this._marker.removeClass(sformat("{1} {2}-check {3}-uncheck", this.options.markerClass, this.options.markerClass, this.options.markerClass));
			if (!value)
				value = "ibx-check-box-simple-marker";
		}
		return this._super(key, value);
	},
	refresh: function ()
	{
		this._super();

		if (this.options.showMarker)
			this._marker.show();
		else
			this._marker.hide();

		this.element.removeClass("ibx-check-box");
		this.element.toggleClass("checked", this.options.checked);

		this._marker.removeClass(sformat("{1} {2}-check {3}-uncheck", this.options.markerClass, this.options.markerClass, this.options.markerClass));
		this._marker.addClass(sformat((this.options.checked ? "{1} {2}-check" : "{1} {2}-uncheck"), this.options.markerClass, this.options.markerClass));
	}
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$.widget("ibi.ibxRadioButton", $.ibi.ibxCheckBox,
{
	options:
		{
		},
	_widgetClass: "ibx-radio-button",
	_create: function ()
	{
		this._super();
		this._check.attr('type', 'radio');
	},
	refresh: function ()
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
		this._marker = $("<div>");
		this._super();
		this.add(this._marker, this.children()[0], true);
	},
	_setOption: function (key, value)
	{
		if (key === "markerClass")
		{
			this._marker.removeClass(sformat("{1} {2}-check {3}-uncheck", this.options.markerClass, this.options.markerClass, this.options.markerClass));
			if (!value)
				value = "ibx-radio-button-simple-marker";
		}
		return this._super(key, value);
	},
	refresh: function ()
	{
		this._super();

		if (this.options.showMarker)
			this._marker.show();
		else
			this._marker.hide();

		this.element.removeClass("ibx-check-box ibx-radio-button");
		this.element.toggleClass("checked", this.options.checked);

		this._marker.removeClass(sformat("{1} {2}-check {3}-uncheck", this.options.markerClass, this.options.markerClass, this.options.markerClass));
		this._marker.addClass(sformat((this.options.checked ? "{1} {2}-check" : "{1} {2}-uncheck"), this.options.markerClass, this.options.markerClass));
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
		this._spacer = $('<div>').addClass(this.options.spacerElClass);
		this._switch = $('<div><div class="ibx-switch-slider round"></div></div>').addClass(this.options.switchElClass);
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
	refresh: function ()
	{
		this._super();
		this.element.removeClass("ibx-check-box");
		this._spacer.addClass(this.options.spacerElClass);
		this._switch.addClass(this.options.switchElClass);
	}
});

//////////////////////////////////////////////////////////////////////////
$.widget("ibi.ibxButtonGroup", $.ibi.ibxFlexBox,
{
	options:
		{
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
		this._onSelectedBound = this._onSelected.bind(this);
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
		this.element.on("keydown", this._onKeyDown.bind(this));
		this.add(this.element.children(".ibx-button, .ibx-check-box"));
		this._super();
	},
	children:function(selector)
	{
		return this._super(selector || ".ibx-button, .ibx-check-box");
	},
	add:function(el, sibling, before, refresh)
	{
		this._super(el, sibling, before, refresh);

		if(this._group)
		{
			el = $(el).filter(".ibx-button, .ibx-check-box");
			el.each(function(idx, el)
			{
				el = $(el);
				el.on("ibx_change", this._onSelectedBound)
				el.addClass("ibx-button-group-member");
				el.ibxWidget('option', 'group', this.options.name);
			}.bind(this));
			this.refresh();
		}
	},
	remove:function(el, refresh)
	{
		if(this._group)
		{
			el = $(el).filter(".ibx-button, .ibx-check-box");
			el.each(function(idx, el)
			{
				el = $(el);
				el.off("ibx_change", this._onSelectedBound)
				el.removeClass("ibx-button-group-member");
				this._group.ibxWidget('removeControl', el);
			}.bind(this));
			this.refresh();
		}

		this._super(el, refresh);
	},
	_createGroupSelection: function ()
	{
		if (this._group)
			return;

		this._group = $('<div>');
		this._group.hide();
		this.element.append(this._group);
		this._group.ibxRadioGroup({ name: this.options.name, form: this.options.form });

		this.element.children(".ibx-widget").not(this._group).each(function (idx, el)
		{
			el = $(el);
			el.on("ibx_change", this._onSelectedBound)
			el.addClass("ibx-button-group-member");
			el.ibxWidget('option', 'group', this.options.name);
		}.bind(this));
	},
	_removeGroupSelection: function ()
	{
		if (!this._group)
			return;

		this.element.children(".ibx-widget").not(this._group).each(function (idx, el)
		{
			el = $(el);
			el.off("ibx_change", this._onSelected.bind(this))
			el.removeClass("ibx-button-group-member");
			el.ibxWidget('option', 'group', "");
			this._group.ibxWidget('removeControl', el);
		}.bind(this));
		this._group.remove();
		this._group = null;
	},
	_onKeyDown: function (e)
	{
		switch (e.which)
		{
			case 37: //left
			case 38: //up
				if (e.target)
				{
					var prev = $(e.target).prev();
					if (prev)
						prev.focus();
				}
				break;

			case 39: //right
			case 40: //down
				if (e.target)
				{
					var next = $(e.target).next();
					if (next)
						next.focus();
				}
				break;

			default: return;
		}
		e.preventDefault();
	},
	_onSelectedBound: null,
	_onSelected: function (e)
	{
		this._trigger("selected", null, this.element);
	},
	selectNext: function ()
	{
		if (this._group)
			this._group.ibxWidget('selectNext');
	},
	selectPrevious: function ()
	{
		if (this._group)
			this._group.ibxWidget('selectPrevious');
	},
	selected: function (element)
	{
		if (this._group)
			return this._group.ibxWidget('selected', element);
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
		all.removeClass('ibx-button-group-first ibx-button-group-last');
		all.first().addClass("ibx-button-group-first");
		all.last().addClass("ibx-button-group-last");
	},
	refresh: function ()
	{
		this._super();
		this.options.groupSelection ? this._createGroupSelection() : this._removeGroupSelection();
		this.element.removeClass("ibx-button-group-horizontal ibx-button-group-vertical");
		this.element.addClass(this.options.direction == "row" ? "ibx-button-group-horizontal" : "ibx-button-group-vertical");
		this._fixFirstLast();
	}
});

$.widget("ibi.ibxHButtonGroup", $.ibi.ibxButtonGroup, { options: { direction: "row"} });
$.widget("ibi.ibxVButtonGroup", $.ibi.ibxButtonGroup, { options: { direction: "column" } });

$.widget("ibi.ibxSelectionButtonGroup", $.ibi.ibxButtonGroup, { options: { groupSelection: true } });
$.widget("ibi.ibxHSelectionButtonGroup", $.ibi.ibxSelectionButtonGroup, { options: { direction: "row" } });
$.widget("ibi.ibxVSelectionButtonGroup", $.ibi.ibxSelectionButtonGroup, { options: { direction: "column" } });

//# sourceURL=button.ibx.js
