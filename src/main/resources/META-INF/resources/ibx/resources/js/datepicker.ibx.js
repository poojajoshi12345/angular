/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxDatePicker", $.ibi.ibxVBox,
{
	options:
		{
			"type": "popup", // valid values: "popup", "simple", "inline"
			"dateFormat": "mm/dd/yy",
			"wrap": "false",
			"align": "stretch",
		},
	_widgetClass: "ibx-datepicker",
	_create: function ()
	{
		this._super();
		this._input = $('<input class="ibx-default-ctrl-focus ibx-datepicker-input"></input>').on("focus", this._showPopup.bind(this)).on('click', this._showPopup.bind(this));
		this._inputWrapper = $('<div>').ibxHBox().addClass('ibx-datepicker-input-wrapper');
		this._inputWrapper.append(this._input);
		this._dateWrapper = $('<div>').ibxFlexBox();
		this._datePicker = $('<div>').datepicker({ 'altField': this._input[0], 'onSelect': this._onSelect.bind(this) });
		this._dateWrapper.append(this._datePicker).addClass('ibx-datepicker-date-wrapper');
		this.element.append(this._inputWrapper, this._dateWrapper);
		this._popup = $('<div>').ibxPopup({'destroyOnClose': false});
	},
	_init: function ()
	{
		this._super();
	},
	_destroy: function ()
	{
		this._super();
	},
	date: function (value)
	{
		if (typeof (value) == "undefined")
			return $.datepicker.formatDate(this.options.dateFormat, this._datePicker.datepicker('getDate'));
		else
		{
			this._datePicker.datepicker('setDate', value);
			return this;
		}
	},
	_onSelect: function (dateText, inst)
	{
		switch (this.options.type)
		{
			case 'popup':
				this._popup.ibxWidget('close');
				break;
			default:
				break;
		}
		var value = $.datepicker.formatDate(this.options.dateFormat, this._datePicker.datepicker('getDate'));
		this._trigger("change", null, { 'date': value });
		this._trigger("set_form_value", null, {"elem": this.element, "value": $.datepicker.formatDate(this.options.dateFormat, this._datePicker.datepicker('getDate'))});
	},
	_showPopup: function ()
	{
		switch (this.options.type)
		{
			case 'popup':
				if (!this._popup.ibxWidget('isOpen'))
					this._popup.ibxWidget('open');
				break;
			default:
				break;
		}
	},
	refresh: function ()
	{
		this.element.removeClass('popup simple inline');
		this._datePicker.datepicker('option', 'dateFormat', this.options.dateFormat);
		this._super();
		this._popup.ibxWidget('close');
		switch (this.options.type)
		{
			default:
			case 'popup':
				this.element.addClass('popup');
				this._input.show();
				this._popup.ibxWidget('option', 'position', { "my": "left top", "at": "left bottom+5px", "of": this._input, "collision": "fit" });
				this._popup.append(this._dateWrapper);
				break;
			case 'simple':
				this.element.addClass('simple');
				this._input.show();
				this.element.append(this._dateWrapper);
				break;
			case 'inline':
				this.element.addClass('inline');
				this._input.hide();
				this.element.append(this._dateWrapper);
				break;
		}
	}
});

$.widget("ibi.ibxDatePickerSimple", $.ibi.ibxDatePicker, { options: { type: "simple" } });
$.widget("ibi.ibxDatePickerInline", $.ibi.ibxDatePicker, { options: { type: "inline" } });

$.widget("ibi.ibxDateRange", $.ibi.ibxDatePicker,
{
	options:
	{
	},
	_create: function ()
	{
		this._super();
		this._input2 = $('<input class="ibx-default-ctrl-focus ibx-datepicker-input"></input>').on("focus", this._showPopup.bind(this)).on('click', this._showPopup.bind(this));
		this._inputWrapper.append(this._input2);
		this._datePicker.addClass('from');
		this._datePicker2 = $('<div>').datepicker({ 'altField': this._input2[0], 'onSelect': this._onSelect.bind(this) });
		this._dateWrapper.append(this._datePicker2);
	},
	_onSelect: function (dateText, inst)
	{
		var from = inst.input[0] == this._datePicker[0];
		var valueFrom = $.datepicker.formatDate(this.options.dateFormat, this._datePicker.datepicker('getDate'));
		var valueTo = $.datepicker.formatDate(this.options.dateFormat, this._datePicker2.datepicker('getDate'));
		this._trigger("change", null, { 'isFrom': from, 'dateFrom': valueFrom, 'dateTo': valueTo});
		this._trigger("set_form_value", null, { "elem": this.element, "value": "[" + valueFrom + "," + valueTo + "]"});
	},
	dateFrom: function (value)
	{
		if (typeof (value) == "undefined")
			return $.datepicker.formatDate(this.options.dateFormat, this._datePicker.datepicker('getDate'));
		else
		{
			this._datePicker.datepicker('setDate', value);
			return this;
		}
	},
	dateTo: function (value)
	{
		if (typeof (value) == "undefined")
			return $.datepicker.formatDate(this.options.dateFormat, this._datePicker2.datepicker('getDate'));
		else
		{
			this._datePicker2.datepicker('setDate', value);
			return this;
		}
	},
	refresh: function ()
	{
		this._datePicker2.datepicker('option', 'dateFormat', this.options.dateFormat);
		this._super();
		switch (this.options.type)
		{
			default:
			case 'popup':
				this._input2.show();
				break;
			case 'simple':
				this._input2.show();
				break;
			case 'inline':
				this._input2.hide();
				break;
		}
	}
});

$.widget("ibi.ibxDateRangeSimple", $.ibi.ibxDateRange, { options: { type: "simple" } });
$.widget("ibi.ibxDateRangeInline", $.ibi.ibxDateRange, { options: { type: "inline" } });


//# sourceURL=datepicker.ibx.js
