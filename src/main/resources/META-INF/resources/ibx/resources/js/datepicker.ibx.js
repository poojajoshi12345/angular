/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxDatePicker", $.ibi.ibxVBox,
{
	options:
		{
			"type": "popup", // valid values: "popup", "simple", "inline"
			"dateFormat": '', // used as internal formatting
			"outDateFormat": '', // used to format what's shown in the associated label
			"wrap": "false",
			"align": "stretch",
			"showClear": false,
			"pickerClasses": '',
			"date": '',
			"numberOfMonths": 1,
			"initDate": true, // set date to the current date
	},
	_widgetClass: "ibx-datepicker",
	_create: function ()
	{
		this.options.dateFormat = $.ibi.ibxDatePicker.statics.defaultDateFormat;
		this.options.outDateFormat = $.ibi.ibxDatePicker.statics.defaultOutDateFormat;
		if (this.options.initDate)
			this.options.date = $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
		this._super();
		this.element.on("focus", this._showPopup.bind(this));
		this._input = $('<div class="ibx-datepicker-input">').ibxLabel({glyphClasses:"fa fa-calendar", 'align': 'stretch'}).on('click', this._showPopup.bind(this));
		this._clear = $('<div class="ibx-datepicker-clear">').ibxButtonSimple({glyphClasses:"fa fa-times"}).on('click', this._onClear.bind(this)).hide();
		this._inputWrapper = $('<div>').ibxHBox({align: 'center'}).addClass('ibx-datepicker-input-wrapper');
		this._inputWrapper.append(this._input, this._clear);
		this._dateWrapper = $('<div>').ibxFlexBox({ 'wrap': false });
		this._datePicker = $('<div>').datepicker({
			"closeText" : ibx.resourceMgr.getString("IBX_DP_CLOSE_TEXT"),
			"prevText" : ibx.resourceMgr.getString("IBX_DP_PREV_TEXT"),
			"nextText" : ibx.resourceMgr.getString("IBX_DP_NEXT_TEXT"),
			"currentText" : ibx.resourceMgr.getString("IBX_DP_CUR_TEXT"),
			"weekHeader" : ibx.resourceMgr.getString("IBX_DP_WEEK_HEADER"),
			"monthNames" : (eval(ibx.resourceMgr.getString("IBX_DP_MONTHS"))),
			"monthNamesShort" : (eval(ibx.resourceMgr.getString("IBX_DP_MONTHS_SHORT"))),
			"dayNames" : (eval(ibx.resourceMgr.getString("IBX_DP_DAYS"))),
			"dayNamesShort" : (eval(ibx.resourceMgr.getString("IBX_DP_DAYS_SHORT"))),
			"dayNamesMin" : (eval(ibx.resourceMgr.getString("IBX_DP_DAYS_MIN"))),
			"buttonText" : ibx.resourceMgr.getString("IBX_DP_BUTTON_TEXT"),
			"onSelect": this._onSelect.bind(this),
		});
		this._pickerOptions = {
			"closeText" : ibx.resourceMgr.getString("IBX_DP_CLOSE_TEXT"),
			"prevText" : ibx.resourceMgr.getString("IBX_DP_PREV_TEXT"),
			"nextText" : ibx.resourceMgr.getString("IBX_DP_NEXT_TEXT"),
			"currentText" : ibx.resourceMgr.getString("IBX_DP_CUR_TEXT"),
			"weekHeader" : ibx.resourceMgr.getString("IBX_DP_WEEK_HEADER"),
			"monthNames" : (eval(ibx.resourceMgr.getString("IBX_DP_MONTHS"))),
			"monthNamesShort" : (eval(ibx.resourceMgr.getString("IBX_DP_MONTHS_SHORT"))),
			"dayNames" : (eval(ibx.resourceMgr.getString("IBX_DP_DAYS"))),
			"dayNamesShort" : (eval(ibx.resourceMgr.getString("IBX_DP_DAYS_SHORT"))),
			"dayNamesMin" : (eval(ibx.resourceMgr.getString("IBX_DP_DAYS_MIN"))),
			"buttonText" : ibx.resourceMgr.getString("IBX_DP_BUTTON_TEXT")};
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
	_onClear: function ()
	{
		this.options.date = '';
		this._datePicker.datepicker('setDate', '');
		this._input.ibxWidget('option', 'text', '');
		this._trigger("change", null, { 'date': '' });
		this._trigger("set_form_value", null, { "elem": this.element, "value": '' });
	},
	_onSelect: function (dateText, inst)
	{
		switch (this.options.type)
		{
			case 'popup':
				if (this._popup.ibxWidget('isOpen'))
					this._popup.ibxWidget('close');
				break;
			default:
				break;
		}
		var value = $.datepicker.formatDate(this.options.dateFormat, this._datePicker.datepicker('getDate'));
		this.options.date = value;
		this._trigger("change", null, { 'date': value });
		this._trigger("set_form_value", null, { "elem": this.element, "value": value });
		this._input.ibxWidget('option', 'text', $.datepicker.formatDate(this.options.outDateFormat, this._datePicker.datepicker('getDate'), this._pickerOptions));
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
		if (this.options.showClear)
			this._clear.show();
		else
			this._clear.hide();
		if (this.options.pickerClasses)
			this._popup.addClass(this.options.pickerClasses);
		this._datePicker.datepicker('option', this.options);
		this._datePicker.datepicker('setDate', new Date(this.options.date));
		this._input.ibxWidget('option', 'text', $.datepicker.formatDate(this.options.outDateFormat, this._datePicker.datepicker('getDate'), this._pickerOptions));
		this._super();
		if (this._popup.ibxWidget('isOpen'))
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

$.ibi.ibxDatePicker.statics =
{
	defaultDateFormat: "MM d, yy",
	defaultOutDateFormat: "M d, yy",
};


$.widget("ibi.ibxDatePickerSimple", $.ibi.ibxDatePicker, { options: { type: "simple" } });
$.widget("ibi.ibxDatePickerInline", $.ibi.ibxDatePicker, { options: { type: "inline" } });

$.widget("ibi.ibxDateRange", $.ibi.ibxDatePicker,
{
	options:
	{
		"dateTo": '',
		"dateFrom": '',
		"numberOfMonths": 2,
		"singleInput": false,
	},
	_create: function ()
	{
		if (this.options.initDate)
		{
			this.options.dateTo = $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
			this.options.dateFrom = $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
		}
		this._super();

		this._input2 = $('<div class="ibx-datepicker-input">').ibxLabel({ glyphClasses: "fa fa-calendar", 'align': 'stretch' }).on('click', this._showPopup.bind(this));
		this._clear2 = $('<div class="ibx-datepicker-clear">').ibxButtonSimple({glyphClasses:"fa fa-times"}).on('click', this._onClear2.bind(this)).hide();
		this._inputWrapper.append(this._input2, this._clear2);
		this._datePicker.datepicker('option', 'onChangeMonthYear', this._onChangeMonthYear.bind(this));
		window.setTimeout(function () { this._highlightRange(); }.bind(this), 10);
	},
	_init: function ()
	{
		this._super();
		if (this.options.singleInput)
		{
			this._input2.remove();
			this._clear2.remove();
		}
	},
	_onChangeMonthYear: function (year, month, inst)
	{
		window.setTimeout(function () { this._highlightRange(); }.bind(this), 10);
	},
	_onClear: function ()
	{
		this.options.dateFrom  = '';
		if (this.options.singleInput)
			this.options.dateTo = '';
		this._datePicker.datepicker('setDate', '');
		this._trigger("change", null, { 'dateFrom': '', 'dateTo': this.options.dateTo});
		this._trigger("set_form_value", null, { "elem": this.element, "value": "['" + '' + "','" + this.options.dateTo + "']" });
		this._input.ibxWidget('option', 'text', '');
	},
	_onClear2: function ()
	{
		this.options.dateTo  = '';
		this._datePicker.datepicker('setDate', '');
		this._trigger("change", null, { 'dateFrom': this.options.dateFrom, 'dateTo': ''});
		this._trigger("set_form_value", null, { "elem": this.element, "value": "['" + this.options.dateFrom + "','" + '' + "']" });
		this._input2.ibxWidget('option', 'text', '');
	},
	_onSelect: function (dateText, inst)
	{
		//var value = $.datepicker.formatDate(this.options.dateFormat, this._datePicker.datepicker('getDate'));
		var value = this._datePicker.datepicker('getDate');
		var v = value.getTime();

		var from;
		var parseFrom = $.datepicker.parseDate(this.options.dateFormat, this.options.dateFrom);
		if (!parseFrom)
			from = (new Date()).getTime();
		else
			from = parseFrom.getTime();

		var to;
		var parseTo = $.datepicker.parseDate(this.options.dateFormat, this.options.dateTo);
		if (!parseTo)
			to = (new Date()).getTime();
		else
			to = parseTo.getTime();

		if (v < from)
		{
			// extend from
			this.options.dateFrom = $.datepicker.formatDate(this.options.dateFormat, value);
			from = value;
		}
		else if (v > to)
		{
			// extend to
			this.options.dateTo = $.datepicker.formatDate(this.options.dateFormat, value);
			to = value;
		}
		else
		{
			// set both to current
			this.options.dateTo = this.options.dateFrom = $.datepicker.formatDate(this.options.dateFormat, value);
			to = from = value;
		}

		this._trigger("change", null, { 'dateFrom': this.options.dateFrom, 'dateTo': this.options.dateTo});
		this._trigger("set_form_value", null, { "elem": this.element, "value": "['" + this.options.dateFrom + "','" + this.options.dateTo + "']" });

		this._datePicker.datepicker('setDate', new Date(this.options.dateTo));

		if (this.options.singleInput)
		{
			var fromText = '';
			var toText = '';
			if (this.options.dateFrom)
			{
				var parseFrom = $.datepicker.parseDate(this.options.dateFormat, this.options.dateFrom) || $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
				fromText = $.datepicker.formatDate(this.options.outDateFormat, parseFrom, this._pickerOptions);
			}
			if (this.options.dateTo)
			{
				var parseTo = $.datepicker.parseDate(this.options.dateFormat, this.options.dateTo) || $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
				toText = $.datepicker.formatDate(this.options.outDateFormat, parseTo, this._pickerOptions);
			}
			this._input.ibxWidget('option', 'text', (fromText || toText) ? (fromText + ' - ' + toText) : '');
		}
		else
		{
			if (this.options.dateFrom)
			{
				var parseFrom = $.datepicker.parseDate(this.options.dateFormat, this.options.dateFrom) || $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
				this._input.ibxWidget('option', 'text', $.datepicker.formatDate(this.options.outDateFormat, parseFrom, this._pickerOptions));
			}
			else
				this._input.ibxWidget('option', 'text', '');
			if (this.options.dateTo)
			{
				var parseTo = $.datepicker.parseDate(this.options.dateFormat, this.options.dateTo) || $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
				this._input2.ibxWidget('option', 'text', $.datepicker.formatDate(this.options.outDateFormat, parseTo, this._pickerOptions));
			}
			else
				this._input2.ibxWidget('option', 'text', '');
		}

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
		if (!this.options.singleInput)
		{
			if (this.options.showClear)
				this._clear2.show();
			else
				this._clear2.hide();
		}

		this._datePicker.datepicker('setDate', new Date(this.options.dateTo));
		if (this.options.singleInput)
		{
			var fromText = '';
			var toText = '';
			if (this.options.dateFrom)
			{
				var parseFrom = $.datepicker.parseDate(this.options.dateFormat, this.options.dateFrom) || $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
				fromText = $.datepicker.formatDate(this.options.outDateFormat, parseFrom, this._pickerOptions);
			}
			if (this.options.dateTo)
			{
				var parseTo = $.datepicker.parseDate(this.options.dateFormat, this.options.dateTo) || $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
				toText = $.datepicker.formatDate(this.options.outDateFormat, parseTo, this._pickerOptions);
			}

			this._input.ibxWidget('option', 'text', (fromText || toText) ? (fromText + ' - ' + toText) : '');
		}
		else
		{
			if (this.options.dateFrom)
			{
				var parseFrom = $.datepicker.parseDate(this.options.dateFormat, this.options.dateFrom) || $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
				this._input.ibxWidget('option', 'text', $.datepicker.formatDate(this.options.outDateFormat, parseFrom, this._pickerOptions));
			}
			else
				this._input.ibxWidget('option', 'text', '');
			if (this.options.dateTo)
			{
				var parseTo = $.datepicker.parseDate(this.options.dateFormat, this.options.dateTo) || $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
				this._input2.ibxWidget('option', 'text', $.datepicker.formatDate(this.options.outDateFormat, parseTo, this._pickerOptions));
			}
			else
				this._input2.ibxWidget('option', 'text', '');
		}
		window.setTimeout(function () { this._highlightRange(); }.bind(this), 10);
	}
});

$.widget("ibi.ibxDateRangeSimple", $.ibi.ibxDateRange, { options: { type: "simple" } });
$.widget("ibi.ibxDateRangeInline", $.ibi.ibxDateRange, { options: { type: "inline" } });


//# sourceURL=datepicker.ibx.js
