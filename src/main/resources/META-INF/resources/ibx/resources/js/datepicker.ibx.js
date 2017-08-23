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
			"date": $.datepicker.formatDate("mm/dd/yy", new Date()),
		},
	_widgetClass: "ibx-datepicker",
	_create: function ()
	{
		this._super();
		this._input = $('<div class="ibx-default-ctrl-focus ibx-datepicker-input">').ibxLabel({glyphClasses:"fa fa-calendar", 'align': 'stretch'}).on("focus", this._showPopup.bind(this)).on('click', this._showPopup.bind(this));
		this._inputWrapper = $('<div>').ibxHBox().addClass('ibx-datepicker-input-wrapper');
		this._inputWrapper.append(this._input);
		this._dateWrapper = $('<div>').ibxFlexBox({ 'wrap': false });
		this._datePicker = $('<div>').datepicker({'onSelect': this._onSelect.bind(this), numberOfMonths: 1 });
		this._dateWrapper.append(this._datePicker).addClass('ibx-datepicker-date-wrapper');
		this.element.append(this._inputWrapper, this._dateWrapper);
		this._popup = $('<div class="ibx-datepicker-popup">').ibxPopup({'destroyOnClose': false});
	},
	_init: function ()
	{
		this._super();
	},
	_destroy: function ()
	{
		this._super();
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
		this.options.date = value;
		this._trigger("change", null, { 'date': value });
		this._trigger("set_form_value", null, { "elem": this.element, "value": value });
		this._input.ibxWidget('option', 'text', this.options.date);
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
	_refresh: function ()
	{
		this.element.removeClass('popup simple inline');
		this._datePicker.datepicker('option', 'dateFormat', this.options.dateFormat);
		this._datePicker.datepicker('setDate', this.options.date);
		this._input.ibxWidget('option', 'text', this.options.date);
		this._super();
		this._popup.ibxWidget('close');
		switch (this.options.type)
		{
			default:
			case 'popup':
				this.element.addClass('popup');
				this._inputWrapper.show();
				this._popup.ibxWidget('option', 'position', { "my": "left top", "at": "left bottom+5px", "of": this._input, "collision": "fit" });
				this._popup.append(this._dateWrapper);
				break;
			case 'simple':
				this.element.addClass('simple');
				this._inputWrapper.show();
				this.element.append(this._dateWrapper);
				break;
			case 'inline':
				this.element.addClass('inline');
				this._inputWrapper.hide();
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
		"dateTo": $.datepicker.formatDate("mm/dd/yy", new Date()),
		"dateFrom": $.datepicker.formatDate("mm/dd/yy", new Date()),
	},
	_create: function ()
	{
		this._super();
		this._input2 = $('<div class="ibx-default-ctrl-focus ibx-datepicker-input">').ibxLabel({ glyphClasses: "fa fa-calendar", 'align': 'stretch' }).on("focus", this._showPopup.bind(this)).on('click', this._showPopup.bind(this));
		this._inputWrapper.append(this._input2);
		this._datePicker.datepicker('option', 'numberOfMonths', 2);
		this._datePicker.datepicker('option', 'onChangeMonthYear', this._onChangeMonthYear.bind(this));
		this._input.ibxWidget('option', 'text', this.options.dateFrom);
		this._input2.ibxWidget('option', 'text', this.options.dateTo);
		window.setTimeout(function () { this._highlightRange(); }.bind(this), 10);
	},
	_onChangeMonthYear: function (year, month, inst)
	{
		window.setTimeout(function () { this._highlightRange(); }.bind(this), 10);
	},
	_onSelect: function (dateText, inst)
	{
		//var value = $.datepicker.formatDate(this.options.dateFormat, this._datePicker.datepicker('getDate'));
		var value = this._datePicker.datepicker('getDate');
		var v = value.getTime();
		var to;
		var from;
		var parseFrom = $.datepicker.parseDate(this.options.dateFormat, this.options.dateFrom);
		if (!parseFrom)
			from = (new Date()).getTime();
		else
			from = parseFrom.getTime();

		var parseTo = $.datepicker.parseDate(this.options.dateFormat, this.options.dateTo);
		if (!parseTo)
			to = (new Date()).getTime();
		else
			to = parseTo.getTime();

		if (v < from)
		{
			// extend from
			this.options.dateFrom = $.datepicker.formatDate(this.options.dateFormat, value);
		}
		else if (v > to)
		{
			// extend to
			this.options.dateTo = $.datepicker.formatDate(this.options.dateFormat, value);
		}
		else
		{
			// set both to current
			this.options.dateTo = this.options.dateFrom = $.datepicker.formatDate(this.options.dateFormat, value);
		}

		this._trigger("change", null, { 'dateFrom': this.options.dateFrom, 'dateTo': this.options.dateTo});
		this._trigger("set_form_value", null, { "elem": this.element, "value": "['" + this.options.dateFrom + "','" + this.options.dateTo + "']" });
		this._input.ibxWidget('option', 'text', this.options.dateFrom);
		this._input2.ibxWidget('option', 'text', this.options.dateTo);
		window.setTimeout(function () { this._highlightRange(); }.bind(this), 10);
	},
	_highlightRange: function ()
	{
		var parseFrom = $.datepicker.parseDate(this.options.dateFormat, this.options.dateFrom);
		var parseTo = $.datepicker.parseDate(this.options.dateFormat, this.options.dateTo);
		if (!parseFrom || !parseTo)
			return;

		var dateFrom = parseFrom.getTime();
		var dateTo = parseTo.getTime();

		this._datePicker.find('td[data-handler="selectDay"]').each(function (index, el)
		{
			var el = $(el);
			var month = parseInt(el.attr('data-month'),10);
			var year = parseInt(el.attr('data-year'),10);
			var day = parseInt(el.children('a').text(), 10);

			var current = (new Date(year, month, day)).getTime();
			if (current >= dateFrom && current <= dateTo)
				el.attr('data-range', "true");
			else
				el.attr('data-range', "");
			if (current == dateFrom)
				el.attr('data-range-from', "true");
			else
				el.attr('data-range-from', '');
			if (current == dateTo)
				el.attr('data-range-to', "true");
			else
				el.attr('data-range-to', '');
		});
	},
	_refresh: function ()
	{
		this._super();
		this._datePicker.datepicker('setDate', this.options.dateTo);
		this._input.ibxWidget('option', 'text', this.options.dateFrom);
		this._input2.ibxWidget('option', 'text', this.options.dateTo);
		window.setTimeout(function () { this._highlightRange(); }.bind(this), 10);
	}
});

$.widget("ibi.ibxDateRangeSimple", $.ibi.ibxDateRange, { options: { type: "simple" } });
$.widget("ibi.ibxDateRangeInline", $.ibi.ibxDateRange, { options: { type: "inline" } });


//# sourceURL=datepicker.ibx.js
