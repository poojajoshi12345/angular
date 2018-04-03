/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxRadioGroup",$.ibi.ibxFlexBox,
{
	options:
		{
			"inline": true,
			"navKeyRoot": true,
			"focusDefault": true,
			"name": "",
			"form": "",
			"aria": { "role": "radiogroup" }
		},
	_widgetClass: "ibx-radio-group",
	_onChangeBind: null,
	_onBeforeChangeBind: null,
	_create: function()
	{
		this._controls = [];
		this._onChangeBind = this._onChange.bind(this);
		this._onBeforeChangeBind = this._onBeforeChange.bind(this);
		this.options.name = this.options.name || ("autoGroupName" + $.ibi.ibxRadioGroup.uniqueName++);
		this._super();
	},
	_setAccessibility: function(accessible,aria)
	{
		aria=this._super(accessible,aria);
		var btnIds="";
		$(this._controls).each(function(members, idx, el)
		{
			btnIds+=" "+el.id;
		}.bind(this,btnIds));
		aria.controls=btnIds;
		return aria;
	},
	_destroy: function()
	{
		$(this._controls).each(function(idx, el)
		{
			this.removeControl(el);
		}.bind(this));
		this._super();
	},
	_init: function()
	{
		this._super();

		//add all the precreated controls that want to be a member of this group...then replace them with this.
		var options = this.options;
		var grps = $.ibi.ibxRadioGroup.grps;
		var grp = grps[options.name];
		if(grp instanceof Array)
			this.addControl(grp);
		grps[options.name] = this.element[0];

		this.add(this.element.children(".ibx-can-toggle").detach());//add children to this group.
	},
	_onBeforeChange: function(e,el)
	{
		if(!$(e.currentTarget).ibxWidget('checked'))
		{
			if(!this._trigger('beforechange',null,el))
				e.preventDefault();
		}
	},
	_onChange: function(e)
	{
		if(!this._bInUpdating)
		{
			this._bInUpdating=true;
			if($(e.currentTarget).ibxWidget('checked'))
				this._setSelected(e.currentTarget);
			this._bInUpdating=false;
		}
	},
	_getItemUserValue: function(el)
	{
		el = $(el);
		if(el.is(":ibxWidget"))
			return el.ibxWidget("userValue");
		else
			return null;
	},
	add: function(el, elSibling, before, refresh)
	{
		this._super(el,elSibling,before,refresh);
		$(el).each(function(idx, el)
		{
			el = $(el)
			if(!el.attr("tabIndex"))
				el.attr("tabIndex",-1);
			this.addControl(el);
		}.bind(this));
	},
	remove: function(el,destroy,refresh)
	{
		this.removeControl(el);
		this._super(el,destroy,refresh);
	},
	_controls:null,
	controls: function()
	{
		return this._controls.slice(0);
	},
	hasControl: function(element)
	{
		return (this._controls.indexOf(element)!=-1)
	},
	addControl: function(el)
	{
		var el=$(el);
		el.each(function(index, el)
		{
			//add to internal controls if not already part of group.
			if(this.hasControl(el))
				return;
			this._controls.push(el);

			var ctrl = $(el).on("ibx_change", this._onChangeBind).on('ibx_beforechange', this._onBeforeChangeBind).data("ibxWidget");
			ctrl.option("group", this.options.name);

			//all items must have user values...if not set by user, then we create one.
			var value=this._getItemUserValue(el);
			if(!value)
			{
				value = "autoUserValue" + $.ibi.ibxRadioGroup.uniqueUserVal++;
				ctrl.option("userValue", value);
			}
			
			var checked = ctrl.checked();
			if(checked || this.options.userValue == value)
				this._setSelected(el);
		}.bind(this));
		this.refresh();
	},
	removeControl: function(el)
	{
		if(this.hasControl(el))
		{
			this._controls.splice(this._controls.indexOf(el), 1);
			
			el = $(el);
			el.removeClass("radio-group-checked" + this.options.name);
			el.off("ibx_change", null, this._onChangeBind).off('ibx_beforechange', null, this._onBeforeChange);
			this.refresh();
		}
	},
	_setSelected: function(el)
	{
		var val = this._getItemUserValue(el);
		this.userValue(val);
	},
	selected: function(el)
	{
		el = $(el);
		if(!el.length)
			return $(this._controls).filter(".radio-group-checked");
		else
		{
			//YOU WERE FIGURING OUT HOW TO SET THE USER VALUE TO NULL AND DESELECT ALL ITEMS.
			el.ibxWidget("checked", true);
			return this;
		}
	},
	_setOptionDisabled: function(value)
	{
		$(this._controls).ibxWidget('option', 'disabled', value);
	},
	_setOption: function(key,value)
	{
		if(this._settingOption)
			return;
		this._settingOption = true;

		var changed = this.options[key] != value;
		this._super(key,value);

		if(key == "userValue")
		{
			$(this._controls).each(function(value, index, el)
			{
				el = $(el);
				el.removeClass('radio-group-checked').ibxWidget('checked',false)
				var itemUserValue = this._getItemUserValue(el);
				if(itemUserValue == value)
					el.ibxWidget('checked', true).addClass('radio-group-checked');
			}.bind(this, value));

			this.element.dispatchEvent("ibx_change", null, false);
			this.doCommandAction("uservalue", value);
		}

		this._settingOption = false;
	},
	_refresh: function()
	{
		var options = this.options;
		(!this.element.children(".ibx-can-toggle").length) ? this.element.css("display","none") : this.element.css("display","");
		this._super();
	}
});
$.ibi.ibxRadioGroup.uniqueName = 0;
$.ibi.ibxRadioGroup.uniqueUserVal = 0;
$.ibi.ibxRadioGroup.grps={};
$.ibi.ibxRadioGroup.addControl=function(grpName, ctrl)
{
	var grp = this.grps[grpName];
	if(!grp)
		grp = this.grps[grpName] = [];

	if(grp instanceof Array)
		grp.push(ctrl);
	else
	if(grp)
		$(grp).ibxRadioGroup("addControl", ctrl)
}
$.ibi.ibxRadioGroup.removeControl=function(grpName, ctrl)
{
	var grp = this.grps[grpName];
	if(grp)
		$(grp).ibxRadioGroup("removeControl", ctrl)
}

$.widget("ibi.ibxHRadioGroup",$.ibi.ibxRadioGroup,{ options: { direction: "row" } });
$.widget("ibi.ibxVRadioGroup",$.ibi.ibxRadioGroup,{ options: { direction: "column" } });

//# sourceURL=radiogroup.ibx.js

