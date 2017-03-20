/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:
function IbxSlider()
{
	if (_biInPrototype) return;
	IbxLabel.call(this);
	this._widgetCtor = $.ibi.ibxSlider;
}
var _p = _biExtend(IbxSlider, IbxLabel, "IbxSlider");
IbxSlider.base = IbxLabel.prototype;
IbxWidget.addWidgetProperty(IbxSlider, "value");
IbxWidget.addWidgetProperty(IbxSlider, "min");
IbxWidget.addWidgetProperty(IbxSlider, "max");
IbxWidget.addWidgetProperty(IbxSlider, "range");
IbxWidget.addWidgetProperty(IbxSlider, "step");
IbxWidget.addWidgetProperty(IbxSlider, "lock");
IbxWidget.addWidgetProperty(IbxSlider, "orientation");
IbxWidget.addWidgetProperty(IbxSlider, "edge");
IbxWidget.addWidgetProperty(IbxSlider, "markerShape");
IbxWidget.addWidgetProperty(IbxSlider, "textPosition");

IbxWidget.addWidgetEvent(IbxTextField, "start");
IbxWidget.addWidgetEvent(IbxTextField, "stop");
IbxWidget.addWidgetEvent(IbxTextField, "change");

function IbxHSlider()
{
	if (_biInPrototype) return;
	IbxSlider.call(this);
	this._widgetCtor = $.ibi.ibxHSlider;
}
var _p = _biExtend(IbxHSlider, IbxSlider, "IbxHSlider");
IbxHSlider.base = IbxSlider.prototype;

function IbxVSlider()
{
	if (_biInPrototype) return;
	IbxSlider.call(this);
	this._widgetCtor = $.ibi.ibxVSlider;
}
var _p = _biExtend(IbxVSlider, IbxSlider, "IbxVSlider");
IbxVSlider.base = IbxSlider.prototype;


$.widget("ibi.ibxSlider", $.ibi.ibxLabel,
{
	options:
		{
			"value": 50,
			"min": 0,
			"max": 100,
			"step": 1,
			"lock": false,
			"orientation": "horizontal",
			"edge": "inside",
			"markerShape": "rectangle",
			"textPosition": "none",
			"fnFormat": null,
		},
	_widgetClass: "ibx-slider",
	_create: function ()
	{
		this._super();
		this._sliderWrapper = $('<div class="ibx-slider-wrapper">');
		this._sliderBody = $('<div class="ibx-slider-body">');
		this._sliderWrapper.append(this._sliderBody);
		this._slider = $('<div class="ibx-default-ctrl-focus ibx-slider-marker" tabIndex="1">');
		this._slider.hide();
		this._sliderWrapper.append(this._slider);
		this.element.append(this._sliderWrapper);
		this._fnSliderMouseEvent = this._onSliderMouseEvent.bind(this);
		this.element.on("mousedown", this._fnSliderMouseEvent);
		this._slider.on("keydown", this._onSliderKeyDown.bind(this));

		var options = this.options;
		if (options.value < options.min)
			options.value = options.min;
		if (options.value > options.max)
			options.value = options.max;
		options.value = this._adjustStep(options.value, options.min, options.max, options.step);

		window.setTimeout(this._initSlider.bind(this), 1);
	},
	_setValue: function (value, data)
	{
		this.options.text = this._getFormattedText();
		this.refresh();
		this._trigger("change", null, data);
		this._trigger("set_form_value", null, { "elem": this.element, "value": value });
	},
	_initSlider: function ()
	{
		this._setValue("" + this.options.value, this._getInfo());
		this.refresh();
		this._slider.show();
	},
	_activeSlider: null,
	_focusSlider: function (e)
	{
		this._activeSlider = this._slider;
		this._slider.addClass('ibx-slider-marker-move');
		var info = this._getInfo();
		this._moveSlider(e);
		this._slider.focus();
	},
	_moveSlider: function (e)
	{
		if (!this.options.lock)
		{
			var info = this._getInfo();
			this.options.value = this._posMarker(e, info.value, info.min, info.max);
			this._setValue("" + this.options.value, this._getInfo());
			this.refresh();
		}
	},
	_onSliderMouseEvent: function (e)
	{
		switch (e.type)
		{
			case "mousedown":
				{
					this._focusSlider(e);
					e.preventDefault();
					if (this._trigger("start", this._getInfo()))
					{
						$(document.body).css("pointerEvents", "none");
						$(document).on("mouseup mousemove", this._fnSliderMouseEvent);
					}
				}
				break;
			case "mouseup":
				{
					$(document.body).css("pointerEvents", "");
					$(document).off("mouseup mousemove", this._fnSliderMouseEvent);
					this._activeSlider.removeClass('ibx-slider-marker-move');
					e.preventDefault();
					this._trigger("end", this._getInfo())
				}
				break;
			case "mousemove":
				{
					this._moveSlider(e);
					e.preventDefault();
				}
				break;
			default:
				break;
		}
	},
	_stepSlider: function (bLeft)
	{
		if (!this.options.lock)
		{
			var info = this._getInfo();
			if (bLeft)
			{
				info.value -= info.step;
				if (info.value < info.min)
					info.value = info.min;
			}
			else
			{
				info.value += info.step;
				if (info.value > info.max)
					info.value = info.max;
			}
			this.options.value = this._adjustStep(info.value, info.min, info.max, info.step);
			this._setValue("" + this.options.value, this._getInfo());
			this.refresh();
		}
	},
	_onSliderKeyDown : function (e)
	{
		if (e.keyCode == 37 || e.keyCode == 38) // left or up - decrease position
		{
			e.stopPropagation();
			e.preventDefault();
			this._activeSlider = $(e.target);
			this._stepSlider(true);
		}
		else if (e.keyCode == 39 || e.keyCode == 40) // right or down - increase position
		{
			e.stopPropagation();
			e.preventDefault();
			this._activeSlider = $(e.target);
			this._stepSlider(false);
		}
	},
	_posMarker: function (e, value, min, max)
	{
		var offset = this._sliderWrapper.offset();
		var posX = offset.left - $(window).scrollLeft();
		var posY = offset.top - $(window).scrollTop();

		var mouseX = e.pageX - $(window).scrollLeft();
		var mouseY = e.pageY - $(window).scrollTop();
		var outerWidth = this._sliderWrapper.outerWidth();
		var outerHeight = this._sliderWrapper.outerHeight();
		var value = this.options.value;

		if (this.options.orientation == "horizontal")
		{
			if (mouseX <= posX)
				value = min;
			else if (mouseX >= posX + outerWidth)
				value = max;
			else
				value = Math.round((mouseX - posX) * (max - min) / outerWidth + min);
		}
		else
		{
			if (mouseY <= posY)
				value = min;
			else if (mouseY >= posY + outerHeight)
				value = max;
			else
				value = Math.round((mouseY - posY) * (max - min) / outerHeight + min);
		}

		return this._adjustStep(value, min, max, this.options.step);
	},
	format: function (fnFormat)
	{
		if (fnFormat)
		{
			this.options.fnFormat = fnFormat.bind(this);
			this.options.text = this._getFormattedText();
			this.refresh();
		}
		else
			return this.options.fnFormat;
	},
	_getFormattedText: function ()
	{
		if (this.options.textPosition == "none")
			return "";
		else
		{
			return "" + (this.options.fnFormat ? this.options.fnFormat(this._getInfo()) : this.options.value);
		}
	},
	_getInfo: function ()
	{
		return { elem: this.element, value: parseInt(this.options.value, 10), min: parseInt(this.options.min, 10), max: parseInt(this.options.max, 10), step: parseInt(this.options.step, 10) };
	},
	_adjustStep: function (val, min, max, step)
	{
		var lower = Math.min(Math.floor((val - min) / step) * step + min, max);
		var higher = Math.min(Math.ceil((val - min) / step) * step + min, max);

		if (val - lower < higher - val)
			return lower;
		else
			return higher;
	},
	_destroy: function ()
	{
		this._super();
	},
	refresh: function ()
	{
		var info = this._getInfo();

		this.element.removeClass("ibx-slider-text-position-start ibx-slider-text-position-end");
		if (this.options.textPosition != "none")
			this.element.addClass("ibx-slider-text-position-" + this.options.textPosition);
		if (this.options.orientation == "horizontal")
		{
			this._sliderWrapper.removeClass('ibx-slider-wrapper-vertical');
			this._sliderWrapper.addClass('ibx-slider-wrapper-horizontal');
			this._slider.css('left', Math.ceil((info.value - info.min) * (this._sliderWrapper.outerWidth() - (this.options.edge == "center" ? 0 : this._slider.outerWidth())) / (info.max - info.min) - (this.options.edge == "center" ? (this._slider.outerWidth() / 2) : 0)) + 'px');
			this._slider.css('top', Math.ceil((this._sliderWrapper.outerHeight() - this._slider.outerHeight()) / 2) + "px");
			this.element.removeClass('ibx-slider-vertical');
			this.element.addClass('ibx-slider-horizontal');
			this._sliderBody.removeClass('ibx-slider-body-vertical');
			this._sliderBody.addClass('ibx-slider-body-horizontal');
			this._sliderBody.css('top', Math.ceil((this._sliderWrapper.outerHeight() - this._sliderBody.outerHeight()) / 2) + "px");
		}
		else
		{
			this.options.iconPosition = "bottom";
			this._sliderWrapper.removeClass('ibx-slider-wrapper-horizontal');
			this._sliderWrapper.addClass('ibx-slider-wrapper-vertical');
			this._slider.css('top', Math.ceil((info.value - info.min) * (this._sliderWrapper.outerHeight() - (this.options.edge == "center" ? 0 : this._slider.outerHeight())) / (info.max - info.min) - (this.options.edge == "center" ? (this._slider.outerHeight() / 2) : 0)) + 'px');
			this._slider.css('left', Math.ceil((this._sliderWrapper.outerWidth() - this._slider.outerWidth()) / 2) + "px");
			this.element.removeClass('ibx-slider-horizontal');
			this.element.addClass('ibx-slider-vertical');
			this._sliderBody.removeClass('ibx-slider-body-horizontal');
			this._sliderBody.addClass('ibx-slider-body-vertical');
			this._sliderBody.css('left', Math.ceil((this._sliderWrapper.outerWidth() - this._sliderBody.outerWidth()) / 2) + "px");
		}

		this._slider.removeClass('ibx-slider-marker-round locked');
		if (this.options.lock)
			this._slider.addClass('locked');
		if (this.options.markerShape == 'circle')
			this._slider.addClass('ibx-slider-marker-round');
		this._super();
	}
});

$.widget("ibi.ibxHSlider", $.ibi.ibxSlider, { options: { orientation: "horizontal" } });
$.widget("ibi.ibxVSlider", $.ibi.ibxSlider, { options: { orientation: "vertical" } });

function IbxRange()
{
	if (_biInPrototype) return;
	IbxSlider.call(this);
	this._widgetCtor = $.ibi.ibxRange;
}
var _p = _biExtend(IbxRange, IbxSlider, "IbxRange");
IbxRange.base = IbxSlider.prototype;
IbxWidget.addWidgetProperty(IbxSlider, "value2");
IbxWidget.addWidgetProperty(IbxSlider, "lock2");

function IbxHRange()
{
	if (_biInPrototype) return;
	IbxRange.call(this);
	this._widgetCtor = $.ibi.ibxHRange;
}
var _p = _biExtend(IbxHRange, IbxRange, "IbxHRange");
IbxHRange.base = IbxRange.prototype;

function IbxVRange()
{
	if (_biInPrototype) return;
	IbxRange.call(this);
	this._widgetCtor = $.ibi.ibxVRange;
}
var _p = _biExtend(IbxVRange, IbxRange, "IbxVRange");
IbxVRange.base = IbxRange.prototype;


$.widget("ibi.ibxRange", $.ibi.ibxSlider,
{
	options:
		{
			"value2": 0,
			"lock2": false,
		},
	_widgetClass: "ibx-range",
	_create: function ()
	{
		this._super();
		this._sliderRangeBody = $('<div class="ibx-slider-range-body">');
		this._sliderRangeBody.insertBefore(this._slider);
		this._slider2 = $('<div class="ibx-default-ctrl-focus ibx-slider-marker" tabIndex="1">');
		this._slider2.hide();
		this._sliderWrapper.append(this._slider2);
		this._slider2.on("keydown", this._onSliderKeyDown.bind(this));

		var options = this.options;
		if (options.value < options.min)
			options.value = options.min;
		if (options.value > options.max)
			options.value = options.max;
		options.value = this._adjustStep(options.value, options.min, options.max, options.step);
		if (options.value2 > options.max)
			options.value2 = options.max;
		if (options.value2 < options.value)
			options.value2 = options.value;
		options.value2 = this._adjustStep(options.value2, options.value, options.max, options.step);
	},
	_initSlider: function ()
	{
		this._super();
		this._setValue("" + this.options.value + "," + this.options.value2, this._getInfo());
		this.refresh();
		this._slider2.show();
	},
	_focusSlider: function (e)
	{
		if (this.options.lock)
			this._activeSlider = this._slider2;
		else if (this.options.lock2)
			this._activeSlider = this._slider;
		else
		{
			var offset1 = this._slider.offset();
			var posX1 = offset1.left - $(window).scrollLeft();
			var posY1 = offset1.top - $(window).scrollTop();

			var offset2 = this._slider2.offset();
			var posX2 = offset2.left - $(window).scrollLeft();
			var posY2 = offset2.top - $(window).scrollTop();

			var mouseX = e.pageX - -$(window).scrollLeft();
			var mouseY = e.pageY - -$(window).scrollTop();

			if (this.options.orientation == "horizontal")
			{
				if (Math.abs(mouseX - posX1) < Math.abs(mouseX - posX2))
					this._activeSlider = this._slider;
				else
					this._activeSlider = this._slider2;
			}
			else
			{
				if (Math.abs(mouseY - posY1) < Math.abs(mouseY - posY2))
					this._activeSlider = this._slider;
				else
					this._activeSlider = this._slider2;
			}
		}

		this._activeSlider.addClass('ibx-slider-marker-move');
		var info = this._getInfo();
		this._moveSlider(e);
		this._activeSlider.focus();
	},
	_moveSlider: function (e)
	{
		if (this._activeSlider.is(this._slider) && this.options.lock)
			return;
		if (this._activeSlider.is(this._slider2) && this.options.lock2)
			return;

		var info = this._getInfo();
		if (this._activeSlider.is(this._slider2))
		{
			this.options.value2 = this._posMarker(e, info.value2, info.min, info.max);
			if (this.options.value2 < this.options.value)
				this.options.value2 = this.options.value;
		}
		else
		{
			this.options.value = this._posMarker(e, info.value, info.min, info.max);
			if (this.options.value > this.options.value2)
				this.options.value = this.options.value2;
			this.options.value = this.options.value;
		}
		this._setValue("" + this.options.value + "," + this.options.value2, this._getInfo());
		this.refresh();
	},
	_stepSlider: function (bLeft)
	{
		if (this._activeSlider.is(this._slider) && this.options.lock)
			return;
		if (this._activeSlider.is(this._slider2) && this.options.lock2)
			return;

		var info = this._getInfo();
		if (bLeft)
		{
			if (this._activeSlider.is(this._slider))
			{
				info.value -= info.step;
				if (info.value < info.min)
					info.value = info.min;
				this.options.value = this.options.value = this._adjustStep(info.value, info.min, info.max, info.step);
			}
			else
			{
				info.value2 -= info.step;
				if (info.value2 < info.value)
					info.value2 = info.value;
				this.options.value2 = this._adjustStep(info.value2, info.min, info.max, info.step);
			}
		}
		else
		{
			if (this._activeSlider.is(this._slider))
			{
				info.value += info.step;
				if (info.value > info.value2)
					info.value = info.value2;
				this.options.value = this.options.value = this._adjustStep(info.value, info.min, info.max, info.step);
			}
			else
			{
				info.value2 += info.step;
				if (info.value2 > info.max)
					info.value2 = info.max;
				this.options.value2 = this._adjustStep(info.value2, info.min, info.max, info.step);
			}
		}

		this._setValue("" + this.options.value + "," + this.options.value2, this._getInfo());
		this.refresh();

	},
	_getFormattedText: function ()
	{
		if (this.options.textPosition == "none")
			return "";
		else
		{
			return "" + (this.options.fnFormat ? this.options.fnFormat(this._getInfo()) : this.options.value + "," + this.options.value2);
		}
	},
	_getInfo: function ()
	{
		return $.extend({}, this._super(), { value: parseInt(this.options.value, 10), value2: parseInt(this.options.value2, 10) });
	},
	_destroy: function ()
	{
		this._super();
	},
	refresh: function ()
	{
		var info = this._getInfo();

		if (this.options.orientation == "horizontal")
		{
			this._slider2.css('left', Math.ceil((info.value2 - info.min) * (this._sliderWrapper.outerWidth() - (this.options.edge == "center" ? 0 : this._slider2.outerWidth())) / (info.max - info.min) - (this.options.edge == "center" ? (this._slider2.outerWidth() / 2) : 0)) + 'px');
			this._slider2.css('top', Math.ceil((this._sliderWrapper.outerHeight() - this._slider2.outerHeight()) / 2) + "px");
			this._sliderRangeBody.removeClass('ibx-slider-range-body-vertical');
			this._sliderRangeBody.addClass('ibx-slider-range-body-horizontal');
			this._sliderRangeBody.css('top', Math.ceil((this._sliderWrapper.outerHeight() - this._sliderRangeBody.outerHeight()) / 2) + "px");
		}
		else
		{
			this._slider2.css('top', Math.ceil((info.value2 - info.min) * (this._sliderWrapper.outerHeight() - (this.options.edge == "center" ? 0 : this._slider2.outerHeight())) / (info.max - info.min) - (this.options.edge == "center" ? (this._slider2.outerHeight() / 2) : 0)) + 'px');
			this._slider2.css('left', Math.ceil((this._sliderWrapper.outerWidth() - this._slider2.outerWidth()) / 2) + "px");
			this._sliderRangeBody.removeClass('ibx-slider-range-body-horizontal');
			this._sliderRangeBody.addClass('ibx-slider-range-body-vertical');
			this._sliderRangeBody.css('left', Math.ceil((this._sliderWrapper.outerWidth() - this._sliderRangeBody.outerWidth()) / 2) + "px");
		}

		this._slider2.removeClass('ibx-slider-marker-round locked');
		if (this.options.lock2)
			this._slider2.addClass('locked');
		if (this.options.markerShape == 'circle')
			this._slider2.addClass('ibx-slider-marker-round');
		this._super();

		if (this.options.orientation == "horizontal")
		{
			this._sliderRangeBody.css('left', this._slider.css("left"));
			this._sliderRangeBody.css('width', (parseInt(this._slider2.css("left"), 10) + this._slider2.outerWidth() - parseInt(this._slider.css("left"), 10)) + "px");
		}
		else
		{
			this._sliderRangeBody.css('top', this._slider.css("top"));
			this._sliderRangeBody.css('height', (parseInt(this._slider2.css("top"), 10) + this._slider2.outerHeight() - parseInt(this._slider.css("top"), 10)) + "px");
		}

	}
});

$.widget("ibi.ibxHRange", $.ibi.ibxRange, { options: { orientation: "horizontal" } });
$.widget("ibi.ibxVRange", $.ibi.ibxRange, { options: { orientation: "vertical" } });


$.widget("ibi.ibxLeftRange", $.ibi.ibxRange,
{
	_create: function ()
	{
		this._super();
		options.value = options.value = this.options.min;
	},
	_initSlider: function ()
	{
		this._super();
		this._slider.hide();
	},
	_focusSlider: function (e)
	{
		this._activeSlider = this._slider2;
		this._activeSlider.addClass('ibx-slider-marker-move');
		var info = this._getInfo();
		this._moveSlider(e);
		this._activeSlider.focus();
	},
});

$.widget("ibi.ibxRightRange", $.ibi.ibxRange,
{
	_create: function ()
	{
		this._super();
		options.value2 = this.options.max;
	},
	_initSlider: function ()
	{
		this._super();
		this._slider2.hide();
	},
	_focusSlider: function (e)
	{
		this._activeSlider = this._slider;
		this._activeSlider.addClass('ibx-slider-marker-move');
		var info = this._getInfo();
		this._moveSlider(e);
		this._activeSlider.focus();
	},
});

$.widget("ibi.ibxHLeftRange", $.ibi.ibxLeftRange, { options: { orientation: "horizontal" } });
$.widget("ibi.ibxHRightRange", $.ibi.ibxRightRange, { options: { orientation: "horizontal" } });
$.widget("ibi.ibxVLeftRange", $.ibi.ibxLeftRange, { options: { orientation: "vertical" } });
$.widget("ibi.ibxVRightRange", $.ibi.ibxRightRange, { options: { orientation: "vertical" } });


//# sourceURL=slider.ibx.js
