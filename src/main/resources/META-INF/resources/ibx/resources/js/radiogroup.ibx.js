/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxRadioGroup", $.ibi.ibxWidget,
{
	options:
		{
			name: "",
			form: "",
			userValue: "",
		},
	_widgetClass: "ibx-radio-group",
	_onChangeBind: null,
	_create: function ()
	{
		this._onChangeBind = this._onChange.bind(this);
		this._super();
		this.element.hide();
		this._formControl = $("<div>").ibxFormControl({name: this.options.name, form: this.options.form});
		this.element.append(this._formControl);
		this.addControl($(".ibx-radio-group-" + this.options.name));
	},
	_destroy: function ()
	{
		this._super();
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
			return this._getItemUserValue($(".checked.ibx-radio-group-" + this.options.name));
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
	addControl: function (element)
	{
		var el = $(element);
		el.addClass("ibx-radio-group-" + this.options.name);
		el.on("ibx_change", null, null, this._onChangeBind);
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
	},
	removeControl: function (element)
	{
		$(element).removeClass("radio-group-checked ibx-radio-group-" + this.options.name);
		$(element).off("ibx_change", null, this._onChangeBind);
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
		$(".ibx-radio-group-" + this.options.name).not(el).removeClass('radio-group-checked').ibxWidget('checked', false);
		el.addClass('radio-group-checked');
		this._trigger("change", null, this.element);
		this._trigger("set_form_value", null, { "elem": el, "value": this._getItemUserValue(el) });
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
	refresh: function ()
	{
		this.element.addClass('ibx-radio-group-control-' + this.options.name);
		this._super();
	}
});
//# sourceURL=radiogroup.ibx.js

