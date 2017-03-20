/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	GRID
******************************************************************************/
function IbxGrid()
{
	if (_biInPrototype) return;
		IbxHBox.call(this);
	this._widgetCtor = $.ibi.ibxGrid;
	application.getWindow().addEventListener("resize", this._onWindowResize, this);
	this.addEventListener("resize", this._onResize, this);
}
_p = _biExtend(IbxGrid, IbxHBox, "IbxGrid");
IbxGrid.base = IbxHBox.prototype;
IbxWidget.addWidgetProperty(IbxGrid,"columnCount");
IbxGrid.setColSpan = function(o, colSpan)
{
	o._setHtmlAttribute("data-ibx-col-span", colSpan);
};
_p._onWindowResize = function(e)
{
	this._onResize(e);
};
_p._onResize = function(e)
{
	var children = this._children;
	for(var i = 0; i < children.length; ++i)
	{
		children[i].layoutComponent();
		children[i].layoutAllChildren();
	}
};

$.widget("ibi.ibxGrid", $.ibi.ibxHBox, 
{
	options:
	{
		"columnCount":12,
		"wrap":true,
	},
	_widgetClass:"ibx-grid",
	_create:function()
	{
		this._super();
		$(window).on(MediaQuery.EVENT_MEDIA_CHANGE, this._onMediaChange.bind(this));
	},
	_destroy:function()
	{
		this._super();
	},
	_onMediaChange:function(e, mql)
	{
		if(mql.matches)
			this.refresh();
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
			var cellClasses = sformat("ibx-grid-cell ibx-grid-span-{1}", colSpan);
			var width = (colSpan * colSize);
			cell.addClass(cellClasses).css("width", sformat("{1}%", width));
		}.bind(this, colSize));
	}
});
$.ibi.ibxGrid.statics = 
{
};


//# sourceURL=grid.ibx.js
