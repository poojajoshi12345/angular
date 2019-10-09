/*------------------------------------*/
/*                                    */
/*         IBX Time Picker           */
/*                                    */
/*------------------------------------*/

$.widget("ibi.ibxTimePicker", $.ibi.ibxHBox, {
    options: {
        "nameRoot": true,

        "hour": 0,
        "minute": 0,
        "second": 0,
        "meridian": "AM",

        "circularStep": true, //ability to cycle through values in spinners
        "militaryTime": false,  //24 hour clock
        "synchronizedStepping": true, //adjusts hour, minute and meridian as it changes

        "showHour": true,
        "showMinute": true,
        "showSecond": true,
        "showMeridian": true,
        "showColon": true
    },

    _widgetClass: "ibx-time-picker",

    _create: function () {
        this._super();

        //Create Spinners
        this._hourSpinner = $('<div class="ibx-time-picker-spinner ibx-time-picker-spinner-hour">').ibxSpinner();
        this._minuteSpinner = $('<div class="ibx-time-picker-spinner ibx-time-picker-spinner-minute">').ibxSpinner();
        this._secondSpinner = $('<div class="ibx-time-picker-spinner ibx-time-picker-spinner-second">').ibxSpinner();
        this._meridianSpinner = $('<div class="ibx-time-picker-spinner ibx-time-picker-spinner-meridian">').ibxSpinner();

        //Create Colon Divs
        this._minuteColon = $('<div class="ibx-time-picker-colon ibx-time-picker-colon-minute">:</div>');
        this._secondColon = $('<div class="ibx-time-picker-colon ibx-time-picker-colon-second">:</div>');

        //Add Parts to Element
        this.element.ibxWidget("add", this._hourSpinner);
        this.element.ibxWidget("add", this._minuteColon);
        this.element.ibxWidget("add", this._minuteSpinner);
        this.element.ibxWidget("add", this._secondColon);
        this.element.ibxWidget("add", this._secondSpinner);
        this.element.ibxWidget("add", this._colonDivSecond);
        this.element.ibxWidget("add", this._meridianSpinner);
    },


    _init: function () {
        this._super(); 

        //Hour Set Up
        this._hourSpinner.ibxWidget("option", "fnFormat", this._formatTime.bind(this));
        this._hourSpinner.ibxWidget("setValue", this.options.hour);
        this._hourSpinner.on("ibx_change", this._timeChange.bind(this));

        //Minute Set Up
        this._minuteSpinner.ibxWidget("option", "min", 0);
        this._minuteSpinner.ibxWidget("option", "max", 59);
        this._minuteSpinner.ibxWidget("option", "fnFormat", this._formatTime.bind(this));
        this._minuteSpinner.ibxWidget("setValue", this.options.minute);
        this._minuteSpinner.on("ibx_change", this._timeChange.bind(this));

        //Second Set Up
        this._secondSpinner.ibxWidget("option", "min", 0);
        this._secondSpinner.ibxWidget("option", "max", 59);
        this._secondSpinner.ibxWidget("option", "fnFormat", this._formatTime.bind(this));
        this._secondSpinner.ibxWidget("setValue", this.options.second);
        this._secondSpinner.on("ibx_change", this._timeChange.bind(this));

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

        this._meridianSpinner.ibxWidget("option", "min", 0); //0 = AM
        this._meridianSpinner.ibxWidget("option", "max", 1); //1 = PM
        this._meridianSpinner.ibxWidget("option", "fnUnformat", this._unformatMeridian.bind(this)); // Meridian to number
        this._meridianSpinner.ibxWidget("option", "fnFormat", this._formatMeridian.bind(this)); //Number to meridian
        this._meridianSpinner.on("ibx_change", this._timeChange.bind(this));

        // this.element.on("ibx_change", this._timeChange.bind(this));
    },


    _setOption: function (key, value) {
        this._super(key, value);

        if (key === "circularStep") {
            this._minuteSpinner.ibxWidget("option", "circularStep", value);
            this._hourSpinner.ibxWidget("option", "circularStep", value);
        }
        else if (key === "militaryTime") {
            value ? this._hourSpinner.ibxWidget("option", "min", 0) : this._hourSpinner.ibxWidget("option", "min", 1);
            value ? this._hourSpinner.ibxWidget("option", "max", 23) : this._hourSpinner.ibxWidget("option", "max", 12);
            value ? this._meridianSpinner.css("display", "none") : this._meridianSpinner.css("display", "");

            var hourOffset = 0;

            //Convert 12hour to 24hour
            if (value && this.options.meridian === "PM" && this.options.hour !== 12) {
                hourOffset = 12;
            }
            //Convert 24hour to 12hour 
            else if (!value) {
                this.options.meridian = (this.options.hour > 12) ? "PM" : this.options.meridian;
                this._meridianSpinner.ibxWidget("option", "text", this.options.meridian);

                if (this.options.hour > 12) {
                    hourOffset = -12;
                }
            }

            this.options.hour += hourOffset;
            this._hourSpinner.ibxWidget("setValue", this.options.hour);
        }
        else if (key === "showHour" || key === "showMinute" || key === "showSecond" || key === "showMeridian" || key === "showColon") {

            //Meridian
            this.options.showMeridian ? this._meridianSpinner.css("display", "") : this._meridianSpinner.css("display", "none");

            //Second
            this.options.showSecond ? this._secondSpinner.css("display", "") : this._secondSpinner.css("display", "none");
            this.options.showSecond && (this.options.showMinute || this.options.showHour) && this.options.showColon ? this._secondColon.css("display", "") : this._secondColon.css("display", "none");

            //Minute
            this.options.showMinute ? this._minuteSpinner.css("display", "") : this._minuteSpinner.css("display", "none");
            this.options.showMinute && this.options.showHour && this.options.showColon ? this._minuteColon.css("display", "") : this._minuteColon.css("display", "none");

            //Hour
            this.options.showHour ? this._hourSpinner.css("display", "") && this.options.showColon : this._hourSpinner.css("display", "none");
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
        else if (key === "meridian") {
            value === "AM" ? this._meridianSpinner.ibxWidget("option", "value", 0) : this._meridianSpinner.ibxWidget("option", "value", 1);
            this._meridianSpinner.ibxWidget("option", "text", value);
            this.options.meridian = this._meridianSpinner.ibxWidget("option", "text");
        }
    },


    //------- Change Event -------//
    _timeChange: function (event, info) {
        var ctrl = $(event.target);
        var changed = false;

        //Hour Change
        if (ctrl.is(".ibx-time-picker-spinner-hour")) {
            var prev = this.options.hour;
            this.options.hour = this._hourSpinner.ibxWidget("option", "value");

            changed = prev === this.options.hour ? false : true;

            if (this.options.synchronizedStepping && info.prevValue === 11 && this.options.hour === 12) {
                this._meridianSpinner.ibxWidget("stepSpinner", true, 1);
            }
        }

        //Minute Change
        else if (ctrl.is(".ibx-time-picker-spinner-minute")) {
            var prev = this.options.minute;
            this.options.minute = this._minuteSpinner.ibxWidget("option", "value");

            changed = prev === this.options.minute ? false : true;

            if (this.options.synchronizedStepping) {
                //Increase the Hour 
                if (info.stepped && info.prevValue === 59 && info.value === 0) {
                    this._hourSpinner.ibxWidget("stepSpinner", true, 1);
                }
                //Decrease the Hour
                else if (info.stepped && info.prevValue === 00 && info.value === 59) {
                    this._hourSpinner.ibxWidget("stepSpinner", false, 1);
                }
            }
        }

        //Second Change
        else if (ctrl.is(".ibx-time-picker-spinner-second")) {
            
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

        //Meridian Change
        else if (ctrl.is(".ibx-time-picker-spinner-meridian")) {
            changed = this.options.meridian === this._meridianSpinner.ibxWidget("option", "text") ? false : true;
            this.options.meridian = this._meridianSpinner.ibxWidget("option", "text");
        }

        //Dispatch Event
        if (changed) {
            this.element.dispatchEvent("ibx_change", this.time(), true, false);
            event.stopPropagation();
        }

    },


    //------- Formatting -------//
    _formatTime: function (value) {
        if (value < 10) {
            value = "0" + value;
        }

        return value;
    },

    _formatMeridian: function (value) {
        if (value === 0) {
            return "AM";
        }

        return "PM";
    },

    _unformatMeridian: function (value) {
        if (value === "AM" || value === 0) {
            return 0;
        }

        return 1;
    },

    time: function (date) {
        if (date === undefined) {
            var ret = {
                "hour": this.options.hour,
                "minute": this.options.minute,
                "second": this.options.second,
                "meridian": this.options.meridian
            };

            return ret;
        }

        this._hourSpinner.ibxWidget("setValue", data.hour);
        this._minuteSpinner.ibxWidget("setValue", data.minute);
        this._secondSpinner.ibxWidget("setValue", data.second);
        this._meridianSpinner.ibxWidget("option", "text", data.meridian);
    }
});