/*------------------------------------*/
/*                                    */
/*         IBX Time Picker           */
/*                                    */
/*------------------------------------*/

$.widget("ibi.ibxTimePicker", $.ibi.ibxHBox, {
	options: {
		"nameRoot": true,
		"align": "center",

		"hour": 0,
		"minute": 0,
		"second": 0,
		"milliSecond": 0,
		"meridianCode": 0, // 0 = am, 1 = pm

		"circularStep": true, //ability to cycle through values in spinners
		"24hour": false,  //24 hour clock
		"synchronizedStepping": false, //adjusts hour, minute and meridian as it changes

		"showHour": true,
		"showMinute": true,
		"showSecond": true,
		"showMillisecond": true,
		"showMeridian": true,
		"showColon": true,
		"showUnit": true,

		"enableHour": true,
		"enableMinute": true,
		"enableSecond": true,
		"enableMilliSecond": true,
		"enableMeridian": true
	},

	_widgetClass: "ibx-timepicker",

	_create: function () {
		this._super();

		//Create Spinners
		this._hourSpinner = $('<div class="ibx-timepicker-spinner ibx-timepicker-spinner-hour" tabindex="0">').ibxSpinner();
		this._minuteSpinner = $('<div class="ibx-timepicker-spinner ibx-timepicker-spinner-minute" tabindex="0">').ibxSpinner();
		this._secondSpinner = $('<div class="ibx-timepicker-spinner ibx-timepicker-spinner-second" tabindex="0">').ibxSpinner();
		this._milliSecondSpinner = $('<div class="ibx-timepicker-spinner ibx-timepicker-spinner-milli-second" tabindex="0">').ibxSpinner();
		this._meridianSpinner = $('<div class="ibx-timepicker-spinner ibx-timepicker-spinner-meridian" tabindex="0">').ibxSpinner();

		//Create Colon Divs
		this._minuteColon = $('<div class="ibx-timepicker-colon ibx-timepicker-colon-minute">:</div>');
		this._secondColon = $('<div class="ibx-timepicker-colon ibx-timepicker-colon-second">:</div>');
		this._milliSecondColon = $('<div class="ibx-timepicker-colon ibx-timepicker-colon-milli-second">:</div>');

		//Add Parts to Element
		this.element.ibxWidget("add", this._hourSpinner);
		this.element.ibxWidget("add", this._minuteColon);
		this.element.ibxWidget("add", this._minuteSpinner);
		this.element.ibxWidget("add", this._secondColon);
		this.element.ibxWidget("add", this._secondSpinner);
		this.element.ibxWidget("add", this._milliSecondColon);
		this.element.ibxWidget("add", this._milliSecondSpinner);
		this.element.ibxWidget("add", this._meridianSpinner);
	},


	_init: function () {
		this._super();

		//Hour Set Up
		this._hourSpinner.ibxWidget("option", "fnFormat", this._formatTime.bind(this, $.ibi.ibxTimePicker.units.HOUR));
		this._hourSpinner.ibxWidget("setValue", this.options.hour);
		this._hourSpinner.on("ibx_change", this._timeChange.bind(this));

		//Minute Set Up
		this._minuteSpinner.ibxWidget("option", "min", 0);
		this._minuteSpinner.ibxWidget("option", "max", 59);
		this._minuteSpinner.ibxWidget("option", "fnFormat", this._formatTime.bind(this, $.ibi.ibxTimePicker.units.MINUTE));
		this._minuteSpinner.ibxWidget("setValue", this.options.minute);
		this._minuteSpinner.on("ibx_change", this._timeChange.bind(this));

		//Second Set Up
		this._secondSpinner.ibxWidget("option", "min", 0);
		this._secondSpinner.ibxWidget("option", "max", 59);
		this._secondSpinner.ibxWidget("option", "fnFormat", this._formatTime.bind(this, $.ibi.ibxTimePicker.units.SECOND));
		this._secondSpinner.ibxWidget("setValue", this.options.second);
		this._secondSpinner.on("ibx_change", this._timeChange.bind(this));

		//MilliSecond Set Up
		this._milliSecondSpinner.ibxWidget("option", "min", 0);
		this._milliSecondSpinner.ibxWidget("option", "max", 999);
		this._milliSecondSpinner.ibxWidget("option", "fnFormat", this._formatTime.bind(this, $.ibi.ibxTimePicker.units.MILLISECOND));
		this._milliSecondSpinner.ibxWidget("setValue", this.options.milliSecond);
		this._milliSecondSpinner.on("ibx_change", this._timeChange.bind(this));

		// Meridian Set Up
		this._meridianSpinner.ibxWidget("option", "validKeys", [
			8, //back
			9, //tab
			38, //up arrow
			40, //down arrow
			46, //delete
			65, //a
			77, //m
			80  //p
		]);

		this._meridianSpinner.ibxWidget("option", "min", $.ibi.ibxTimePicker.AM);
		this._meridianSpinner.ibxWidget("option", "max", $.ibi.ibxTimePicker.PM);
		this._meridianSpinner.ibxWidget("option", "fnUnformat", this._unformatMeridian.bind(this)); // Meridian to number
		this._meridianSpinner.ibxWidget("option", "fnFormat", this._formatTime.bind(this, $.ibi.ibxTimePicker.units.MERIDIAN)); //Number to meridian
		this._meridianSpinner.ibxWidget("setValue", this.options.meridianCode);
		this._meridianSpinner.on("ibx_change", this._timeChange.bind(this));

	},

	_setOption: function (key, value) {
		this._super(key, value);

		if (key === "circularStep") {
			this._hourSpinner.ibxWidget("option", "circularStep", value);
			this._minuteSpinner.ibxWidget("option", "circularStep", value);
			this._secondSpinner.ibxWidget("option", "circularStep", value);
		}
		else if (key === "24hour") {
			this.option('showMeridian',!value);
			value ? this._hourSpinner.ibxWidget("option", "min", 0) : this._hourSpinner.ibxWidget("option", "min", 1);
			value ? this._hourSpinner.ibxWidget("option", "max", 23) : this._hourSpinner.ibxWidget("option", "max", 12);

			var hourOffset = 0;

			//Convert 12hour to 24hour
			if (value) {
				if (this.options.meridianCode === $.ibi.ibxTimePicker.PM && this.options.hour !== 12) {
					hourOffset = 12;
				}
				//Midnight
				else if (this.options.meridianCode === $.ibi.ibxTimePicker.AM && this.options.hour === 12) {
					hourOffset = -12;
				}
			}

			//Convert 24hour to 12hour 
			else {
				this.option('meridianCode', (this.options.hour > 12) ? $.ibi.ibxTimePicker.PM : $.ibi.ibxTimePicker.AM)
				if (this.options.hour > 12) {
					hourOffset = -12;
				}
				else if (this.options.hour === 0) {
					hourOffset = 12;
				}
			}

			this.options.hour += hourOffset;
			this._hourSpinner.ibxWidget("setValue", this.options.hour);
		}
		else if (key === "showHour" || key === "showMinute" || key === "showSecond" || key === "showMillisecond" || key === "showMeridian" || key === "showColon") {

			//Meridian
			this._meridianSpinner.ibxToggleClass('ibx-timepicker-hide-spinner', !this.options.showMeridian);

			//MilliSecond
			this._milliSecondSpinner.ibxToggleClass('ibx-timepicker-hide-spinner', !this.options.showMillisecond);
			this.options.showMillisecond && (this.options.showSecond || this.options.showMinute || this.options.showHour) && this.options.showColon ? this._milliSecondColon.css("display", "") : this._milliSecondColon.css("display", "none");

			//Second
			this._secondSpinner.ibxToggleClass('ibx-timepicker-hide-spinner', !this.options.showSecond);
			this.options.showSecond && (this.options.showMinute || this.options.showHour) && this.options.showColon ? this._secondColon.css("display", "") : this._secondColon.css("display", "none");

			//Minute
			this._minuteSpinner.ibxToggleClass('ibx-timepicker-hide-spinner', !this.options.showMinute);
			this.options.showMinute && this.options.showHour && this.options.showColon ? this._minuteColon.css("display", "") : this._minuteColon.css("display", "none");

			//Hour
			this._hourSpinner.ibxToggleClass('ibx-timepicker-hide-spinner', !this.options.showHour);
		}
		else if (key === "enableHour") {
			this._hourSpinner.ibxWidget("option", "disabled", !value);
		}
		else if (key === "enableMinute") {
			this._minuteSpinner.ibxWidget("option", "disabled", !value);
		}
		else if (key === "enableSecond") {
			this._secondSpinner.ibxWidget("option", "disabled", !value);
		}
		else if (key === "enableMilliSecond") {
			this._milliSecondSpinner.ibxWidget("option", "disabled", !value);
		}
		else if (key === "enableMeridian") {
			this._meridianSpinner.ibxWidget("option", "disabled", !value);
		}
		else if (key === "hour") {
			this._hourSpinner.ibxWidget("setValue", value);
			this.options.hour = this._hourSpinner.ibxWidget("option", "text");
		}
		else if (key === "minute") {
			this._minuteSpinner.ibxWidget("setValue", value);
			this.options.minute = this._minuteSpinner.ibxWidget("option", "text");
		}
		else if (key === "second") {
			this._secondSpinner.ibxWidget("setValue", value);
			this.options.second = this._secondSpinner.ibxWidget("option", "text");
		}
		else if (key === "milliSecond") {
			this._milliSecondSpinner.ibxWidget("setValue", value);
			this.options.milliSecond = this._milliSecondSpinner.ibxWidget("option", "text");
		}
		else if (key === "meridianCode") {
			this._meridianSpinner.ibxWidget("option", "value", value);
		}
	},


	//------- Change Event -------//
	_timeChange: function (event, info) {
		if (this._inTimeChange)
			return;
		this._inTimeChange = true;

		var ctrl = $(event.target);
		var changed = false;

		//Hour Change
		if (ctrl.is(".ibx-timepicker-spinner-hour")) {
			var prev = this.options.hour;
			this.options.hour = this._hourSpinner.ibxWidget("option", "value");

			changed = prev === this.options.hour ? false : true;

			if (this.options.synchronizedStepping && info.prevValue === 11 && this.options.hour === 12) {
				this._meridianSpinner.ibxWidget("stepSpinner", true, 1);
			}
			else if (this.options.synchronizedStepping && info.prevValue === 12 && this.options.hour === 11) {
				this._meridianSpinner.ibxWidget("stepSpinner", false, 1);
			}
			else if (this.options["24hour"]) {
				this.option('meridianCode', (this.options.hour < 12) ? $.ibi.ibxTimePicker.AM : $.ibi.ibxTimePicker.PM);
			}
		}

		//Minute Change
		else if (ctrl.is(".ibx-timepicker-spinner-minute")) {
			var prev = this.options.minute;
			this.options.minute = this._minuteSpinner.ibxWidget("option", "value");

			changed = prev === this.options.minute ? false : true;

			if (this.options.synchronizedStepping) {
				//Increase the Hour 
				if (info.stepped && info.prevValue === 59 && info.value === 0) {
					this._hourSpinner.ibxWidget("stepSpinner", true, 1);
				}
				//Decrease the Hour
				else if (info.stepped && info.prevValue === 0 && info.value === 59) {
					this._hourSpinner.ibxWidget("stepSpinner", false, 1);
				}
			}
		}

		//Second Change
		else if (ctrl.is(".ibx-timepicker-spinner-second")) {

			//Check if value changed
			var prev = this.options.second;
			this.options.second = this._secondSpinner.ibxWidget("option", "value");
			changed = prev === this.options.second ? false : true;

			if (this.options.synchronizedStepping) {

				//Increase the Minute
				if (info.stepped && info.prevValue === 59 && info.value === 0) {
					this._minuteSpinner.ibxWidget("stepSpinner", true, 1);
				}
				//Decrease the Minute
				if (info.stepped && info.prevValue === 0 && info.value === 59) {
					this._minuteSpinner.ibxWidget("stepSpinner", false, 1);
				}
			}
		}

		//MilliSecond Change
		else if (ctrl.is(".ibx-timepicker-spinner-milli-second")) {

			//Check if value changed
			var prev = this.options.second;
			this.options.milliSecond = this._milliSecondSpinner.ibxWidget("option", "value");
			changed = prev === this.options.milliSecond ? false : true;

			if (this.options.synchronizedStepping) {

				//Increase the Minute
				if (info.stepped && info.prevValue === 999 && info.value === 0) {
					this._secondSpinner.ibxWidget("stepSpinner", true, 1);
				}
				//Decrease the Minute
				if (info.stepped && info.prevValue === 0 && info.value === 999) {
					this._secondSpinner.ibxWidget("stepSpinner", false, 1);
				}
			}
		}

		//Meridian Change
		else if (ctrl.is(".ibx-timepicker-spinner-meridian")) {
			var newMeridianCode = this._meridianSpinner.ibxWidget("option", "value");
			changed = this.options.meridianCode != newMeridianCode;
			this.option('meridianCode', newMeridianCode);
		}

		//Dispatch Event
		if (changed) {
			this.element.dispatchEvent("ibx_change", this.time(), true, false);
			event.stopPropagation();
		}
		this._inTimeChange = false;
	},


	//------- Formatting -------//
	_formatTime: function (unit, value) {

		if (unit === $.ibi.ibxTimePicker.units.MERIDIAN)
			value = ibx.resourceMgr.getString((value === $.ibi.ibxTimePicker.AM) ? "IBX_TP_UNIT_AM" : "IBX_TP_UNIT_PM")
		else
			if (unit === $.ibi.ibxTimePicker.units.MILLISECOND) {
				if (value < 10)
					value = "00" + value;
				else
					if (value < 100)
						value = "0" + value;
			}
			else
				if (value < 10) {
					value = "0" + value;
				}

		var unitString = '';
		switch (unit) {
			case $.ibi.ibxTimePicker.units.HOUR: unitString = ibx.resourceMgr.getString("IBX_TP_UNIT_HOUR"); break;
			case $.ibi.ibxTimePicker.units.MINUTE: unitString = ibx.resourceMgr.getString("IBX_TP_UNIT_MINUTE"); break;
			case $.ibi.ibxTimePicker.units.SECOND: unitString = ibx.resourceMgr.getString("IBX_TP_UNIT_SECOND"); break;
			case $.ibi.ibxTimePicker.units.MILLISECOND: unitString = ibx.resourceMgr.getString("IBX_TP_UNIT_MILLISECOND"); break;
		}
		return value + unitString;
	},

	_unformatMeridian: function (value) {
		return (value === "AM" || value === 0) ? $.ibi.ibxTimePicker.AM : $.ibi.ibxTimePicker.PM;
	},

	time: function (date) {
		if (date === undefined) {
			var ret = {
				"hour": this.options.hour,
				"hour24": (!this.options["24hour"] && (this.options.meridianCode == $.ibi.ibxTimePicker.PM)) ? this.options.hour + 12 : this.options.hour,
				"minute": this.options.minute,
				"second": this.options.second,
				"milliSecond": this.options.milliSecond,
				"meridian": this.options.meridianCode === $.ibi.ibxTimePicker.AM ? "AM" : "PM",
				"meridianCode":this.options.meridianCode
			};
			ret.date = new Date(0, 0, 0, ret.hour24, ret.minute, ret.second, ret.milliSecond);
			return ret;
		}

		date = (date instanceof Date) ? { hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds(), milliSecond: date.getMilliseconds() } : date;

		var hourOffset = 0;

		//Consideration for hour and meridian
		if (this.options["24hour"]) {

			//This is in case of a user passing in an invalid meridian based on the hour and 24hour option
			this._meridianSpinner.ibxWidget("setValue", (date.hour > 12) ? $.ibi.ibxTimePicker.PM : $.ibi.ibxTimePicker.AM);
		}
		else {

			//Consideration for midnight
			if (date.hour === 0) {
				hourOffset = 12;
				this._meridianSpinner.ibxWidget("setValue", $.ibi.ibxTimePicker.AM);
			}
			else {
				hourOffset = (date.hour > 12) ? -12 : 0;
				this._meridianSpinner.ibxWidget("setValue", (date.hour > 12) ? $.ibi.ibxTimePicker.PM : $.ibi.ibxTimePicker.AM);
			}
		}


		this._hourSpinner.ibxWidget("setValue", date.hour + hourOffset);
		this._minuteSpinner.ibxWidget("setValue", date.minute);
		this._secondSpinner.ibxWidget("setValue", date.second);
		this._milliSecondSpinner.ibxWidget("setValue", date.milliSecond);
	}
});

$.ibi.ibxTimePicker.units = {
	HOUR: 1,
	MINUTE: 2,
	SECOND: 3,
	MILLISECOND: 4,
	MERIDIAN: 5
}
$.ibi.ibxTimePicker.AM = 0;
$.ibi.ibxTimePicker.PM = 1;