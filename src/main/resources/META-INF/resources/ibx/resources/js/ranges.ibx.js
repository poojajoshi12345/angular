/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
$.widget("ibi.ibxRanges", $.ibi.ibxHBox, 
{
	options:
	{
		min: 0,
		max: 100,
		align: "stretch"
	},
	_widgetClass:"ibx-ranges",
	_create:function()
	{
		this._super();
		this.element.on('mousedown', this._onMouseDown.bind(this));
		this.element.on('mouseup', this._onMouseUp.bind(this));
		this.element.on('mousemove', this._onMouseMove.bind(this));
		this.element.on('click', this._onClick.bind(this));
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		return aria;
	},
	_destroy:function()
	{
		this._super();
	},
	_init:function()
	{
		this._super();
	},
	removeRange:function(range) {
		if(!range)
			this._ranges.length = 0;
		this.refresh();
	},
	_onMouseDown:function(e) {
		var target = $(e.target);
		if(target.is('.ibx-ranges-range-resizing'))
			this._resizeInfo = {elRange: target, lastX:e.clientX, lastY:e.clientY};
	},
	_onMouseUp:function(e) {
		var target = $(e.target);
		if(target.is('.ibx-ranges-range-resizing')) {
			delete this._resizeInfo;
		}
	},
	_onMouseMove:function(e) {
		var bounds = e.target.getBoundingClientRect();
		var target = $(e.target);
		if(target.is('.ibx-ranges-range'))
			target.ibxToggleClass('ibx-ranges-range-resizing', e.clientX >= (bounds.right - 5));

		if(e.buttons === 1 && this._resizeInfo){
			var dx = e.clientX - this._resizeInfo.lastX;
			var elRange = this._resizeInfo.elRange;
			var rangeInfo = elRange.data('ibxRangeInfo');
			elRange.width(elRange.width() + dx);
			this._resizeInfo.lastX = e.clientX;
		}
	},
	_onClick:function(e){
		var bounds = this.element[0].getBoundingClientRect();
		var target = $(e.target);
		if(!target.is('ibx-ranges-range-risizing'))
			this.addRange(e.clientX - bounds.left);
	},
	_ranges: [],
	addRange:function(val) {
		this._ranges.push({pct: val/this.element.width(), color: `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`});
		this.refresh();
	},
	getRanges: function() {
		var options = this.options;
		var ranges = this._ranges;

		ranges.sort(function(e1, e2) {
			return (e1.pct < e2.pct ? -1 : 1);
		});

		var width = this.element.width();
		for(var i = 0; i < ranges.length; ++i){
			var range = ranges[i];
			range.start = (i === 0) ? 0 : Math.round(width * ranges[i-1].pct);
			range.end = Math.round(width * range.pct);
		}
		return this._ranges
	},
	_refresh:function()
	{
		var options = this.options;
		this._super();

		this.element.empty();
		var size = this.element.width();
		var ranges = this.getRanges();
		for(var i = 0; i < ranges.length; ++i) {
			var range= ranges[i];
			var elRange = $("<div class='ibx-ranges-range'>").data('ibxRangeInfo', range).css({
				width: range.end - range.start,
				backgroundColor:range.color
			}).text(`${range.pct }`);
			this.element.append(elRange);
		}
	}
});
//# sourceURL=ranges.ibx.js