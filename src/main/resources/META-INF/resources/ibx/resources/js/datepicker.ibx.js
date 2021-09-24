/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.29 $:

$.widget("ibi.ibxDatePicker", $.ibi.ibxVBox,
	{
		options:
		{
			"type": "popup", // valid values: "popup", "simple", "inline"
			"autoOpen": true, //show datepicker when focused
			"dateFormat": '', // used as internal formatting
			"outDateFormat": '', // used to format what's shown in the associated label
			"wrap": "false",
			"align": "stretch",
			"showClear": false,
			"pickerClasses": '',
			"date": '',
			"numberOfMonths": 1,
			"initDate": true, // set date to the current date
			"adjustForMonthYear": false,

			"showTime": false, //should the time picker be visible.
			"showTimeText": true, // show the selected time next to date in input
			"dateTime": null, //combined javascript Date object with the selected day/time
			"timeOptions": {}, //options passed to the ibxTimePicker control
			"showTimeZone":false, //should the timezone picker be visible
			"timeZones":[], //values fo the timezone picker.
			"time": null, // set the initial time. Use string in the format "1995-12-05T15:35:35.555". If not set current time is used.
		},
		_widgetClass: "ibx-datepicker",
		_create: function () {
			this.options.dateFormat = this.options.dateFormat || $.ibi.ibxDatePicker.statics.defaultDateFormat;
			this.options.outDateFormat = this.options.outDateFormat || ibx.resourceMgr.getString("IBX_DP_DATE_OUTPUT_FORMAT");
			this.options.date = this.options.date || $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
			this._super();
			this.element.on("focus keydown", this._onFocusKeyEvent.bind(this));
			this._input = $('<div class="ibx-datepicker-input">').ibxLabel({ glyphClasses: "material-icons", glyph: 'date_range', 'align': 'stretch' }).on('click', this._showPopup.bind(this));
			this._clear = $('<div class="ibx-datepicker-clear">').ibxButtonSimple({ glyphClasses: "material-icons", glyph: 'clear' }).on('click', this._onClear.bind(this)).hide();
			this._inputWrapper = $('<div>').ibxHBox({ align: 'center' }).ibxAddClass('ibx-datepicker-input-wrapper');
			this._inputWrapper.append(this._input, this._clear);
			this._dateWrapper = $('<div class="ibx-datepicker-date-wrapper">').ibxVBox({ 'wrap': false, 'align': 'stretch' });
			this._datePicker = $('<div tabindex="-1">').datepicker({
				"closeText": ibx.resourceMgr.getString("IBX_DP_CLOSE_TEXT"),
				"prevText": ibx.resourceMgr.getString("IBX_DP_PREV_TEXT"),
				"nextText": ibx.resourceMgr.getString("IBX_DP_NEXT_TEXT"),
				"currentText": ibx.resourceMgr.getString("IBX_DP_CUR_TEXT"),
				"weekHeader": ibx.resourceMgr.getString("IBX_DP_WEEK_HEADER"),
				"monthNames": (eval(ibx.resourceMgr.getString("IBX_DP_MONTHS"))),
				"monthNamesShort": (eval(ibx.resourceMgr.getString("IBX_DP_MONTHS_SHORT"))),
				"dayNames": (eval(ibx.resourceMgr.getString("IBX_DP_DAYS"))),
				"dayNamesShort": (eval(ibx.resourceMgr.getString("IBX_DP_DAYS_SHORT"))),
				"dayNamesMin": (eval(ibx.resourceMgr.getString("IBX_DP_DAYS_MIN"))),
				"buttonText": ibx.resourceMgr.getString("IBX_DP_BUTTON_TEXT"),
				"onSelect": this._onSelect.bind(this),
				"onChangeMonthYear": this._onChangeMonthYear.bind(this),
				"showOn":"dont_show_when_input_gets_focus____AND_DONT_REMOVE_THIS",
			});

			//Need this because the datepicker is not accessible by default...only uses anchors...and the selection manager won't tab/move between them by default.
			this._datePicker.ibxSelectionManager({ type: "single", navKeyRoot: true, focusDefault: true, focusResetOnBlur: true }).on("ibx_selectablechildren", function (e) {
				var dp = $(e.target);
				e.originalEvent.data.items = dp.find("a").attr("tabindex", 0);
			});

			//setup the strings.
			this._pickerOptions = {
				"closeText": ibx.resourceMgr.getString("IBX_DP_CLOSE_TEXT"),
				"prevText": ibx.resourceMgr.getString("IBX_DP_PREV_TEXT"),
				"nextText": ibx.resourceMgr.getString("IBX_DP_NEXT_TEXT"),
				"currentText": ibx.resourceMgr.getString("IBX_DP_CUR_TEXT"),
				"weekHeader": ibx.resourceMgr.getString("IBX_DP_WEEK_HEADER"),
				"monthNames": (eval(ibx.resourceMgr.getString("IBX_DP_MONTHS"))),
				"monthNamesShort": (eval(ibx.resourceMgr.getString("IBX_DP_MONTHS_SHORT"))),
				"dayNames": (eval(ibx.resourceMgr.getString("IBX_DP_DAYS"))),
				"dayNamesShort": (eval(ibx.resourceMgr.getString("IBX_DP_DAYS_SHORT"))),
				"dayNamesMin": (eval(ibx.resourceMgr.getString("IBX_DP_DAYS_MIN"))),
				"buttonText": ibx.resourceMgr.getString("IBX_DP_BUTTON_TEXT")
			};
			this._dateWrapper.append(this._datePicker).ibxAddClass('ibx-datepicker-date-wrapper');

			//setup the timepicker.
			this._onTimePickerChangeBound = this._onTimePickerChange.bind(this);
			this.options.timeOptions = $.extend({}, { showColon: false, showMillisecond: false }, this.options.timeOptions)
			this._timePicker = $("<div class='ibx-datepicker-timepicker'>").ibxTimePicker(this.options.timeOptions);
			this._timeWrapper = $("<div class='ibx-datepicker-time-wrapper'>").ibxHBox({justify: "spaceAround"}).append(this._timePicker);
			this._timeZoneLabel = $("<div class='ibx-timezone-label'>").ibxLabel({ text: ibx.resourceMgr.getString('IBX_DP_TIME_ZONE_SELECT') });
			this._timeZonePicker = $("<div tabindex='0' class='ibx-timezonepicker'>").ibxSelect({readonly:true}).on('ibx_change', this._onTimePickerChangeBound);
			this._timeZoneWrapper = $("<div class='ibx-datepicker-time-zone-wrapper'>").ibxVBox({ align: 'stretch' }).append(this._timeZoneLabel, this._timeZonePicker);
			this._dateWrapper.append(this._timePickerLabel, this._timeWrapper, this._timeZoneWrapper);

			this.element.append(this._inputWrapper, this._dateWrapper);
			this._popup = $('<div class="ibx-datepicker-popup">').ibxPopup({ 'focusDefault': true, 'destroyOnClose': false });
		},
		_init: function () {
			this._super();
			this._timePicker.ibxWidget('time', new Date(this.options.time || new Date()));
			this._timePicker.on('ibx_change', this._onTimePickerChangeBound);
		},
		_destroy: function () {
			this._super();
		},
		_onClear: function () {
			this._datePicker.datepicker('setDate', '');
			this._triggerChange();
		},
		_onSelect: function (dateText, inst) {
			switch (this.options.type) {
				case 'popup':
					if (this._popup.ibxWidget('isOpen') && !this.options.showTime) //don't hide on selection when also setting time.
						this._popup.ibxWidget('close');
					break;
				default:
					break;
			}
			this._triggerChange();
		},
		_triggerChange: function (){
			var date = this._datePicker.datepicker('getDate');
			this.options.date = $.datepicker.formatDate(this.options.dateFormat, date); 
			var timeZone = this._timeZonePicker.ibxWidget('userValue');
			var time = this._timePicker.ibxWidget('time');
			this.options.time = time.date;
			var currentDate = date || new Date();  // date can be null if not date set
			this.options.dateTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), time.hour24, time.minute, time.second, time.milliSecond);
			this._trigger("change", null, { 'date': this.options.date, 'dateTime': this.options.dateTime, timeZone:timeZone });
			this._input.ibxWidget('option', 'text', $.datepicker.formatDate(this.options.outDateFormat, this._datePicker.datepicker('getDate'), this._pickerOptions) + this._timeText(this._timePicker.ibxWidget("time")));
		},
		_onTimePickerChange: function (e) {
			this._triggerChange();
			e.stopPropagation();
		},
		_onChangeMonthYear: function (year, month, picker) {
			if (this._inChange)
				return;
			this._inChange = true;

			var curDate = this._datePicker.datepicker('getDate') || (new Date());
			var newDate = curDate;
			newDate.setMonth(month - 1);
			newDate.setYear(year);
			var data = { 'curDate': curDate, "newDate": $.datepicker.formatDate(this.options.dateFormat, newDate), "newYear": year, "newMonth": month };
			var defaultPrevented = !this._trigger("changemonthyear", null, data);
			if (!defaultPrevented && this.options.adjustForMonthYear)
				this.option("date", data.newDate);

			this._onRefreshSelection();

			this._inChange = false;
		},
		_onRefreshSelection: function (e) {
			//CD-2510/DF1268 - as usual IE has a problem after the native year/month popup closes nothing has focus..have to focus something
			window.setTimeout(function () {
				if (this.destroyed())
					return;

				this._datePicker.ibxSelectionManager('selectableChildren');
				this._datePicker.ibxSelectionManager('selected', 'td a', true, true, true);
			}.bind(this), 10);
		},
		_onFocusKeyEvent: function (e) {
			if (this.options.autoOpen)
				this._showPopup();
			else
				if (e.type == "keydown" && (e.keyCode == $.ui.keyCode.DOWN || e.keyCode == $.ui.keyCode.ENTER || e.keyCode == $.ui.keyCode.SPACE))
					this._showPopup();
		},
		_showPopup: function () {
			switch (this.options.type) {
				case 'popup':
					if (!this._popup.ibxWidget('isOpen'))
						this._popup.ibxWidget('open');
					break;
				default:
					break;
			}
		},
		_parseDate: function (date){
			if (date instanceof Date){
				return new Date(date.getFullYear(), date.getMonth(), date.getDate());
			}
			else if (typeof(date) === "string")
				return $.datepicker.parseDate(this.options.dateFormat, date);
			else
				return null;
		},
		_timeText: function (time){
			if (!this.options.showTime || !this.options.showTimeText)
				return "";
			var minute = (time.minute < 10 ? "0" : "") + time.minute;
			var second = (time.second < 10 ? "0" : "") + time.second
			var milliSecond = (time.milliSecond < 10 ? "00" : (time.milliSecond < 100 ? "0" : "")) + time.milliSecond;
			return "; " + time.hour + ":" + minute + ":" + second + (this.options.timeOptions.showMillisecond ? "." + milliSecond : "") + time.meridian;
		},
		// get/set time. 'data' can be a string like "1995-12-04T13:30:30.333" or a Date object. Only the time part is gonna be used.
		// If data is undefined it returns the time picker response object
		time: function (data){
			if (data === undefined)
				return this._timePicker.ibxWidget('time');
			else{
				this.options.time = data;
				this._timePicker.ibxWidget('time', new Date(data));
			}
		},
		_refresh: function () {
			this.element.ibxRemoveClass('popup simple inline');
			if (this.options.showClear)
				this._clear.show();
			else
				this._clear.hide();
			if (this.options.pickerClasses)
				this._popup.ibxAddClass(this.options.pickerClasses);
			this._datePicker.datepicker('option', this.options);
			var dateObj = this._parseDate(this.options.date) || new Date();
			this._datePicker.datepicker('setDate', dateObj);
			
			//Setup the time/zones picker
			this._timePicker.ibxWidget('option', this.options.timeOptions);
			if (this.options.time) this._timePicker.ibxWidget('time', new Date(this.options.time));
			this._timeZoneWrapper.css('display', this.options.showTimeZone ? '' : 'none');
			this._timeZonePicker.ibxWidget('removeControlItem');
			this.options.timeZones = this.options.timeZones || [{title:'GMT', value:0}]
			for(var i = 0; i < this.options.timeZones.length; ++i){
				var tz = this.options.timeZones[i];
				this._timeZonePicker.ibxWidget('addControlItem', $("<div>").ibxSelectItem({text:tz.title, userValue:tz.value, selected:tz.selected}))
			}

			this._timeWrapper.css('display', this.options.showTime ? '' : 'none');
			this._input.ibxWidget('option', 'text', $.datepicker.formatDate(this.options.outDateFormat, this._datePicker.datepicker('getDate'), this._pickerOptions) + this._timeText(this._timePicker.ibxWidget("time")));
			this._super();

			//[IBX-434] don't see why we close the popup on the refresh...take out and see what happens!
			//if (this._popup.ibxWidget('isOpen'))
			//	this._popup.ibxWidget('close');

			switch (this.options.type) {
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
			"timeFrom": null, // set the initial "from" time. Use string in the format "1995-12-05T15:35:35.555". If not set current time is used.
			"timeTo": null, // set the initial "to" time. Use string in the format "1995-12-05T15:35:35.555". If not set current time is used.
		},
		_create: function () {
			this.options.dateTo = this.options.dateTo || $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
			this.options.dateFrom = this.options.dateFrom || $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
			this._super();

			this._input2 = $('<div class="ibx-datepicker-input">').ibxLabel({ glyphClasses: "material-icons", glyph: 'date_range', 'align': 'stretch' }).on('click', this._showPopup.bind(this));
			this._clear2 = $('<div class="ibx-datepicker-clear">').ibxButtonSimple({ glyphClasses: "material-icons", glyph: 'clear' }).on('click', this._onClear2.bind(this)).hide();
			this._inputWrapper.append(this._input2, this._clear2);
			this._timePicker2 = $("<div class='ibx-datepicker-timepicker'>").ibxTimePicker(this.options.timeOptions);
			this._timeWrapper.append(this._timePicker2);
			this._timeLabelWrapper = $('<div class="ibx-datepicker-time-label-wrapper">').ibxHBox({align: "stretch", justify: "spaceAround"});
			this._timeLabelWrapper.append(
				$('<div class="ibx-datepicker-time-start-label">').ibxLabel({"text": ibx.resourceMgr.getString("IBX_DP_START_TIME")}), 
				$('<div class="ibx-datepicker-time-end-label">').ibxLabel({"text": ibx.resourceMgr.getString("IBX_DP_END_TIME")})
			);
			this._timeWrapper.before(this._timeLabelWrapper);
			window.setTimeout(function () { this._highlightRange(); }.bind(this), 10);
		},
		_init: function () {
			this._super();
			this._timePicker.off("ibx_change", this._onTimePickerChangeBound);
			this._timePicker.ibxWidget('time', new Date(this.options.timeFrom || new Date()));
			this._timePicker.on("ibx_change", this._onTimePickerChangeBound);
			this._timePicker2.ibxWidget('time', new Date(this.options.timeTo || new Date()));
			this._timePicker2.on('ibx_change', this._onTimePickerChangeBound);
			if (this.options.singleInput) {
				this._input2.remove();
				this._clear2.remove();
			}
		},
		_onChangeMonthYear: function (year, month, inst) {
			window.setTimeout(function () { this._highlightRange(); }.bind(this), 10);
			this._onRefreshSelection();
		},
		_onClear: function () {
			this.options.dateFrom = '';
			if (this.options.singleInput)
				this.options.dateTo = '';
			this._datePicker.datepicker('setDate', '');
			this._triggerChange();
		},
		_onClear2: function () {
			this.options.dateTo = '';
			this._datePicker.datepicker('setDate', '');
			this._triggerChange();
		},
		_onSelect: function (dateText, inst) {
			//var value = $.datepicker.formatDate(this.options.dateFormat, this._datePicker.datepicker('getDate'));
			var value = this._datePicker.datepicker('getDate');
			if (value){ // If value is null date has been cleared before but time/time zone has triggered a change
				var v = value.getTime();

				var from;
				var parseFrom = this._parseDate(this.options.dateFrom);
				if (!parseFrom)
					from = (new Date()).getTime();
				else
					from = parseFrom.getTime();

				var to;
				var parseTo = this._parseDate(this.options.dateTo);
				if (!parseTo)
					to = from;
				else
					to = parseTo.getTime();

				if (v <= from) {
					if (v == from && this.options.dateFrom != '') {
						if (this.options.dateTo != this.options.dateFrom)
							// Second click on from - set one day range
							this.options.dateTo = $.datepicker.formatDate(this.options.dateFormat, value);
						else
							// Click on 1 day range - reset to
							this.options.dateTo = '';
					}
					else
						// extend from
						this.options.dateFrom = $.datepicker.formatDate(this.options.dateFormat, value);
				}
				else if (v >= to) {
					// extend to
					this.options.dateTo = $.datepicker.formatDate(this.options.dateFormat, value);
				}
				else {
					// in between - reset
					this.options.dateFrom = $.datepicker.formatDate(this.options.dateFormat, value);
					this.options.dateTo = '';
				}
			}

			this._triggerChange();
			window.setTimeout(function () { this._highlightRange(); }.bind(this), 10);
		},
		_setInputText: function (){
			if (this.options.singleInput) {
				var fromText = '';
				var toText = '';
				if (this.options.dateFrom) {
					var parseFrom = this._parseDate(this.options.dateFrom) || $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
					fromText = $.datepicker.formatDate(this.options.outDateFormat, parseFrom, this._pickerOptions) + this._timeText(this._timePicker.ibxWidget("time"));
				}
				if (this.options.dateTo) {
					var parseTo = this._parseDate(this.options.dateTo) || $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
					toText = $.datepicker.formatDate(this.options.outDateFormat, parseTo, this._pickerOptions) + this._timeText(this._timePicker2.ibxWidget("time"));
				}
				this._input.ibxWidget('option', 'text', (fromText || toText) ? (fromText + ' - ' + toText) : '');
			}
			else {
				if (this.options.dateFrom) {
					var parseFrom = this._parseDate(this.options.dateFrom) || $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
					this._input.ibxWidget('option', 'text', $.datepicker.formatDate(this.options.outDateFormat, parseFrom, this._pickerOptions) + this._timeText(this._timePicker.ibxWidget("time")));
				}
				else
					this._input.ibxWidget('option', 'text', '');
				if (this.options.dateTo) {
					var parseTo = this._parseDate(this.options.dateTo) || $.datepicker.formatDate($.ibi.ibxDatePicker.statics.defaultDateFormat, new Date());
					this._input2.ibxWidget('option', 'text', $.datepicker.formatDate(this.options.outDateFormat, parseTo, this._pickerOptions) + this._timeText(this._timePicker2.ibxWidget("time")));
				}
				else
					this._input2.ibxWidget('option', 'text', '');
			}
		},
		_triggerChange: function (){
			var from;
			var parseFrom = this._parseDate(this.options.dateFrom);
			if (!parseFrom)
				from = (new Date()).getTime();
			else
				from = parseFrom.getTime();

			var to;
			var parseTo = this._parseDate(this.options.dateTo);
			if (!parseTo)
				to = from;
			else
				to = parseTo.getTime();

			var dateFrom = new Date(from);
			var dateTo = new Date(to);
			var timeZone = this._timeZonePicker.ibxWidget('userValue');
			var timeFrom = this._timePicker.ibxWidget('time');
			this.options.timeFrom = this.options.time = timeFrom.date;
			this.options.dateTimeFrom = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate(), timeFrom.hour24, timeFrom.minute, timeFrom.second, timeFrom.milliSecond);
			var timeTo = this._timePicker2.ibxWidget('time');
			this.options.timeTo = timeTo.date;
			this.options.dateTimeTo = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), timeTo.hour24, timeTo.minute, timeTo.second, timeTo.milliSecond);
			this._trigger("change", null, 
			{
				'dateFrom': this.options.dateFrom,
				'dateTo': this.options.dateTo,
				'dateTimeFrom': this.options.dateTimeFrom,
				'dateTimeTo': this.options.dateTimeTo,
				'timeZone': timeZone,
			});
			this._setInputText();
		},
		_highlightRange: function () {
			var parseFrom = this._parseDate(this.options.dateFrom);
			var parseTo = this._parseDate(this.options.dateTo);
			if (!parseFrom || !parseTo)
				return;

			var dateFrom = parseFrom.getTime();
			var dateTo = parseTo.getTime();

			this._datePicker.find('td[data-handler="selectDay"]').each(function (index, el) {
				var el = $(el);
				var month = parseInt(el.attr('data-month'), 10);
				var year = parseInt(el.attr('data-year'), 10);
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
		// get/set time. 'data' can be an object like this: {timeFrom: "1995-12-04T13:30:30.333", timeTo: "1995-12-05T15:35:35.555"} or
		// {timeFrom: new Date(), timeTo: new Date()}
		// Only the time part of 'timeFrom' or 'timeTo' will be used.
		// If data is undefined, it returns an object like this: {timeFrom: <'from' response object>, timeTo: <'to' response object>}
		time: function (data){
			if (data === undefined)
				return {timeFrom: this._timePicker.ibxWidget('time'), timeTo: this._timePicker2.ibxWidget('time')};
			else{
				if (data.timeFrom){
					this.options.timeFrom = this.options.time = data.timeFrom;
					this._timePicker.ibxWidget('time', new Date(data.timeFrom));
				}
				if (data.timeTo){
					this.options.timeTo = data.timeTo;
					this._timePicker2.ibxWidget('time', new Date(data.timeTo));
				}
			}
		},
		// get/set 'timeFrom' only. 'data' can be a string like "1995-12-04T13:30:30.333" or a Date object. Only the time part is gonna be used.
		// If data is undefines, it returns the time picker 'from' response object
		timeFrom: function (data){
			if (data === undefined)
				return this._timePicker.ibxWidget('time');
			else{
				this.options.timeFrom = this.options.time = data;
				this._timePicker.ibxWidget('time', new Date(data));
			}
		},
		// get/set 'timeTo' only. 'data' can be a string like "1995-12-05T15:35:35.555" or a Date object. Only the time part is gonna be used.
		// If data is undefined it returns the time picker 'to' response object
		timeTo: function (data){
			if (data === undefined)
				return this._timePicker2.ibxWidget('time');
			else{
				this.options.timeTo = data;
				this._timePicker2.ibxWidget('time', new Date(data));
			}
		},
		_refresh: function () {
			this.options.date = this.options.dateTo;
			const timeTo = this.options.timeTo;
			this._super();
			if (!this.options.singleInput) {
				if (this.options.showClear)
					this._clear2.show();
				else
					this._clear2.hide();
			}

			if (this.options.showTime)
				this._timeLabelWrapper.show();
			else
				this._timeLabelWrapper.hide();

			var toDateObj = this._parseDate(this.options.dateTo) || new Date();
			this._datePicker.datepicker('setDate', toDateObj);
			this._setInputText();
			this._timePicker.ibxWidget('option', this.options.timeOptions)
			if (this.options.timeFrom) this._timePicker.ibxWidget('time', new Date(this.options.timeFrom));
			this._timePicker2.ibxWidget('option', this.options.timeOptions);
			if (timeTo) this._timePicker2.ibxWidget('time', new Date(timeTo));
			window.setTimeout(function () { this._highlightRange(); }.bind(this), 10);
		}
	});

$.widget("ibi.ibxDateRangeSimple", $.ibi.ibxDateRange, { options: { type: "simple" } });
$.widget("ibi.ibxDateRangeInline", $.ibi.ibxDateRange, { options: { type: "inline" } });


//# sourceURL=datepicker.ibx.js
