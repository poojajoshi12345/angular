/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxSlider", $.ibi.ibxGrid,
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
			"minTextPos": "none",
			"minTextPos": "none",
			"valueTextPos": "none",
			//"textPosition": "none",
			"fnFormat": null,
			"align": "center",
			"cols": "auto 1fr auto",
			"rows": "auto 1fr auto",
			"align": "stretch",
		},
	_widgetClass: "ibx-slider",
	_create: function ()
	{
		this._super();
		this._labelMin = $('<div class="ibx-slider-label-min">').ibxLabel({ 'justify': 'center' });
		this._labelMax = $('<div class="ibx-slider-label-max">').ibxLabel({ 'justify': 'center' });
		this._labelValue = $('<div class="ibx-slider-label-value">').ibxLabel({ 'justify': 'center' });

		this._sliderWrapper = $('<div class="ibx-slider-wrapper">');

		this._sliderBody = $('<div class="ibx-slider-body">');
		this._sliderWrapper.append(this._sliderBody);
		this._slider = $('<div class="ibx-default-ctrl-focus ibx-slider-marker ibx-slider-marker-one" tabIndex="1">');
		this._slider.hide();
		this._sliderWrapper.append(this._slider);
		this.element.append(this._sliderWrapper);
		this.element.append(this._labelValue, this._labelMin, this._sliderWrapper, this._labelMax);
		this._fnSliderMouseEvent = this._onSliderMouseEvent.bind(this);
		this.element.on("mousedown", this._fnSliderMouseEvent);
		this._slider.on("keydown", this._onSliderKeyDown.bind(this));

		window.setTimeout(this._initSlider.bind(this), 1);
	},
	_init: function ()
	{
		this._super();
		var options = this.options;
		if (options.value < options.min)
			options.value = options.min;
		if (options.value > options.max)
			options.value = options.max;
		options.value = this._adjustStep(options.value, options.min, options.max, options.step);
	},
	_initSlider: function ()
	{
		this._setValue("" + this.options.value, this.info());
		this._slider.show();
	},
	_setValue: function (value, data)
	{
		this.refresh();
		this._trigger("change", null, data);
		this._trigger("set_form_value", null, { "elem": this.element, "value": value });
	},
	_activeSlider: null,
	_focusSlider: function (e)
	{
		this._activeSlider = this._slider;
		this._slider.addClass('ibx-slider-marker-move');
		var info = this.info();
		this._moveSlider(e);
		this._slider.focus();
	},
	_moveSlider: function (e)
	{
		if (!this.options.lock)
		{
			var info = this.info();
			this.options.value = this._posMarker(e, info.value, info.min, info.max);
			this._setValue("" + this.options.value, this.info());
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
					if (this._trigger("start", this.info()))
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
					this._trigger("end", this.info())
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
			var info = this.info();
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
			this._setValue("" + this.options.value, this.info());
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
			this.options.fnFormat = fnFormat.bind(this);
		else
			this.options.fnFormat = null;

		this._labelMin.ibxWidget('option', 'text', this._getFormattedText("min"));
		this._labelMax.ibxWidget('option', 'text', this._getFormattedText("max"));
		this._labelValue.ibxWidget('option', 'text', this._getFormattedText("value"));
		this.refresh();
	},
	_getFormattedText: function (val)
	{
		if (this.options.fnFormat)
		{
			return this.options.fnFormat(val, this.info());
		}
		else
		{
			switch (val)
			{
				default:
				case 'value': return '' + this.options.value;
				case 'min': return '' + this.options.min;
				case 'max': return '' + this.options.max;
			}
		}
	},
	info: function ()
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
		this._labelMin.ibxWidget('option', 'text', this._getFormattedText("min"));
		this._labelMax.ibxWidget('option', 'text', this._getFormattedText("max"));
		this._labelValue.ibxWidget('option', 'text', this._getFormattedText("value"));

		var horiz = this.options.orientation == "horizontal";
		var info = this.info();

		var wrapperStart = 2;
		switch (this.options.minTextPos)
		{
			default:
			case 'none':
				this._labelMin.hide();
				this._labelMin.data('ibxRow', horiz?'2':'1');
				this._labelMin.data('ibxCol', horiz?'1':'2');
				wrapperStart = 1;
				break;
			case 'start':
				this._labelMin.data('ibxRow', horiz?'1':'1');
				this._labelMin.data('ibxCol', horiz?'1':'1');
				this._labelMin.show();
				wrapperStart = 1;
				break;
			case 'center':
				this._labelMin.data('ibxRow', horiz?'2':'1');
				this._labelMin.data('ibxCol', horiz?'1':'2');
				this._labelMin.show();
				wrapperStart = 2;
				break;
			case 'end':
				this._labelMin.data('ibxRow', horiz?'3':'1');
				this._labelMin.data('ibxCol', horiz?'1':'3');
				this._labelMin.show();
				wrapperStart = 1;
				break;

		}

		var wrapperEnd = 2;
		switch (this.options.maxTextPos)
		{
			default:
			case 'none':
				this._labelMax.hide();
				this._labelMax.data('ibxRow', horiz?'2':'3');
				this._labelMax.data('ibxCol', horiz?'3':'2');
				wrapperEnd = 3;
				break;
			case 'start':
				this._labelMax.data('ibxRow', horiz?'1':'3');
				this._labelMax.data('ibxCol', horiz?'3':'1');
				this._labelMax.show();
				wrapperEnd = 3;
				break;
			case 'center':
				this._labelMax.data('ibxRow', horiz?'2':'3');
				this._labelMax.data('ibxCol', horiz?'3':'2');
				this._labelMax.show();
				wrapperEnd = 2;
				break;
			case 'end':
				this._labelMax.data('ibxRow', horiz?'3':'3');
				this._labelMax.data('ibxCol', horiz?'3':'3');
				this._labelMax.show();
				wrapperEnd = 3;
				break;

		}
		switch (this.options.valueTextPos)
		{
			default:
			case 'none':
				this._labelValue.hide();
				this._labelValue.data('ibxRow', horiz?'1':'2');
				this._labelValue.data('ibxCol', horiz?'2':'1');
				break;
			case 'start':
				this._labelValue.data('ibxRow', horiz?'1':'2');
				this._labelValue.data('ibxCol', horiz?'2':'1');
				this._labelValue.show();
				break;
			case 'end':
				this._labelValue.data('ibxRow', horiz?'3':'2');
				this._labelValue.data('ibxCol', horiz?'2':'3');
				this._labelValue.show();
				break;

		}



		this._sliderWrapper.data('ibxRow', horiz ? '2' : (wrapperStart + '/span ' + (wrapperEnd - wrapperStart + 1)));
		this._sliderWrapper.data('ibxCol', horiz ? (wrapperStart + '/span ' + (wrapperEnd - wrapperStart + 1)) : '2');


		if (horiz)
		{
			this.options.direction = "row";
			this._sliderWrapper.removeClass('ibx-slider-vertical');
			this._sliderWrapper.addClass('ibx-slider-horizontal');
			this._slider.css('left', Math.ceil((info.value - info.min) * (this._sliderWrapper.outerWidth() - (this.options.edge == "center" ? 0 : this._slider.outerWidth())) / (info.max - info.min) - (this.options.edge == "center" ? (this._slider.outerWidth() / 2) : 0)) + 'px');
			this._slider.css('top', Math.ceil((this._sliderWrapper.outerHeight() - this._slider.outerHeight()) / 2) + "px");
			this.element.removeClass('ibx-slider-vertical');
			this.element.addClass('ibx-slider-horizontal');
			this._labelMin.removeClass('ibx-slider-vertical');
			this._labelMin.addClass('ibx-slider-horizontal');
			this._labelMax.removeClass('ibx-slider-vertical');
			this._labelMax.addClass('ibx-slider-horizontal');
			this._labelValue.removeClass('ibx-slider-vertical');
			this._labelValue.addClass('ibx-slider-horizontal');
			this._sliderBody.removeClass('ibx-slider-body-vertical');
			this._sliderBody.addClass('ibx-slider-body-horizontal');
			this._sliderBody.css('top', Math.ceil((this._sliderWrapper.outerHeight() - this._sliderBody.outerHeight()) / 2) + "px");
		}
		else
		{
			this.options.direction = "column";
			this.options.iconPosition = "bottom";
			this._sliderWrapper.removeClass('ibx-slider-horizontal');
			this._sliderWrapper.addClass('ibx-slider-vertical');
			this._slider.css('top', Math.ceil((info.value - info.min) * (this._sliderWrapper.outerHeight() - (this.options.edge == "center" ? 0 : this._slider.outerHeight())) / (info.max - info.min) - (this.options.edge == "center" ? (this._slider.outerHeight() / 2) : 0)) + 'px');
			this._slider.css('left', Math.ceil((this._sliderWrapper.outerWidth() - this._slider.outerWidth()) / 2) + "px");
			this.element.removeClass('ibx-slider-horizontal');
			this.element.addClass('ibx-slider-vertical');
			this._labelMin.removeClass('ibx-slider-horizontal');
			this._labelMin.addClass('ibx-slider-vertical');
			this._labelMax.removeClass('ibx-slider-horizontal');
			this._labelMax.addClass('ibx-slider-vertical');
			this._labelValue.removeClass('ibx-slider-horizontal');
			this._labelValue.addClass('ibx-slider-vertical');
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


$.widget("ibi.ibxRange", $.ibi.ibxSlider,
{
	options:
		{
			"value2": 0,
			"lock2": false,
			"markerShape2": "",
		},
	_widgetClass: "ibx-range",
	_create: function ()
	{
		this._super();
		this._sliderRangeBody = $('<div class="ibx-slider-range-body">');
		this._sliderRangeBody.insertBefore(this._slider);
		this._slider2 = $('<div class="ibx-default-ctrl-focus ibx-slider-marker ibx-slider-marker-two" tabIndex="1">');
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
		this._setValue("" + this.options.value + "," + this.options.value2, this.info());
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
			if (e.target == this._slider[0])
			{
				if (this.options.value == this.options.value2 && this.options.value == this.options.min)
					this._activeSlider = this._slider2;
				else
					this._activeSlider = this._slider;
			}
			else if (e.target == this._slider2[0])
			{
				if (this.options.value == this.options.value2 && this.options.value == this.options.max)
					this._activeSlider = this._slider;
				else
					this._activeSlider = this._slider2;
			}
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
		}

		this._activeSlider.addClass('ibx-slider-marker-move');
		var info = this.info();
		this._moveSlider(e);
		this._activeSlider.focus();
	},
	_moveSlider: function (e)
	{
		if (this._activeSlider.is(this._slider) && this.options.lock)
			return;
		if (this._activeSlider.is(this._slider2) && this.options.lock2)
			return;

		var info = this.info();
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
		this._setValue("" + this.options.value + "," + this.options.value2, this.info());
	},
	_stepSlider: function (bLeft)
	{
		if (this._activeSlider.is(this._slider) && this.options.lock)
			return;
		if (this._activeSlider.is(this._slider2) && this.options.lock2)
			return;

		var info = this.info();
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

		this._setValue("" + this.options.value + "," + this.options.value2, this.info());
	},
	_getFormattedText: function (val)
	{
		if (this.options.fnFormat)
		{
			return this.options.fnFormat(val, this.info());
		}
		else
		{
			switch (val)
			{
				default:
				case 'value': return '' + this.options.value + ',' + this.options.value2;
				case 'min': return '' + this.options.min;
				case 'max': return '' + this.options.max;
			}
		}
	},
	info: function ()
	{
		return $.extend({}, this._super(), { value: parseInt(this.options.value, 10), value2: parseInt(this.options.value2, 10) });
	},
	_destroy: function ()
	{
		this._super();
	},
	refresh: function ()
	{
		var info = this.info();

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
		var markerShape = this.options.markerShape2 ? this.options.markerShape2 : this.options.markerShape;
		if (markerShape == 'circle')
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
		var info = this.info();
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
		var info = this.info();
		this._moveSlider(e);
		this._activeSlider.focus();
	},
});

$.widget("ibi.ibxHLeftRange", $.ibi.ibxLeftRange, { options: { orientation: "horizontal" } });
$.widget("ibi.ibxHRightRange", $.ibi.ibxRightRange, { options: { orientation: "horizontal" } });
$.widget("ibi.ibxVLeftRange", $.ibi.ibxLeftRange, { options: { orientation: "vertical" } });
$.widget("ibi.ibxVRightRange", $.ibi.ibxRightRange, { options: { orientation: "vertical" } });


//# sourceURL=slider.ibx.js
