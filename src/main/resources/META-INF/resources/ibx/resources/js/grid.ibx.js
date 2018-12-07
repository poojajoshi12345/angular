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

		"cols":"",
		"autoCols":"",
		"colGap":"",

		"rows":"",
		"autoRows":"",
		"rowGap":"",

		"areas":"",
		"autoFlow":"",

		"justify":"",
		"justifyContent":"",
		
		"align":"",
		"alignContent":"",
	},
	_widgetClass: "ibx-grid",
	_create: function ()
	{
		this._super();
	},
	_destroy: function ()
	{
		this._super();
	},
	_refresh: function ()
	{
		this._super();
		var options = this.options;

		var gridCss = 
		{
			//IE...do before so standard CSS can override in compliant browsers
			"-ms-grid-columns":			options.cols,
			"-ms-grid-rows":			options.rows,

			//Standard CSS
			"grid-template-columns":	options.cols,
			"grid-auto-columns":		options.autoCols,
			"grid-template-rows":		options.rows,
			"grid-auto-rows":			options.autoRows,
			"grid-template-areas":		options.areas,				//each line must be quoted, ex: " 'a1 a1 a1''a2 . a2''a3 . a3' "
			"grid-auto-flow":			options.autoFlow,
			"grid-column-gap":			options.colGap,
			"grid-row-gap":				options.rowGap,
			"justify-content":			options.justifyContent,		//stretch - default
			"justify-items":			options.justify,			//stretch - default
			"align-content":			options.alignContent,		//stretch - default
			"align-items":				options.align,				//stretch - default
		}
		this.element.css(gridCss);
		options.inline ? this.element.ibxAddClass("gd-inline") : this.element.ibxRemoveClass("gd-inline");

		this.element.children().each(function(options, idx, cell)
		{
			cell = $(cell);
			var cellData = cell.data();
			var colInfo = cellData.ibxCol ? cellData.ibxCol.toString().split("/") : [];
			var colStart = colInfo[0] || "";
			var colEnd = colInfo[1] || "";
			var rowInfo = cellData.ibxRow ? cellData.ibxRow.toString().split("/") : [];
			var rowStart = rowInfo[0] || "";
			var rowEnd = rowInfo[1] || "";
			var css = 
			{
				//IE Columns...do before so standard CSS can override in compliant browsers
				"-ms-grid-column":			colStart,
				"-ms-grid-column-span":		colEnd.replace(/\s*span\s*/, ""),
				"-ms-grid-column-align":	cell.data("ibxJustify") || options.justify,

				//IE Rows...do before so standard CSS can override in compliant browsers
				"-ms-grid-row":				rowStart,
				"-ms-grid-row-span":		rowEnd.replace(/\s*span\s*/, ""),
				"-ms-grid-row-align":		cell.data("ibxAlign") || options.align,

				//Standard CSS Columns
				"grid-column-start":		colStart,
				"grid-column-end":			colEnd,
				"justify-self":				cell.data("ibxJustify"),

				//Standard CSS Rows
				"grid-row-start":			rowStart,
				"grid-row-end":				rowEnd,
				"align-self":				cell.data("ibxAlign"),

				//Standard CSS not supported by IE
				"grid-area":				cell.data("ibxArea"),
			}
			cell.css(css).ibxAddClass("ibx-grid-cell");
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
	gridColumnStart:true,
	gridColumnEnd:true,
	gridColumnSpan:true,
	gridRow:true,
	gridRowStart:true,
	gridRowEnd:true,
	gridRowSpan:true,
});

/******************************************************************************
	DATA GRID
******************************************************************************/
$.widget("ibi.ibxDataGridSelectionManager", $.ibi.ibxSelectionManager,
{
	"options":
	{
		"grid":null,
		"type":"multi",
		"focusDefault":true,
		"focusResetOnBlur":false,
		"navKeyRoot":true,
		"toggleSelection":true,
		"escClearSelection":true,
		"selectableChildren":"dgrid-selectable", //can be elements/classes/etc.
	},
	_widgetClass:"ibx-data-grid-selection-model",
	_onKeyDown:function(e)
	{
		var options = this.options;
		var cell = this.focus();
		if(cell && options.navKeyRoot && [$.ui.keyCode.LEFT, $.ui.keyCode.RIGHT, $.ui.keyCode.UP, $.ui.keyCode.DOWN].indexOf(e.keyCode) != -1)
		{
			var row = cell.parent();
			var idxRow = row.parent().children().index(row[0]);
			var idxCol = row.children().index(cell[0]);
			if(e.keyCode == $.ui.keyCode.LEFT)
				cell = options.grid.getCell(idxRow, idxCol-1);
			else
			if(e.keyCode == $.ui.keyCode.RIGHT)
				cell = options.grid.getCell(idxRow, idxCol+1);
			else
			if(e.keyCode == $.ui.keyCode.UP)
				cell = options.grid.getCell(idxRow-1, idxCol);
			else
			if(e.keyCode == $.ui.keyCode.DOWN)
				cell = options.grid.getCell(idxRow+1, idxCol);

			cell ? this.focus(cell, true) : this._super(e);
			e.preventDefault();
		}
		else
			this._super(e);
	},
});

$.widget("ibi.ibxDataGrid", $.ibi.ibxGrid,
{
	options:
	{
		colMap:[],
		rowMap:[],//not currently used.
		defaultColConfig: {title:"Column", size:"100px", flex:false, justify:"center", resizable:false, selectable:true, visible:true},
		showColumnHeaders:true,
		showRowHeaders:false,
		
		/*frame stuff*/
		cols:"auto 1fr",
		rows:"auto 1fr",
		classes:
		{
			colHeaderBarClass:"dgrid-header-col-bar",
			colHeaderClass:"dgrid-header-col",
			colHeaderSplitterClass:"dgrid-header-col-splitter",
			rowHeaderBarClass:"dgrid-header-row-bar",
			rowHeaderClass:"dgrid-header-row",
			rowHeaderSplitterClass:"dgrid-header-row-splitter",
			gridClass:"dgrid-grid",
			gridRow:"dgrid-row",
			gridCell:"dgrid-cell",
		},
		gridOptions:
		{
			align:"stretch",
			justify:"start",
		},

		/*accessibility stuff*/
		aria:
		{
			role:"grid"
		}
	},
	_widgetClass:"ibx-data-grid",
	_create:function()
	{
		var options = this.options;
		var classes = options.classes;
		var corner = this._corner = $("<div>").ibxAddClass("dgrid-corner").data({ibxCol:1, ibxRow:1});
		var colHeaderBar = this._colHeaderBar = $("<div tabindex='0'>").ibxHBox().ibxAddClass(classes.colHeaderBarClass).data({ibxCol:"2", ibxRow:"1"});
		var rowHeaderBar = this._rowHeaderBar = $("<div tabindex='0'>").ibxVBox({align:"stretch"}).ibxAddClass(classes.rowHeaderBarClass).data({ibxCol:"1", ibxRow:"2"});
		var grid = this._grid = $("<div tabindex='0'>").ibxVBox({align:"stretch"}).ibxAddClass(classes.gridClass).data({ibxCol:"2", ibxRow:"2"});
		grid.on("scroll", this._onGridScroll.bind(this)).ibxDataGridSelectionManager({grid:this});

		colHeaderBar.ibxWidget({navKeyRoot:true});
		rowHeaderBar.ibxWidget({navKeyRoot:true});

		this.add([corner[0], colHeaderBar[0], rowHeaderBar[0], grid[0]]);
		this._super();
	},
	_setAccessibility:function(accessible, aria)
	{
		var options = this.options;
		return aria;
	},
	_buildHeaders:function(which)
	{
		which == which || "both";

		var options = this.options;
		var classes = options.classes;

		if(which == "column" || which == "both")
		{
			this._colHeaderBar.ibxWidget("remove");

			var colMap = options.colMap;
			for(var i = 0; i < colMap.length; ++i)
			{
				var cInfo = colMap[i] = $.extend({}, options.defaultColConfig, colMap[i]);
				var size = sformat("width:{1};flex:{2} 0 auto;", cInfo.size, cInfo.flex ? 1 : 0);

				//make header
				var cHeading = $(sformat("<div tabindex='-1' class='{1}' style='{2};'>{3}</div>", classes.colHeaderClass, size, cInfo.title))
				cHeading.ibxButtonSimple({justify:cInfo.justify || "start"});
				cHeading.attr("role", "columnheader");

				//make splitter
				var splitter = $(sformat("<div class='{1}'>", classes.colHeaderSplitterClass));
				splitter.ibxSplitter({locked:!cInfo.resizable || (i == colMap.length-1), resize:"first"}).on("ibx_resize ibx_reset", this._onSplitterResize.bind(this));
				cInfo._ui = {"header":cHeading, "splitter":splitter};

				//let people change the header
				this.element.dispatchEvent("ibx_gridheadercreate", {"grid":this.element, "type":"column", "idx": i, "header":cHeading[0], "splitter":splitter[0]});
				this._colHeaderBar.ibxWidget("add", [cHeading[0], splitter[0]]);
			}

			var padding = $("<div style='flex:0 0 auto;'>").css({"width":"20px", height:"1px"});
			this._colHeaderBar.append(padding);
		}

		if(which == "row" || which == "both")
		{
			this._rowHeaderBar.ibxWidget("remove");

			var nRows = this.getRowCount();
			for(var i = 0; i < nRows; ++i)
			{
				//make header
				var row = this.getRow(i);
				var size = sformat("height:{1}px;", row.outerHeight());
				var rHeading = $(sformat("<div tabindex='-1' class='{1}' style='{2};'>{3}</div>", options.classes.rowHeaderClass, size, i+1))
				rHeading.ibxButtonSimple({justify:"center"});
				rHeading.attr("role", "rowheader");

				//let people change the header
				this.element.dispatchEvent("ibx_gridheadercreate", {"grid":this.element, "type":"row", "idx": i, "header":rHeading[0]});
				this._rowHeaderBar.ibxWidget("add", rHeading[0]);
			}
			var padding = $("<div style='flex:0 0 auto;'>").css({"width":"1px", height:"20px"});
			this._rowHeaderBar.append(padding);
		}
	},
	getHeaders:function(row)
	{
		var headerBar = row ? this._rowHeaderBar : this._colHeaderBar;
		var headerClass = row ? this.options.classes.rowHeaderClass : this.options.classes.colHeaderClass;
		return headerBar.children("." + headerClass);
	},
	getCell:function(idxRow, idxCol)
	{
		var ret = null;
		var row = this.getRow(idxRow);
		return row.children(sformat(":nth-child({1})", idxCol + 1)) || null;
	},
	getColumnCount:function()
	{
		return this.options.colMap.length;
	},
	getColumn:function(idxCol)
	{
		var classes = this.options.classes;
		var filter = sformat(".{1} > .{2}:nth-child({3})", classes.gridRow, classes.gridCell, idxCol + 1);
		return this._grid.find(filter) || null;
	},
	showColumn:function(idxCol, show)
	{
		var cells = this.getColumn(idxCol);
		var cInfo = this.options.colMap[idxCol];
		if(cInfo && cInfo._ui)
			cells = cells.add(cInfo._ui.header).add(cInfo._ui.splitter);
		cells.ibxToggleClass("dgrid-col-hidden", !show);
	},
	selectColumn:function(idxCol, select, addSelection)
	{
		var cells = this.getColumn(idxCol);
		if(!addSelection)
			this._grid.ibxDataGridSelectionManager("deselectAll", true);
		this._grid.ibxDataGridSelectionManager("selected", cells.toArray(), select);
	},
	getRowCount:function()
	{
		return this._grid.find("." + this.options.classes.gridRow).length;
	},
	getRow:function(idxRow)
	{
		var filter = sformat(".{1}:nth-child({2})", this.options.classes.gridRow, idxRow+1);
		return this._grid.children(filter).children(sformat(".{1}", this.options.classes.gridCell)) || null;
	},
	showRow:function(idxRow, show)
	{
		var cells = this.getRow(idxRow);
		var cInfo = this.options.rowMap[idxRow];
		if(cInfo && cInfo._ui)
			cells = cells.add(cInfo._ui.header).add(cInfo._ui.splitter);
		cells.ibxToggleClass("dgrid-row-hidden", !show);
	},
	selectRow:function(idxRow, select, addSelection)
	{
		var cells = this.getRow(idxRow);
		if(!addSelection)
			this._grid.ibxDataGridSelectionManager("deselectAll", true);
		this._grid.ibxDataGridSelectionManager("selected", cells.toArray(), select);
	},
	addRow:function(cells, sibling, before, refresh)
	{
		var options = this.options;
		var selOptions = this._grid.ibxDataGridSelectionManager("option");
		var row = $("<div>").ibxHBox().ibxAddClass(options.classes.gridRow);

		//create extra columns less than cells.
		while(cells.length > options.colMap.length)
			options.colMap.push($.extend({}, options.defaultColConfig));

		//create extra cells less than columns.
		while(cells.length < options.colMap.length)
			cells.push($("<div>")[0]);

		//make sure the cells and row have proper aria stuff, classes, etc.
		$(cells).attr({"role":"gridcell", "tabindex":"-1"}).ibxAddClass(options.classes.gridCell).data("ibxGridRow", row[0]).each(function(idx, el)
		{
			var cInfo = options.colMap[idx];
			$(el).ibxToggleClass(selOptions.selectableChildren, cInfo.selectable);
		}.bind(this));

		row.attr("role", "row").append(cells);
		this._grid.append(row);

		//refresh will rebuild the headers.
		if(refresh)
			this.refresh();
		return row[0];
	},
	addRows:function(rows, sibling, before, refresh)
	{
		var ret = [];
		for(var i = 0; i < rows.length; ++i)
			ret.push(this.addRow(rows[i], sibling, before, refresh));
		return ret;
	},
	removeRow:function(row, destroy, refresh)
	{
		this._grid.ibxWidget("remove", row, destroy, refresh);
	},
	removeAll:function()
	{
		this._grid.ibxWidget("remove");
	},
	_onSplitterResize:function(e, resizeInfo)
	{
		var splitter = $(e.target);
		var sWidth = splitter.outerWidth();
		var e1lWidth = resizeInfo.el1.outerWidth();
		var colMap = this.options.colMap;

		var idxEl = splitter.siblings(".dgrid-header-col").index(resizeInfo.el1);
		var cells = this._grid.find(sformat(".dgrid-row > .{1}:nth-child({2})", this.options.classes.gridCell, idxEl+1));
		cells.outerWidth(e1lWidth + sWidth);
	},
	_onGridScroll:function(e)
	{
		var scrollX = this._grid.prop("scrollLeft");
		var scrollY = this._grid.prop("scrollTop");
		this._colHeaderBar.prop("scrollLeft", scrollX);
		this._rowHeaderBar.prop("scrollTop", scrollY);
	},
	_setOption:function(key, value)
	{
		var options = this.options;
		if(key == "colMap")
		{
			//make sure passed configs have all missing values with defaults.
				$.each(value, function(idx, colConfig)
				{
				var config = $.extend({}, options.defaultColConfig, colConfig);
				$.extend(colConfig, config);
				}.bind(this));
		}
		if(key == "defaultColConfig")
			value = $.extend({}, options.defaultColConfig, value);
		this._super(key, value);
	},
	_refresh:function()
	{
		var options = this.options;
		this._colHeaderBar.ibxToggleClass("dgrid-header-bar-hidden", !options.showColumnHeaders);
		this._rowHeaderBar.ibxToggleClass("dgrid-header-bar-hidden", !options.showRowHeaders);
		this._super();

		//update the header bars regardless of visibility, as they control the grid cell sizes.
		if(options.showColumnHeaders)
			this._buildHeaders("column");
		if(options.showRowHeaders)
			this._buildHeaders("row");

		//update column widths
		console.error("YOU NEED TO OPTIMIZE THIS SO IT DOESN'T KEEP RECALCING THE CELLS!");
		if(options.colMap.length)
		{
			var splitterSize = $(this._colHeaderBar[0].querySelector(".dgrid-header-col-splitter")).outerWidth();
			var colMap = options.colMap;
			for(var i = 0; i < colMap.length; ++i)
			{
				cInfo = colMap[i];
				var cells = this.getColumn(i);

				cellSize = cInfo.size;
				if(cInfo._ui)
					cellSize = cInfo._ui.header.outerWidth() + cInfo._ui.splitter.outerWidth();
				cInfo.flex ? cells.css({flex:"1 0 auto", width:cellSize}) : cells.outerWidth(cellSize);
			}
		}

		//this is like a refresh for the selection model..will adjust the classes of the selectable children correctly.
		this._grid.ibxDataGridSelectionManager("selectableChildren");
	}
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
		"childSizing":"border"
	},
	_widgetClass:"ibx-flex-grid",
	_create:function()
	{
		this._super();
	},
	_destroy:function()
	{
		this.remove(".ibx-flex-grid-cell");
		this._super();
	},
	remove:function(el, destroy, refresh)
	{
		this.children().removeAttr("data-grid-row data-grid-col data-grid-span").ibxRemoveClass("ibx-flex-grid-cell");
		this._super(el, destroy, refresh);
	},
	_colSize:-1,
	colSize:function()
	{
		return this._colSize;
	},
	row:function(row)
	{
		return this.children(sformat("[data-grid-row='{1}']", row));
	},
	column:function(col)
	{
		return this.children(sformat("[data-grid-col='{1}']", col));
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		var colSize = this._colSize = (100/options.columnCount);
		var curRow = 0;
		var spanCount = 0;
		this.element.children().each(function(idx, cell)
		{
			cell = $(cell);
			if(spanCount >= options.columnCount)
			{
				curRow++;
				spanCount = 0;
			}
			colSpan = cell.data("ibxColSpan") || 1;
			var cellClasses = sformat("ibx-flex-grid-cell ibx-flex-grid-span-{1}", colSpan);
			var width = (colSpan * colSize);
			cell.ibxAddClass(cellClasses).css("width", sformat("{1}%", width))
			cell.attr({"data-grid-row": curRow, "data-grid-col": spanCount, "data-grid-span": colSpan});
			spanCount += colSpan;
		}.bind(this));
	}
});
$.ibi.ibxFlexGrid.statics = 
{
};
//# sourceURL=grid.ibx.js
