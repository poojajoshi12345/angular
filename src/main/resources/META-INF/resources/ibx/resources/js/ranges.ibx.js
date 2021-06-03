/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
$.widget("ibi.ibxRanges", $.ibi.ibxHBox, 
{
	options:
	{
		min: 0,
		max: 100,
		clickToAdd: true,
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
			this._resizeInfo = {rangeInfo: target.data('ibxRangeInfo'), lastX:e.clientX, lastY:e.clientY};
	},
	_onMouseUp:function(e) {
		var target = $(e.target);
		delete this._resizeInfo;
	},
	_onMouseMove:function(e) {
		var target = $(e.target);
		if(target.is('.ibx-ranges-range'))
			target.ibxToggleClass('ibx-ranges-range-resizing', e.clientX >= (e.target.getBoundingClientRect().right - 8));

		if(e.buttons === 1 && this._resizeInfo){
			var bounds = e.currentTarget.getBoundingClientRect();
			var rangeInfo = this._resizeInfo.rangeInfo;
			rangeInfo.pct = (e.clientX - bounds.left)/bounds.width;
			this.refresh();
		}
	},
	_onClick:function(e){
		var bounds = this.element[0].getBoundingClientRect();
		var target = $(e.target);
		if(this.options.clickToAdd && !target.is('ibx-ranges-range-risizing'))
			this.addRange({pct: (e.clientX - bounds.left)/bounds.width, color: `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`});
	},
	_ranges: [],
	addRange:function(ranges) {
		ranges = (ranges instanceof Array) ? ranges : [ranges];
		ranges.forEach(function(range){
			range = (range instanceof Object) ? range : {pct: range, color: 'transparent'};
			this._ranges.push(range);
		}.bind(this));
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
			range.start = (i === 0) ? 0 : Math.round(width * (ranges[i-1].pct));
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
			range.elRange = elRange = $("<div class='ibx-ranges-range'>").css({width: range.end - range.start, backgroundColor:range.color})
				.text(`${parseInt(range.pct * 100)}%`);
			elRange.data('ibxRangeInfo', range);
			this.element.append(elRange);
		}
	}
});
//# sourceURL=ranges.ibx.js