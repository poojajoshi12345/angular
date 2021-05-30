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
	_onClick:function(e){
		this.addBoundary(e.offsetX);
		console.log(this.getRanges());
	},
	_ranges: [],
	addBoundary:function(val) {
		this._ranges.push({pct: val/this.element.width()});
		this.refresh();
	},
	getRanges: function() {
		var options = this.options;
		var ranges = this._ranges;

		ranges.sort(function(e1, e2) {
			return (e1.pct < e2.pct ? -1 : 1);
		});

		for(var i = 0; i < ranges.length; ++i){
			var range = ranges[i];
			range.start = (i === 0) ? 0 : Math.round(100 * ranges[i-1].pct);
			range.end = Math.round(100 * range.pct);
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
			var elRange = $("<div class='ibx-ranges-range'>").css("width",  range.pct * size ).text(`${i}`);
			this.element.append(elRange);
		}
	}
});
//# sourceURL=ranges.ibx.js