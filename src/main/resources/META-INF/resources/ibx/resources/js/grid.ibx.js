/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	GRID
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


$.widget("ibi.ibxGrid", $.ibi.ibxWidget,
{
	options:
	{
		"columns": "",
		"columnsIe": "",
		"columnsWebkit": "",
		"rows": "",
		"rowsIe": "",
		"rowsWebkit": "",
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

		// webkit
		this.element.css('grid-template-columns', options.columnWebkit ? options.columnWebkit: options.columns);
		this.element.css('grid-template-rows', options.rowsWebkit ? options.rowsWebkit : options.rows);

		// IE
		this.element[0].style.msGridColumns = options.columnsIe ? options.columnsIe : options.columns;
		this.element[0].style.msGridRows = options.rowsIe ? options.rowsIe : options.rows;

		this.element.children().each(function (idx, cell)
		{
			cell = $(cell);
			var col = cell.data("ibxColumn") || (idx+1);
			var colSpan = cell.data("ibxColumnSpan") || 1;
			var row = cell.data("ibxRow") || 1;
			var rowSpan = cell.data("ibxRowSpan") || 1;

			// webkit
			cell.css('grid-area', row + " / " + col + " / " + (row + rowSpan) + " / " + (col + colSpan));

			// IE
			cell[0].style.msGridColumn = col;
			cell[0].style.msGridColumnSpan = colSpan;
			cell[0].style.msGridRow = row;
			cell[0].style.msGridRowSpan = rowSpan;
		});
	}
});


//# sourceURL=grid.ibx.js
