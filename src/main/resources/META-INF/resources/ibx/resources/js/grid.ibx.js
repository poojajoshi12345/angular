/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	CSS GRID
******************************************************************************/
$.widget("ibi.ibxGrid", $.ibi.ibxWidget,
{
	options:
	{
		"inline":false,
		"autoFlow":"",

		"justify":"",
		"justifyContent":"",
		
		"align":"",
		"alignContent":"",

		"areas":"",

		"cols":"", //length unit, auto, min-content, max-content, minmax(a,b), (fr)actional
		"colGap":"",
		"autoCols":"",

		"rows": "", //length unit, auto, min-content, max-content, minmax(a,b), (fr)actional
		"rowGap":"",
		"autoRows":"",
	},
	_widgetClass: "ibx-grid",
	_create: function ()
	{
		this._super();
		this.element.ibxMutationObserver(
		{
			listen: true,
			fnAddedNodes: this._onChildAdded.bind(this),
			fnRemovedNodes: this._onChildRemoved.bind(this),
			init: { childList: true }
		});
	},
	_onChildAdded: function (node, mutation)
	{
		this.refresh();
	},
	_onChildRemoved: function (node, mutation)
	{
	},
	_destroy: function ()
	{
		this.element.ibxMutationObserver('destroy');
		this._super();
	},
	refresh: function ()
	{
		this._super();
		var options = this.options;

		var gridCss = 
		{
			"grid-template-columns":	options.cols,
			"grid-template-rows":		options.rows,
			"grid-columns":				options.cols,
			"grid-rows":				options.rows,
			"justify-items":			options.justify,
			"align-items":				options.align,
		}
		this.element.css(gridCss);
		options.inline ? this.element.addClass("gd-inline") : this.element.removeClass("gd-inline");

		this.element.children().each(function(options, idx, cell)
		{
			cell = $(cell);
			var css = 
			{
				"grid-column":			cell.data("ibxCol") || (idx + 1),
				"grid-column-span":		cell.data("ibxColSpan") || 1,
				"grid-column-align":	cell.data("ibxJustify") || options.justify,
				"justify-self":			cell.data("ibxJustify"),

				"grid-row":				cell.data("ibxRow") || 1,
				"grid-row-span":		cell.data("ibxRowSpan") || 1,
				"grid-row-align":		cell.data("ibxAlign") || options.justify,
				"align-self":			cell.data("ibxAlign"),
			}
			cell.css(css).addClass("ibx-grid-cell");
		}.bind(this, options));		
	}
});

/****
	These extensions are what stops jQuery from adding 'px' to these properties when setting $(xxx).css(yyy, zzz).
	jQuery is also smart enough to check if these properties are vendor prefixed when setting them (-ms, -moz, -webkit)
****/
$.extend($.cssNumber, 
{
	gridColumn:true,
	gridColumnSpan:true,
	gridRow:true,
	gridRowSpan:true,
});


/******************************************************************************
	FLEX GRID
******************************************************************************/
$.widget("ibi.ibxFlexGrid", $.ibi.ibxHBox, 
{
	options:
	{
		"columnCount":12,
		"wrap":true,
	},
	_widgetClass:"ibx-flex-grid",
	_create:function()
	{
		this._super();
	},
	_destroy:function()
	{
		this._super();
	},
	_colSize:-1,
	colSize:function()
	{
		return this._colSize;
	},
	refresh:function()
	{
		this._super();
		var options = this.options;
		var colSize = this._colSize = (100/options.columnCount);
		this.element.children().each(function(colSize, idx, cell)
		{
			cell = $(cell);
			var colSpan = cell.data("ibxColSpan") || 1;
			var cellClasses = sformat("ibx-flex-grid-cell ibx-flex-grid-span-{1}", colSpan);
			var width = (colSpan * colSize);
			cell.addClass(cellClasses).css("width", sformat("{1}%", width));
		}.bind(this, colSize));
	}
});
$.ibi.ibxFlexGrid.statics = 
{
};
//# sourceURL=grid.ibx.js
