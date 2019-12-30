/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.29 $:

$.widget("ibi.ibxDatePicker", $.ibi.ibxVBox,
{
	options:
		{
			"type": "popup", // valid values: "popup", "simple", "inline"
			"autoOpen":true, //show datepicker when focused
			"dateFormat": '', // used as internal formatting
			"outDateFormat": '', // used to format what's shown in the associated label
			"wrap": "false",
			"align": "stretch",
			"showClear": false,
			"pickerClasses": '',
			"date": '',
			"numberOfMonths": 1,
			"initDate": true, // set date to the current date
			"adjustForMonthYear":false
	},
	_widgetClass: "ibx-datepicker",
	_create: function ()
	{
		this.options.dateFormat = this.options.dateFormat || $.ibi.ibxDatePicker.statics.defaultDateFormat;
		this.options.outDateFormat = this.options.outDateFormat || ibx.resourceMgr.getString("IBX_DP_DATE_OUTPUT_FORMAT");
		this.options.date = this.options.date || $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
		this._super();
		this.element.on("focus keydown", this._onFocusKeyEvent.bind(this));
		this._input = $('<div class="ibx-datepicker-input">').ibxLabel({glyphClasses:"fa fa-calendar", 'align': 'stretch'}).on('click', this._showPopup.bind(this));
		this._clear = $('<div class="ibx-datepicker-clear">').ibxButtonSimple({glyphClasses:"fa fa-times"}).on('click', this._onClear.bind(this)).hide();
		this._inputWrapper = $('<div>').ibxHBox({align: 'center'}).ibxAddClass('ibx-datepicker-input-wrapper');
		this._inputWrapper.append(this._input, this._clear);
		this._dateWrapper = $('<div>').ibxFlexBox({ 'wrap': false });
		this._datePicker = $('<div tabindex="-1">').datepicker({
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
			"onChangeMonthYear": this._onChangeMonthYear.bind(this)
		});

		//Need this because teh datepicker is not accessible by default...only uses anchors...and the selection manager won't tab/move between them by default.
		this._datePicker.ibxSelectionManager({type:"single", navKeyRoot:true, focusDefault:".ui-datepicker-current-day", focusResetOnBlur:false}).on("ibx_selectablechildren", function(e)
		{
			var dp = $(e.target);
			e.originalEvent.data.items = dp.find("a").attr("tabindex", 0);
		});

		//setup the strings.
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
		this._dateWrapper.append(this._datePicker).ibxAddClass('ibx-datepicker-date-wrapper');
		this.element.append(this._inputWrapper, this._dateWrapper);
		this._popup = $('<div class="ibx-datepicker-popup">').ibxPopup({'focusDefault':true, 'focusRoot':true, 'destroyOnClose': false});
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
		this._input.ibxWidget('option', 'text', $.datepicker.formatDate(this.options.outDateFormat, this._datePicker.datepicker('getDate'), this._pickerOptions));
	},
	_onChangeMonthYear:function(year, month, picker)
	{
		if(this._inChange)
			return;
		this._inChange = true;

		//this._datePicker.find("a").attr("tabindex", 0);

		var curDate = this._datePicker.datepicker('getDate');
		var newDate = curDate;
		newDate.setMonth(month-1);
		newDate.setYear(year);
		var data = { 'curDate': curDate, "newDate":$.datepicker.formatDate(this.options.dateFormat,newDate), "newYear":year, "newMonth":month };
		var defaultPrevented = !this._trigger("changemonthyear", null, data);
		if(!defaultPrevented && this.options.adjustForMonthYear)
			this.option("date", data.newDate);
		this._inChange = false;
	},
	_onFocusKeyEvent:function(e)
	{
		if(this.options.autoOpen)
			this._showPopup();
		else
		if(e.type == "keydown" && (e.keyCode == $.ui.keyCode.DOWN || e.keyCode == $.ui.keyCode.ENTER || e.keyCode == $.ui.keyCode.SPACE))
			this._showPopup();
	},
	_showPopup: function ()
	{
		switch (this.options.type)
		{
			case 'popup':
				if (!this._popup.ibxWidget('isOpen'))
					this._popup.ibxWidget('open');//.find("a").attr("tabindex", 0);
				break;
			default:
				break;
		}
	},
	_refresh: function ()
	{
		this.element.ibxRemoveClass('popup simple inline');
		if (this.options.showClear)
			this._clear.show();
		else
			this._clear.hide();
		if (this.options.pickerClasses)
			this._popup.ibxAddClass(this.options.pickerClasses);
		this._datePicker.datepicker('option', this.options);
		var dateObj = $.datepicker.parseDate(this.options.dateFormat, this.options.date) || new Date();
		this._datePicker.datepicker('setDate', dateObj);
		this._input.ibxWidget('option', 'text', $.datepicker.formatDate(this.options.outDateFormat, this._datePicker.datepicker('getDate'), this._pickerOptions));
		this._super();

		//[IBX-434] don't see why we close the popup on the refresh...take out and see what happens!
		//if (this._popup.ibxWidget('isOpen'))
		//	this._popup.ibxWidget('close');


		switch (this.options.type)
		{
			default:
			case 'popup':
				this.element.ibxAddClass('popup');
				this._inputWrapper.show();
				this._popup.ibxWidget('option', 'position', { "my": "left top", "at": "left bottom+5px", "of": this._input, "collision": "fit" });
				this._popup.append(this._dateWrapper);
				break;
			case 'simple':
				this.element.ibxAddClass('simple');
				this._inputWrapper.show();
				this.element.append(this._dateWrapper);
				break;
			case 'inline':
				this.element.ibxAddClass('inline');
				this._inputWrapper.hide();
				this.element.append(this._dateWrapper);
				break;
		}
	}
});

$.ibi.ibxDatePicker.statics =
{
	defaultDateFormat: "MM d, yy"
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
		this.options.dateTo = this.options.dateTo || $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
		this.options.dateFrom = this.options.dateFrom || $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
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
		this._input.ibxWidget('option', 'text', '');
	},
	_onClear2: function ()
	{
		this.options.dateTo  = '';
		this._datePicker.datepicker('setDate', '');
		this._trigger("change", null, { 'dateFrom': this.options.dateFrom, 'dateTo': ''});
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
			to = from;
		else
			to = parseTo.getTime();

		if (v <= from)
		{
			if (v == from && this.options.dateFrom != ''){
			 	if (this.options.dateTo != this.options.dateFrom)
					// Second click on from - set one day range
					this.options.dateTo = $.datepicker.formatDate(this.options.dateFormat, value);
				else
					// Clikc on 1 day range - reset to
					this.options.dateTo = '';
			}
			else			
				// extend from
				this.options.dateFrom = $.datepicker.formatDate(this.options.dateFormat, value);
		}
		else if (v >= to)
		{
			// extend to
			this.options.dateTo = $.datepicker.formatDate(this.options.dateFormat, value);
		}
		else
		{
			// in between - reset
			this.options.dateFrom = $.datepicker.formatDate(this.options.dateFormat, value);
			this.options.dateTo = '';
		}

		this._trigger("change", null, { 'dateFrom': this.options.dateFrom, 'dateTo': this.options.dateTo});

		//this._datePicker.datepicker('setDate', new Date(this.options.dateTo));

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
		this.options.date = this.options.dateTo;
		this._super();
		if (!this.options.singleInput)
		{
			if (this.options.showClear)
				this._clear2.show();
			else
				this._clear2.hide();
		}

		var toDateObj = $.datepicker.parseDate(this.options.dateFormat, this.options.dateTo) || new Date();
		this._datePicker.datepicker('setDate', toDateObj);
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
