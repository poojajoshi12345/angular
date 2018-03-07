/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxRadioGroup", $.ibi.ibxFlexBox,
{
	options:
		{
			"inline":true,
			"navKeyRoot":true,
			"focusDefault":true,
			"name": "",
			"form": "",
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
		if(typeof(value) == "undefined")
			return this._getItemUserValue($(".radio-group-checked.ibx-radio-group-" + this.options.name));
		this._super(value);
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
			el = $(el);

			//all items must have user values...if not set by user, then we create one.
			var value = this._getItemUserValue(el);
			if(!value)
			{
				value =  "autoUserValue" + $.ibi.ibxRadioGroup.uniqueUserVal++;
				el.ibxWidget("option", "userValue", value).attr("data-autouservalue", value);
			}

			var checked = el.ibxWidget('checked');
			if (checked || this.options.userValue && this.options.userValue == value)
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
		var val = this._getItemUserValue(el);
		this.option("userValue", val);
		this._trigger("change", null, el);
	},
	selected: function (element)
	{
		element = $(element);
		if(this.element.hasClass("ibx-widget-disabled"))
			return this;
		if(!element.length)
			return $(".checked.ibx-radio-group-" + this.options.name);
		else
		{
			//YOU WERE FIGURING OUT HOW TO SET THE USER VALUE TO NULL AND DESELECT ALL ITEMS.
			element.ibxWidget("checked", true);
			this._setSelected(element);
			return this;
		}
	},
	_setOptionDisabled: function (value)
	{
		var disabled = !!value;
		$(".ibx-radio-group-" + this.options.name).ibxWidget('option', 'disabled', disabled);
	},
	_setOption:function(key, value)
	{
		var changed = this.options[key] != value;
		this._super(key, value);

		if(key == "userValue" && changed)
		{
			$(".ibx-radio-group-" + this.options.name).removeClass('radio-group-checked').ibxWidget('checked', false).each(function (value, index, el)
			{
				var itemUserValue = this._getItemUserValue(el);
				if (itemUserValue == value)
				{
					$(el).ibxWidget('checked', true).addClass('radio-group-checked');
					return true;
				}
			}.bind(this, value));
			this.doCommandAction("uservalue", value);
		}
	},
	_refresh: function ()
	{
		this.element.addClass('ibx-radio-group-control-' + this.options.name);
		(!this.element.children(":not(.ibx-form-control)").length) ? this.element.css("display", "none") : this.element.css("display", "");
		this._super();
	}
});
$.ibi.ibxRadioGroup.uniqueUserVal = 0;
$.widget("ibi.ibxHRadioGroup", $.ibi.ibxRadioGroup, {options:{direction:"row"}});
$.widget("ibi.ibxVRadioGroup", $.ibi.ibxRadioGroup, {options:{direction:"column"}});

//# sourceURL=radiogroup.ibx.js

