/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxRadioGroup", $.ibi.ibxFlexBox,
{
	options:
		{
			"inline":true,
			"navKeyRoot":true,
			"navKeyAutoFocus":true,
			"name": "",
			"form": "",
			"userValue": "",
			"aria":{"role":"radiogroup"}
		},
	_widgetClass: "ibx-radio-group",
	_onChangeBind: null,
	_onBeforeChangeBind: null,
	_create: function ()
	{
		this._onChangeBind = this._onChange.bind(this);
		this._onBeforeChangeBind = this._onBeforeChange.bind(this);
		this._super();
		this._formControl = $("<div>").ibxFormControl({name: this.options.name, form: this.options.form});
		this.element.append(this._formControl);
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		var btnIds = "";
		$(".ibx-radio-group-" + this.options.name).each(function(members, idx, el)
		{
			btnIds += " " + el.id;	
		}.bind(this, btnIds));
		aria.controls = btnIds;
		return aria;
	},
	_destroy:function()
	{
		this._super();
	},
	_init:function()
	{
		this._super();
		this.add(this.element.children(".ibx-can-toggle").detach());//add children to this group.
		this.addControl(".ibx-radio-group-" + this.options.name);//any buttons specified for this group.
	},
	_onBeforeChange: function (e, el)
	{
		if (!$(e.currentTarget).ibxWidget('checked'))
		{
			if (!this._trigger('beforechange', null, el))
				e.preventDefault();
		}
	},
	_onChange: function (e)
	{
		if(!this._bInUpdating)
		{
			this._bInUpdating = true;
			if ($(e.currentTarget).ibxWidget('checked'))
				this._setSelected(e.currentTarget);
			this._bInUpdating = false;
		}
	},
	_getItemUserValue: function (el)
	{
		if ($(el).data('ibxWidget') && $(el).data('ibxWidget').userValue)
			return $(el).data('ibxWidget').userValue();
		else
			return "";
	},
	userValue: function (value)
	{
		if (typeof (value) == "undefined")
			return this._getItemUserValue($(".radio-group-checked.ibx-radio-group-" + this.options.name));
		else
		{
			$(".ibx-radio-group-" + this.options.name).each(function (index, el)
			{
				var itemUserValue = this._getItemUserValue(el);
				if (itemUserValue == value)
				{
					$(el).ibxWidget('checked', true);
					return true;
				}
			}.bind(this));
			return this;
		}
	},
	add:function(el, elSibling, before, refresh)
	{
		$(el).each(function(idx, el)
		{
			el = $(el)
			if(!el.attr("tabIndex"))
				el.attr("tabIndex", -1);
			this.addControl(el);
		}.bind(this));
		this._super(el, elSibling, before, refresh);
	},
	remove:function(el, destroy, refresh)
	{
		this.removeControl(el);
		this._super(el, destroy, refresh);
	},
	addControl: function (element)
	{
		var el = $(element);
		el.addClass("ibx-radio-group-" + this.options.name);
		el.on("ibx_change", null, null, this._onChangeBind).on('ibx_beforechange', null, null, this._onBeforeChangeBind);
		el.each(function (index, el)
		{
			var _el = $(el);
			var checked = _el.ibxWidget('checked');
			var elUserValue = this._getItemUserValue(_el);
			if (checked || this.options.userValue && this.options.userValue == elUserValue)
			{
				this._setSelected(el);
				return true;
			}
		}.bind(this));
		this.refresh();
	},
	removeControl: function (element)
	{
		$(element).removeClass("radio-group-checked ibx-radio-group-" + this.options.name);
		$(element).off("ibx_change", null, this._onChangeBind).off('ibx_beforechange', null, this._onBeforeChange);
		this.refresh();
	},
	selectNext: function ()
	{
		this._selectSibling(true);
	},
	selectPrevious: function ()
	{
		this._selectSibling(false);
	},
	_selectSibling: function (next)
	{
		if (this.element.hasClass("ibx-widget-disabled"))
			return;
		var current = $(".radio-group-checked.ibx-radio-group-" + this.options.name);
		var all = $(".ibx-radio-group-" + this.options.name);
		if (current.length == 0)
		{
			if (all.length > 0)
			{
				$(all[0]).ibxWidget('checked', true);
				this._setSelected(all[0]);
			}
			return;
		}

		$(all).ibxWidget('checked', false);

		for (var i = 0; i < all.length; i++)
		{
			if (current[0] == all[i])
			{
				if (next && i < all.length - 1)
				{
					$(all[i + 1]).ibxWidget('checked', true);
					this._setSelected(all[i + 1]);
				}
				else if (!next && i > 0)
				{
					$(all[i - 1]).ibxWidget('checked', true);
					this._setSelected(all[i - 1]);
				}
				else
				{
					$(current).ibxWidget('checked', true);
					this._setSelected(current[0]);
				}
				break;
			}
		}
	},
	_setSelected: function (el)
	{
		var el = $(el);
		if (el.length > 0)
		{
			$(".ibx-radio-group-" + this.options.name).not(el).removeClass('radio-group-checked').ibxWidget('checked', false);
			el.addClass('radio-group-checked');
			this._trigger("set_form_value", null, { "elem": el, "value": this._getItemUserValue(el) });
			this._trigger("change", null, el);
		}
	},
	selected: function (element)
	{
		if (this.element.hasClass("ibx-widget-disabled"))
			return this;
		if (typeof (element) == "undefined")
		{
			return $(".checked.ibx-radio-group-" + this.options.name);
		}
		else
		{
			$(element).ibxWidget("checked", true);
			this._setSelected(element);
			return this;
		}
	},
	_setOptionDisabled: function (value)
	{
		var disabled = !!value;
		$(".ibx-radio-group-" + this.options.name).ibxWidget('option', 'disabled', disabled);
	},
	_refresh: function ()
	{
		this.element.addClass('ibx-radio-group-control-' + this.options.name);
		(!this.element.children(":not(.ibx-form-control)").length) ? this.element.css("display", "none") : this.element.css("display", "");
		this._super();
	}
});
$.widget("ibi.ibxHRadioGroup", $.ibi.ibxRadioGroup, {options:{direction:"row"}});
$.widget("ibi.ibxVRadioGroup", $.ibi.ibxRadioGroup, {options:{direction:"column"}});

//# sourceURL=radiogroup.ibx.js

