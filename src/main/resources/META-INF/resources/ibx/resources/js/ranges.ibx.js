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
	_onClick:function(e){
		var bounds = this.element[0].getBoundingClientRect();
		this.addRange(e.clientX - bounds.left);
		console.log(this.getRanges());
	},
	_ranges: [],
	addRange:function(val) {
		this._ranges.push({pct: val/this.element.width(), color: `rgb(${Math.random() * 255}, 0, 0)`});
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
			var elRange = $("<div class='ibx-ranges-range'>").css({width: range.end - range.start, backgroundColor:range.color}).text(`${range.pct }`);
			this.element.append(elRange);
		}
	}
});
//# sourceURL=ranges.ibx.js